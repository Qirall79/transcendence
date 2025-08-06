import os
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.state import token_backend
from django.core.mail import send_mail
from django.conf import settings

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

def generate_password_reset_token(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)

def send_password_reset_email(user, reset_token):
    reset_link = f"{os.getenv('VITE_CLIENT_URL')}/auth/reset-password?token={reset_token}"
    subject = "Password Reset Request"
    message = f"Click the link below to reset your password:\n\n{reset_link}"
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
