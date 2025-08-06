from django.urls import re_path
from .consumers import GameRandom, GameInvite, GameTournament

websocket_urlpatterns = [
        re_path(r'ws/game_random/$', GameRandom.as_asgi()),
        re_path(r'ws/game_invite/$', GameInvite.as_asgi()),
        re_path(r'ws/game_tournament/$', GameTournament.as_asgi()),
        ]
