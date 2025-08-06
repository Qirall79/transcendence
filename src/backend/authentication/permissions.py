from rest_framework.permissions import BasePermission

class CustomAuthPermission:
    def has_permission(self, request, view):
        if request.method == "GET":
            return request.user and request.user.is_authenticated and request.user.email_verified
        return True


class CustomUsersPermission:
    def has_permission(self, request, view):
        if request.method != "POST":
            return request.user and request.user.is_authenticated
        return True

class IsAuthenticatedOrWriteOnly:
    def has_permission(self, request, view):
        if request.method == "GET":
            return request.user and request.user.is_authenticated
        return True


class IsEmailVerified(BasePermission):
    def has_permission(self, request, view):
        if (
            not request.user
            or not request.user.is_authenticated
        ):
            return False
        
        if not request.user.email_verified:
            return False
        return True 
