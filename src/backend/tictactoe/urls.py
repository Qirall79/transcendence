from django.urls import path
from . import views

urlpatterns = [
    path("matches/", views.match_history, name="tictactoe_match_history"),
    path("stats/", views.player_stats, name="tictactoe_player_stats"),
    path("leaderboard/", views.leaderboard, name="tictactoe_leaderboard"),
]
