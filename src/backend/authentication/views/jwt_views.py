from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework import status
from django.conf import settings
from authentication.utils import add_cookies


class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT["REFRESH_COOKIE"])
        if not refresh_token:
            return Response(
                {"error": "Refresh token missing"}, status=status.HTTP_400_BAD_REQUEST
            )

        request.data["refresh"] = refresh_token

        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            tokens = serializer.validated_data

            response = Response(status=status.HTTP_200_OK)
            add_cookies(response=response, tokens=tokens)

            return response
        except TokenError as e:
            raise InvalidToken(e.args[0])
