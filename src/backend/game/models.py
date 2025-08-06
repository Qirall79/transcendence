import uuid
from django.db import models
from authentication.models import User
from django.utils import timezone
from django.core.validators import URLValidator

class Match(models.Model):
    room_id = models.CharField(max_length=255, default="")
    game = models.CharField(max_length=30, default="Ping Pong")
    player1 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="player_1")
    player2 = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="player_2")
    winner_score = models.IntegerField(default=0)
    loser_score = models.IntegerField(default=0)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="winner")
    played_at = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        verbose_name = "gameMatch"
        #unique_together = ["player1", "player2", "room_id"]
        #constraints = [
        #    models.UniqueConstraint(fields=["player1", "player2", "room_id"], name="unique_match")
        #]


class GameInvite(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_challenges"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="challenged_by_users"
    )

    class Meta:
        verbose_name = "gameInvite"
        #unique_together = ["sender", "receiver"]
        #constraints = [
        #    models.UniqueConstraint(fields=["sender", "receiver"], name="unique_game_challenge")
        #]

