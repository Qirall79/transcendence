from django.contrib import admin
from .models import TicTacToeMatch, TicTacToePlayerStats


@admin.register(TicTacToeMatch)
class TicTacToeMatchAdmin(admin.ModelAdmin):
    list_display = ("id", "player1", "player2", "winner", "is_draw", "created_at")
    list_filter = ("is_draw", "created_at")
    search_fields = ("player1__username", "player2__username")


@admin.register(TicTacToePlayerStats)
class TicTacToePlayerStatsAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "games_played",
        "wins",
        "losses",
        "draws",
        "win_rate_display",
    )
    search_fields = ("user__username",)

    def win_rate_display(self, obj):
        return f"{obj.win_rate}%"

    win_rate_display.short_description = "Win Rate"
