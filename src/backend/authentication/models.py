import os, uuid
from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import AbstractBaseUser, UserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password
from django.core.validators import (
    URLValidator,
    RegexValidator,
    MinLengthValidator,
    MaxLengthValidator,
)

class CustomUserManager(UserManager):
    def _create_user(self, username, email, password, **extra_fields):
        if not username:
            raise ValueError("The Username field must be set")

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(
        max_length=255,
        unique=True,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z][a-zA-Z0-9]*$",
                message="This field must start with a letter and contain only alphanumeric characters.",
            ),
            MinLengthValidator(6),
            MaxLengthValidator(30),
        ],
    )
    email = models.CharField(
        max_length=255,
        unique=True,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
                message="Invalid email value",
            ),
        ],
        default=""
    )
    first_name = models.CharField(
        max_length=255,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z]+$",
                message="First name can only contain alphabetic characters.",
            ),
            MinLengthValidator(2),
            MaxLengthValidator(20),
        ],
    )
    last_name = models.CharField(
        max_length=255,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z]+$",
                message="Last name can only contain alphabetic characters.",
            ),
            MinLengthValidator(2),
            MaxLengthValidator(20),
        ],
    )
    password = models.CharField(
        null=True,
        blank=True,
    )
    picture = models.CharField(
        max_length=255,
        default="/default_profile.png",
    )
    provider = models.CharField(max_length=8, null=True, blank=True)
    friends = models.ManyToManyField("self", blank=True)
    invited_users = models.ManyToManyField(
        "self",
        through="friendships.FriendRequest",
        through_fields=("sender", "receiver"),
        symmetrical=False,
        related_name="invited_by",
        blank=True,
    )
    blocked_users = models.ManyToManyField(
        "self",
        through="friendships.UserBlock",
        through_fields=("blocker", "blocked"),
        symmetrical=False,
        related_name="blocked_by",
        blank=True,
    )

    created_at = models.DateTimeField(default=now)

    two_factor_enabled = models.BooleanField(default=False)
    otp_base32 = models.CharField(max_length=200, null=True, blank=True)
    otp_url = models.CharField(max_length=255, null=True, blank=True)

    username_last_updated = models.DateField(null=True, blank=True)
    picture_last_updated = models.DateField(null=True, blank=True)
    password_last_updated = models.DateField(null=True, blank=True)

    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    email_verified = models.BooleanField(default=False)

    is_online = models.BooleanField(default=False)
    active_sessions = models.IntegerField(default=0)
    last_seen = models.DateTimeField(default=now)

    games_played = models.IntegerField(default=0)
    total_score = models.IntegerField(default=1000)
    wins = models.IntegerField(default=0)

    objects = CustomUserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def get_full_name(self):
        return self.first_name + " " + self.last_name

    def get_short_name(self):
        return self.username
