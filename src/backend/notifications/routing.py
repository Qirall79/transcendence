from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/notifications/(?P<user_id>[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/$", consumers.NotificationConsumer.as_asgi()),
    re_path(r"ws/profile/(?P<user_id>[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/$", consumers.ProfileConsumer.as_asgi()),
    # Modified to exclude tictactoe path
    re_path(r'^ws/(?!tictactoe/).*$', consumers.CatchAllConsumer.as_asgi())
]