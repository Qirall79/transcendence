import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from .models import create_message
from .models import Conversation
from asgiref.sync import sync_to_async
from django.apps import apps
from django.conf import settings
# from urllib.parse import parse_qs
from notifications.utils import send_notification
from authentication.services.user_service import find_by_id
from friendships.services.friends_service import check_blocked


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user_id = str(self.scope["user"].id)
        self.roomGroupName = 'chat_' + user_id
    
        await self.channel_layer.group_add(
            self.roomGroupName,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.roomGroupName,
            self.channel_name
        )

    async def receive(self, text_data):

        user = self.scope["user"]

        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        userId = text_data_json["userId"]
        other = await sync_to_async(find_by_id)(userId)

        is_blocked = await sync_to_async(check_blocked)(user, other)
        is_blocking = await sync_to_async(check_blocked)(other, user)

        if not other or is_blocked or is_blocking:
            return


        conversationId = text_data_json["conversationId"]

        conversation = await sync_to_async(Conversation.objects.get)(id=conversationId)

        mes = await create_message(user, conversation, message, False)

        await self.channel_layer.group_send(
            self.roomGroupName, {
                "type": "sendMessage",
                "id": mes.id,
                "content": message,
                "sender": user.username,
                "isMine": True,
                "conversation_id": conversationId,
                "timestamp": mes.send_date
            })

        if userId:
            await sync_to_async(send_notification)({
                'type': 'message',
                'message': f"{str(user.username)}: {message[:10] + '...' if len(message) > 10 else message}",
                'link': f"/dashboard/users/{str(user.id)}"
            }, f"notif_{userId}")

            groupName = "chat_" + userId
            await self.channel_layer.group_send(
                groupName, {
                    "type": "sendMessage",
                    "id": mes.id,
                    "content": message,
                    "sender": user.username,
                    "isMine": False,
                    "conversation_id": conversationId,
                    "timestamp": mes.send_date
                })

    async def sendMessage(self, event):
        messid = event["id"]
        message = event["content"]
        sender = event["sender"]
        conversation_id = event["conversation_id"]
        isMine = event["isMine"]
        timestamp = event["timestamp"]
        await self.send(text_data=json.dumps({"id": messid, "content": message, "sender": sender, "conversation_id": conversation_id, "isMine": isMine, "timestamp": timestamp.isoformat()}))
