import os
import requests
from core.utils import read_secret
from urllib.parse import urlencode
from django.http import HttpResponseRedirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from authentication.services import user_service, jwt_service
from authentication.exceptions import UserAlreadyExistsException, UsernameEmailAlreadyExistsException
from authentication.utils import add_cookies

@api_view(["GET"])
@permission_classes([AllowAny])
def forty_two_auth(request):
    base_url = "https://api.intra.42.fr/oauth/authorize"

    query_params = {
        "client_id": read_secret('42-client-id', 'client_id'),
        "redirect_uri": os.getenv("FORTY_TWO_REDIRECT_URI"),
        "response_type": "code",
        "scope": "public",
        "state": "somesecret",
    }

    encoded_query = urlencode(query_params)

    authorization_url = f"{base_url}?{encoded_query}"

    return HttpResponseRedirect(redirect_to=authorization_url)


@api_view(["GET"])
@permission_classes([AllowAny])
def forty_two_callback(request):
    code = request.GET.get("code")
    state = request.GET.get("state")
    user = None

    base_url = "https://api.intra.42.fr/oauth/token"

    query_params = {
        "grant_type": "authorization_code",
        "client_id": read_secret('42-client-id', 'client_id'),
        "client_secret": read_secret('42-client-secret', 'client_secret'),
        "code": code,
        "redirect_uri": os.getenv("FORTY_TWO_REDIRECT_URI"),
        "state": state,
    }

    response = requests.post(url=base_url, data=query_params)

    if response.status_code == 200:
        data = response.json()
        token = data["access_token"]
        headers = {
            "Authorization": f"Bearer {token}",
        }
        base_url = "https://api.intra.42.fr/v2/me"
        response = requests.get(base_url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            user_data = {
                "first_name": data["first_name"],
                "last_name": data["last_name"],
                "username": data["login"],
                "email": data["email"],
                "picture": data["image"]["link"],
            }
            try:
                user = user_service.retrieve_or_create_oauth_user(
                    provider="42", **user_data
                )
            except UserAlreadyExistsException:
                return HttpResponseRedirect(
                    redirect_to=os.getenv("VITE_CLIENT_URL") + "/auth/login?error=1"
                )
            except UsernameEmailAlreadyExistsException:
                return HttpResponseRedirect(
                    redirect_to=os.getenv("VITE_CLIENT_URL") + "/auth/login?error=2"
                )
            except Exception:
                return HttpResponseRedirect(
                    redirect_to=os.getenv("VITE_CLIENT_URL") + "/auth/login?error"
                )
        else:
            return HttpResponseRedirect(
                redirect_to=os.getenv("VITE_CLIENT_URL") + "/auth/login?error"
            )
    else:
        return HttpResponseRedirect(
            redirect_to=os.getenv("VITE_CLIENT_URL") + "/auth/login?error"
        )

    if user.two_factor_enabled:
        return HttpResponseRedirect(
            redirect_to=f"{os.getenv('VITE_CLIENT_URL')}/auth/2fa/{user.id}"
        )

    tokens = jwt_service.get_tokens_for_user(user)
    
    redirect_url = os.getenv("VITE_CLIENT_URL") + "/dashboard"
    response = HttpResponseRedirect(redirect_to=redirect_url)
    
    response["Access-Control-Allow-Origin"] = redirect_url
    response["Access-Control-Allow-Credentials"] = "true"
    response["Access-Control-Expose-Headers"] = "Set-Cookie"
    
    add_cookies(response=response, tokens=tokens)
    
    return response


@api_view(["GET"])
@permission_classes([AllowAny])
def google_auth(request):
    base_url = "https://accounts.google.com/o/oauth2/v2/auth"
    query_params = {
        "client_id": read_secret('google-client-id', 'client_id'),
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
        "response_type": "code",
        "access_type": "offline",
        "scope": "https://www.googleapis.com/auth/userinfo.profile  https://www.googleapis.com/auth/userinfo.email",
        "state": "somesecret",
        "include_granted_scopes": "true",
    }

    encoded_query = urlencode(query_params)

    authorization_url = f"{base_url}?{encoded_query}"

    return HttpResponseRedirect(redirect_to=authorization_url)


@api_view(["GET"])
@permission_classes([AllowAny])
def google_auth_callback(request):
    try:
        code = request.GET.get("code")
        user = None

        base_url = "https://oauth2.googleapis.com/token"

        query_params = {
            "grant_type": "authorization_code",
            "client_id": read_secret('google-client-id', 'client_id'),
            "client_secret": read_secret('google-client-secret', 'client_secret'),
            "code": code,
            "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
        }

        response = requests.post(url=base_url, data=query_params)
        
        if response.status_code == 200:
            data = response.json()
            token = data["access_token"]
            headers = {
                "Authorization": f"Bearer {token}",
            }
            base_url = "https://www.googleapis.com/oauth2/v2/userinfo"
            response = requests.get(base_url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                first_name, last_name = data["name"].split(" ")
                user_data = {
                    "first_name": first_name,
                    "last_name": last_name,
                    "username": data["email"].split("@")[0].replace(".", ""),
                    "email": data["email"],
                    "picture": data["picture"],
                }
                try:
                    user = user_service.retrieve_or_create_oauth_user(
                        provider="google", **user_data
                    )
                except UserAlreadyExistsException as e:
                    return HttpResponseRedirect(
                        redirect_to=os.getenv("VITE_CLIENT_URL") + "/auth/login?error=1"
                    )
                except UsernameEmailAlreadyExistsException:
                    return HttpResponseRedirect(
                        redirect_to=os.getenv("VITE_CLIENT_URL") + "/auth/login?error=2"
                    )
                except Exception as e:
                    return HttpResponseRedirect(
                        redirect_to=os.getenv("VITE_CLIENT_URL") + "/auth/login?error"
                    )
            else:
                return HttpResponseRedirect(
                    redirect_to=os.getenv("VITE_CLIENT_URL") + "/auth/login?error"
                )
        else:
            return HttpResponseRedirect(
                redirect_to=os.getenv("VITE_CLIENT_URL") + "/auth/login?error"
            )

        if user.two_factor_enabled:
            return HttpResponseRedirect(
                redirect_to=f"{os.getenv('VITE_CLIENT_URL')}/auth/2fa/{user.id}"
            )

        tokens = jwt_service.get_tokens_for_user(user)

        response = HttpResponseRedirect(redirect_to=os.getenv("VITE_CLIENT_URL") + "/dashboard")

        add_cookies(response=response, tokens=tokens)

        return response
    except Exception as e:
        pass
