# core/asgi.py
from authentication.middleware import JwtAuthMiddleware, TrailingSlashMiddleware
import notifications.routing
import chat.routing
import game.routing
from rest_framework_simplejwt.authentication import JWTAuthentication
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import os
from django.core.asgi import get_asgi_application
from core.middleware import WebSocketExceptionMiddleware
import tictactoe.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings_prod')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': TrailingSlashMiddleware(JwtAuthMiddleware(
        WebSocketExceptionMiddleware(URLRouter(
            tictactoe.routing.websocket_urlpatterns +
            game.routing.websocket_urlpatterns + chat.routing.websocket_urlpatterns +
            notifications.routing.websocket_urlpatterns 
        ))
    )),
})

all_routes = (
    tictactoe.routing.websocket_urlpatterns +
    game.routing.websocket_urlpatterns + 
    chat.routing.websocket_urlpatterns +
    notifications.routing.websocket_urlpatterns
)