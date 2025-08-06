import os
import json
import re
from datetime import date, timedelta
from django.utils.timezone import now
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from authentication import serializers
from authentication.exceptions import (
    UserAlreadyExistsException,
    UsernameEmailAlreadyExistsException,
)
from authentication.services.cloudinary_service import delete_image
from authentication.utils import add_cookies
from authentication.services import user_service, jwt_service, auth_service
from authentication.utils import format_validation_errors

User = get_user_model()


def create_user(request):

    try:
        body = json.loads(request.body.decode("utf-8"))

        if body["username"]:
            body["username"] = body["username"].lower()

        if body["email"]:
            body["email"] = body["email"].lower()

        body["picture"] = (
            f"/default_profile.png"
        )

        # if the email found isn't verified after 15 min, delete it
        user = User.objects.get(email=body["email"])
        is_verification_expired = now() - user.created_at > timedelta(minutes=15)
        if not user.email_verified and is_verification_expired:
            user.delete()
    except User.DoesNotExist:
        pass
    except Exception as e:
        return Response({"error": str(e)}, status=400)

    try:
        if not re.match(r"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$", body['password']):
            return Response({"error": "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character."}, status=400)
        new_user = User(**body)
        new_user.set_password(body["password"])
        auth_service.get_otp_code(new_user)
        new_user.full_clean()
        new_user.save()
        new_user.friends.set([])
    except ValidationError as e:
        errors = format_validation_errors(e)
        return Response(errors, status=400)
    except Exception as e:
        return Response({"error": "Username or Email already exists"}, status=400)

    try:
        serializer = serializers.UserSerializer(new_user)
        response = Response(serializer.data, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

    # send verif email

    try:
        tokens = jwt_service.get_tokens_for_user(new_user)

        verification_url = request.build_absolute_uri(
            f"{os.getenv('VITE_API_URL')}/api/verify-email?token={tokens['access']}"
        )

        send_mail(
            subject="Verify Your Email",
            message=f"Click the link to verify your email:\n{verification_url}\n\nPlease note that this link expires in 15 minutes, you will have to sign up again after",
            from_email="belftmi79@gmail.com",
            recipient_list=[new_user.email],
            fail_silently=False,
        )
    except Exception as e:
        response = Response({"error": str(e)}, status=400)
    return response


def find_by_id(id):
    try:
        user = User.objects.get(id__exact=id)
        return user
    except:
        return None


def update_user(request):
    try:
        user = request.user
        body = json.loads(request.body.decode("utf-8"))
        today = date.today()
        if (
            not user.provider
            and "username" in body
            and body["username"]
            and body["username"] != user.username
        ):
            if (
                not user.username_last_updated
                or (today - user.username_last_updated).days > 30
            ):
                user.username = body["username"].lower()
                user.username_last_updated = today

        if not user.provider and "password" in body and body["password"]:
            if not re.match(r"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$", body['password']):
                return Response({"error": "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character."}, status=400)

            if (
                not user.password_last_updated
                or (today - user.password_last_updated).days > 7
            ):
                user.set_password(body["password"])
                user.password_last_updated = today

        if "picture" in body and body["picture"]:
            if (
                not user.picture_last_updated
                or (today - user.picture_last_updated).days > 30
            ):
                old_picture = user.picture
                user.picture = body["picture"]
                user.picture_last_updated = today
                if old_picture:
                    delete_image(old_picture)

        if "two_factor_enabled" in body and body["two_factor_enabled"] != None:
            user.two_factor_enabled = body["two_factor_enabled"]

        user.full_clean()
        user.save()
    except ValidationError as e:
        errors = format_validation_errors(e)
        return Response(errors, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

    serializer = serializers.UserSerializer(user)
    return Response(serializer.data, status=200)


def login_user(request):
    response = Response()
    body = json.loads(request.body.decode("utf-8"))

    try:
        user = user_service.get_user(
            username=body["username"].lower(), password=body["password"]
        )
        if user.is_superuser:
            return Response({"error": "FORBIDDEN"}, status=403)
        if not user.email_verified:
            return Response({"error": "Email not verified, please check your email"}, status=403)
    except Exception as e:
        return Response({"error": "Invalid username or password"}, status=400)

    # user exists here
    if user.two_factor_enabled:
        response.data = {"id": user.id, "2fa": True}
        return response

    tokens = jwt_service.get_tokens_for_user(user)
    add_cookies(response=response, tokens=tokens)
    serializer = serializers.UserSerializer(user)
    response.data = serializer.data
    response.status_code = 200
    return response


def logout_user(request):
    response = Response()
    response.set_cookie(key=settings.SIMPLE_JWT["AUTH_COOKIE"], expires=0)
    response.set_cookie(key=settings.SIMPLE_JWT["REFRESH_COOKIE"], expires=0)
    return response


def get_authenticated_user(request):
    try:
        serializer = serializers.UserSerializer(request.user)
        return Response(serializer.data, status=200)
    except Exception as e:
        return Response({"error": "user is not authenticated"}, status=400)


def get_user(username, password):
    user = User.objects.get(username__exact=username)
    if user.provider or not check_password(password=password, encoded=user.password):
        raise Exception("Invalid user password")
    return user

def retrieve_or_create_oauth_user(provider, nested=False, **fields):
    fields["provider"] = provider
    try:
        user = User.objects.get(username__exact=fields["username"])
        if not hasattr(user, "provider") or user.provider != provider:
            if provider and not nested:
                fields["username"] += "42"
                updated_fields = {
                    key: value for key, value in fields.items() if key != "provider"
                }
                return retrieve_or_create_oauth_user(
                    provider=provider, nested=True, **updated_fields
                )
            raise UserAlreadyExistsException()
        elif not user.otp_url:
            auth_service.get_otp_code(user)
            user.save()
    except User.DoesNotExist:
        user = User(**fields)
        user.email_verified = True
        auth_service.get_otp_code(user)
        try:
            user.save()
        except Exception:
            raise UsernameEmailAlreadyExistsException()
    return user
