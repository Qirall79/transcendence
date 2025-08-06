from django.conf import settings
from datetime import datetime
from django.utils import timezone


def add_cookies(response, tokens):
    access_expiry = timezone.now() + settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
    refresh_expiry = timezone.now() + settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']

    response.set_cookie(
        key=settings.SIMPLE_JWT["AUTH_COOKIE"],
        value=tokens["access"],
        expires=access_expiry,
        secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
        httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
        samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
        path='/',
    )

    response.set_cookie(
        key=settings.SIMPLE_JWT["REFRESH_COOKIE"],
        value=tokens["refresh"],
        expires=refresh_expiry,
        secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
        httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
        samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
        path='/',
    )
    pass


def format_validation_errors(e):
    errors = {}
    for error in e:
        errors[error[0]] = error[1][0]
    return errors
