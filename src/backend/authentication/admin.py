from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from authentication.models import User


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ("username", "first_name", "last_name", "is_staff", "is_active")
    pass


# Register your models here.
admin.site.register(User, CustomUserAdmin)
