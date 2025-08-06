from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponsePermanentRedirect


# for http
class AppendSlashMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            if request.path.endswith('/'):
                return self.get_response(request)

            if '.' in request.path.split('/')[-1]:
                return self.get_response(request)

            if request.method in ('GET', 'HEAD'):
                new_path = request.path + '/'
                if request.GET:
                    new_path += '?' + request.GET.urlencode()
                return HttpResponsePermanentRedirect(new_path)

            if not request.path.endswith('/'):
                request.path = request.path + '/'
                request.path_info = request.path_info + '/'
        except Exception:
            pass 
        
        return self.get_response(request)

# for ws
class TrailingSlashMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "websocket":
            if not scope["path"].endswith('/'):
                scope["path"] = scope["path"] + "/"

                if "raw_path" in scope:
                    scope["raw_path"] = scope["raw_path"] + b"/"

        return await self.app(scope, receive, send)

class JwtAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        headers = scope.get('headers', [])
        cookies = None


        for h in headers:
            if b'cookie' in h:
                cookies = h
                break

        if not cookies:
            await self.close_connection(send, "Authentication failed")
            return

        try:
            cookies = cookies[1].decode('utf-8').split(";")
            token = None
            access_cookie = None
            for c in cookies:
                if 'access_token=' in c:
                    access_cookie = c
                    break

            if not access_cookie:
                await self.close_connection(send, "Authentication failed")
                return
            
            token = access_cookie.split('=')[1]
            if token:
                UntypedToken(token)
                decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user = await self.get_user(decoded_data['user_id'])
                if user == AnonymousUser():
                    await self.close_connection(send, "Authentication failed")
                    return
                scope['user'] = user
            else:
                await self.close_connection(send, "Authentication failed")
                return
        except (InvalidToken, TokenError, Exception):
            await self.close_connection(send, "Authentication failed")
            return

        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        User = get_user_model()
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()

    async def close_connection(self, send, message):
        await send({
            "type": "websocket.close",
            "code": 403, 
            "reason": message
        })