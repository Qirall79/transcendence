import os
import json
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from authentication import serializers
from authentication.utils import add_cookies
from authentication.permissions import CustomAuthPermission, CustomUsersPermission
from authentication.services.user_service import (
    get_authenticated_user,
    login_user,
    logout_user,
    create_user,
    update_user,
    
)
from authentication.services import user_service, jwt_service
from friendships.services.friends_service import (
    check_blocked,
    check_friend,
    check_invited,
)
from game.services.game_service import check_game_invitation


@api_view(["GET"])
def get_users(request):
    try:
        users = get_user_model().objects.all()
        serializer = serializers.UserSerializer(users, many=True)
        return Response(serializer.data, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
def get_user(request, id):
    try:
        user = user_service.find_by_id(id)
        if not user:
            raise Exception("User id doesn't exist")
        if check_blocked(user, request.user):
            return Response({"error": "You are blocked by the user"}, status=403)
        serializer = serializers.RandomUserSerializer(user)
        data = serializer.data
        data["is_friend"] = check_friend(request.user, user)
        data["is_blocked"] = check_blocked(request.user, user)
        data["invite"] = check_invited(request.user, user)
        data["game_invite"] = check_game_invitation(request.user, user)
        return Response(data, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET", "POST", "DELETE"])
@permission_classes([CustomAuthPermission])
def auth_controller(request):
    if request.method == "GET":
        return get_authenticated_user(request)
    if request.method == "POST":
        return login_user(request)
    if request.method == "DELETE":
        return logout_user(request)


@api_view(["GET", "POST", "PUT", "DELETE"])
@permission_classes([CustomUsersPermission])
def user_controller(request):
    if request.method == "GET":
        query = request.GET.get("query")
        users = get_user_model().objects.filter(username__icontains=query).filter(is_superuser=False)
        serializer = serializers.MiniUserSerializer(users, many=True)
        return Response({"results": serializer.data})
    if request.method == "POST":
        return create_user(request)
    if request.method == "PUT":
        return update_user(request)
    if request.method == "DELETE":
        request.user.delete()
        return Response({"status": "success"})


@api_view(["GET"])
@permission_classes([AllowAny])
def verify_email(request):
    try:
        token = request.GET.get("token")
        payload = AccessToken(token)
        user = user_service.find_by_id(payload["user_id"])
        if user.email_verified:
            return Response({"error": "Email already in use"}, status=400)

        user.email_verified = True
        user.save()
        response = redirect(os.getenv("VITE_CLIENT_URL") + "/dashboard")
        tokens = jwt_service.get_tokens_for_user(user)
        add_cookies(response, tokens)
        return response
    except Exception as e:
        return redirect(os.getenv("VITE_CLIENT_URL") + f"/auth/verify-email?error")


@api_view(["PUT", "POST"])
@permission_classes([AllowAny])
def reset_password(request):
    User = get_user_model()
    body = json.loads(request.body.decode("utf-8"))

    if request.method == 'POST':
        email = body['email']
        if not email:
            return Response({'error': 'Email is required'}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=400)

        reset_token = jwt_service.generate_password_reset_token(user)
        jwt_service.send_password_reset_email(user, reset_token)

        return Response({'message': 'Password reset link sent to your email'}, status=200)
    else:
        token = body['token']
        new_password = body['new_password']

        if not token or not new_password:
            return Response({'error': 'Token and new password are required'}, status=400)
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            user.set_password(new_password)
            user.save()

            return Response({'message': 'Password reset successfully'}, status=200)
        except TokenError:
            return Response({'error': 'Invalid or expired token'}, status=400)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
