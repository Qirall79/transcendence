from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings


class CustomAuthentication(JWTAuthentication):
    def authenticate(self, request):
        if request.method != "GET" and "auth" in request.build_absolute_uri():
            return None

        header = self.get_header(request)

        if header is None:
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"]) or None
        else:
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except Exception as e:
            return None

        return self.get_user(validated_token), validated_token
