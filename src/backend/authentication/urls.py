from django.urls import path
from authentication.views import user_views, oauth_views, two_factor_views

auth_patterns = [
    path("", user_views.auth_controller),
    path("42/", oauth_views.forty_two_auth),
    path("2fa/", two_factor_views.handle_2fa),
    path("42/callback/", oauth_views.forty_two_callback),
    path("google/", oauth_views.google_auth),
    path("google/callback/", oauth_views.google_auth_callback),
    path("reset-password/", user_views.reset_password),
]

users_patterns = [
    path("", user_views.user_controller),
    path("<str:id>/", user_views.get_user),
]