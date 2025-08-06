import json
import datetime
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from authentication.services.user_service import find_by_id
from notifications.utils import send_notification
from django.db.models import F


class CatchAllConsumer(WebsocketConsumer):
    def connect(self):
        self.channel_name = "catch_all_channel"
        async_to_sync(self.channel_layer.group_add)(
            "catch_all", self.channel_name
        )
        self.accept()
        self.send(text_data=json.dumps(
            {"body": "Your ws request doesn't match any route"}))


class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.room_group_name = f"notif_{self.user_id}"
        self.user = find_by_id(self.user_id)

        if self.user:
            self.user.active_sessions = F("active_sessions") + 1
            self.user.is_online = True
            self.user.save(update_fields=["active_sessions", "is_online"])

            self.user.refresh_from_db()

            for friend in self.user.friends.all():
                send_notification(
                    {
                        "type": "online",
                        "message": f"{self.user.id}",
                        "link": "/",
                    },
                    f"notif_{friend.id}",
                )

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()

    def receive(self, text_data):
        pass

    def notification_message(self, event):
        message = event["message"]

        self.send(text_data=json.dumps({"body": message}))

    def disconnect(self, close_code):
        if self.user:
            self.user.active_sessions = F("active_sessions") - 1
            self.user.save(update_fields=["active_sessions"])

            self.user.refresh_from_db()

            if self.user.active_sessions <= 0:
                self.user.is_online = False
                self.user.last_seen = datetime.datetime.now()
                self.user.save(update_fields=["is_online", "last_seen"])

                for friend in self.user.friends.all():
                    send_notification(
                        {
                            "type": "offline",
                            "message": f"{self.user.id}",
                            "link": "/",
                        },
                        f"notif_{friend.id}",
                    )

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )


class ProfileConsumer(WebsocketConsumer):
    def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.room_group_name = f"profile_{self.user_id}"
        print("CONNECTED TO PROFILE")
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()
        self.send(
            text_data=json.dumps(
                {
                    "type": "connection_established",
                    "message": "You are now subscribed to profile updates",
                }
            )
        )

    def receive(self, text_data):
        pass

    def profile_message(self, event):
        message = event["message"]

        self.send(text_data=json.dumps({"update": message}))

    def disconnect(self, close_code):
        pass
