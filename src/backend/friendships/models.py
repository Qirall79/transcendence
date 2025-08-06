from django.db import models
from authentication.models import User

class UserBlock(models.Model):
    blocker = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_blocks"
    )
    blocked = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="blocked_by_users"
    )

    class Meta:
        unique_together = ["blocker", "blocked"]
        constraints = [
            models.UniqueConstraint(fields=["blocker", "blocked"], name="unique_block")
        ]

class FriendRequest(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_invites"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="invited_by_users"
    )

    class Meta:
        unique_together = ["sender", "receiver"]
        constraints = [
            models.UniqueConstraint(fields=["sender", "receiver"], name="unique_invite")
        ]
