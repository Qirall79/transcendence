from django.contrib.auth import get_user_model
from rest_framework import serializers
from notifications.models import Notification


class MiniUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "picture", "total_score"]

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "first_name", "last_name", "picture", "is_online", "last_seen"]


class UserSerializer(serializers.ModelSerializer):
    unseen_notifications_count = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "provider",
            "email_verified",
            "picture",
            "picture_last_updated",
            "username_last_updated",
            "password_last_updated",
            "friends",
            "two_factor_enabled",
            "otp_url",
            "blocked_users",
            "blocked_by",
            "invited_users",
            "invited_by",
            "unseen_notifications_count",
            "games_played",
            "total_score",
            "wins",
        ]

    def get_unseen_notifications_count(self, obj):
        return Notification.objects.filter(user=obj, seen=False).count()


class RandomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "first_name", "last_name", "picture"]
