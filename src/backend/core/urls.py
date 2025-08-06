from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import render
from django.conf.urls.static import static
from authentication.views import user_views, oauth_views, jwt_views, dummy_views, two_factor_views
from friendships.views import friends_controller, invites_controller, blocks_controller
from game.views import game_invite_controller, match_controller, get_stats, get_leaderboard, get_user_matches
from tournament.views import (
        tournament_subscription_controller,
        tournament_controller,
        tournament_check_controller,
        tournament_subscribers,
        )
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenBlacklistView
)
from authentication.urls import auth_patterns, users_patterns
from notifications.views import get_notifications
from chat.views import conversationList, updateReadedMessages
from chat.views import messagesList


def health_check(request):
    return JsonResponse({"status": "healthy"})


def privacy_view(request):
    return render(request, "authentication/privacy.html", {})


urlpatterns = [
    path("dummy/", dummy_views.sayHello),
    path("privacy/", privacy_view),
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health_check"),
    path("auth/", include(auth_patterns)),
    path("", user_views.get_users),
    path("users/", include(users_patterns)),
    path("friends/", friends_controller),
    path("invites/", invites_controller),
    path("blocks/", blocks_controller),
    path("notifications/", get_notifications),
    path("api/verify-email/", user_views.verify_email),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path(
        "api/token/refresh/",
        jwt_views.CookieTokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("api/token/blacklist/", TokenBlacklistView.as_view(),
         name="token_blacklist"),

    path("api/conversations/<str:id>", conversationList),
    path("api/readed_msgs/", updateReadedMessages),
    path("api/messages/<str:id>", messagesList),
    path("game_invites/", game_invite_controller),
    path("matches/", match_controller),
    path("matches/<str:id>/", get_user_matches),
    path("stats/", get_stats),
    path("leaderboard/", get_leaderboard),
    path("tournaments/", tournament_controller),
    path("check_tournament/", tournament_check_controller),
    path("subscribe/", tournament_subscription_controller),
    path("subscriptions/", tournament_subscribers),

    # tic-tac-toe
    path('api/tictactoe/', include('tictactoe.urls')),
]

# Serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
