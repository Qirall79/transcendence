from django.db import models
from authentication.models import User
from django.utils import timezone

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', null=True)
    message = models.CharField(max_length=100)
    link = models.CharField(max_length=255, default='/')
    type = models.CharField(max_length=255, default='')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    seen = models.BooleanField(default=False, null=True)

    def __str__(self):
        return self.message
