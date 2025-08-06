import uuid
from django.db import models
from authentication.models import User
from django.utils import timezone
from django.core.validators import URLValidator

class Tournament(models.Model):
    id = models.UUIDField(
            primary_key=True,
            default=uuid.uuid4
            )

    name = models.CharField(max_length=255, default="")
    game = models.CharField(max_length=30, default="")

    participants = models.IntegerField(default=0)
    players = models.ManyToManyField(User, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owner", null=True)
    final_winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="final_winner", null=True)

    opened = models.DateTimeField(auto_now_add=True, null=True)
    started = models.CharField(max_length=255,default="")
    closed = models.CharField(max_length=255,default="")

    is_open = models.BooleanField(default=True)
    is_full = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Tournament"

    
