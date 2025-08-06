from django.db import models
from authentication.models import User


class TicTacToeMatch(models.Model):
    """Store TicTacToe match history"""

    room_id = models.CharField(max_length=255, default="")
    player1 = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="tictactoe_player1"
    )
    player2 = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="tictactoe_player2"
    )
    winner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tictactoe_winner",
    )
    is_draw = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

class TicTacToePlayerStats(models.Model):
    """Store player statistics for TicTacToe"""

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="tictactoe_stats"
    )
    games_played = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    draws = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    @property
    def win_rate(self):
        """Calculate win rate percentage"""
        if self.games_played > 0:
            return round((self.wins / self.games_played) * 100, 1)
        return 0.0
