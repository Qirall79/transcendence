import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Conversation
from .models import Message
from .serializers import ConversationSerializer
from .serializers import MessagesSerializer
from django.conf import settings
from django.apps import apps
from django.db.models import Q
from .models import get_last_message
from friendships.services.friends_service import check_blocked
from game.services.game_service import check_game_invitation


@api_view(["GET"])
def conversationList(request, id):
    try:
        conversations = Conversation.objects.filter(
            Q(user_1=id) | Q(user_2=id)
        ).order_by('-modified_date')

        serializer = ConversationSerializer(conversations, many=True)
        User = apps.get_model(settings.AUTH_USER_MODEL)

        custom_data = []
        for conversation in serializer.data:
            if (request.user.id == conversation["user_2"]):
                user = User.objects.get(id=conversation["user_1"])
            else:
                user = User.objects.get(id=conversation["user_2"])

            lastmsg = get_last_message(conversation["id"])

            unread_count = Message.objects.exclude(
                sender=request.user.id).filter(conversation_id=conversation['id'], is_readed=False).count()

            status = "online" if user.is_online == True else "Offline"
            custom_conversation = {
                "id": conversation["id"],
                "user_id": user.id,
                "username": user.username,
                "avatar": user.picture,
                "timestamp": conversation["modified_date"],
                "unread": unread_count,
                "online": user.is_online,
                "status": status,
                "lastMessage": lastmsg,
                "is_blocking": check_blocked(user, request.user),
                "is_blocked": check_blocked(request.user, user),
                "game_invite": check_game_invitation(request.user, user)
            }

            custom_data.append(custom_conversation)

        return Response(custom_data, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
def messagesList(request, id):
    try:

        conversationId = id
        messages = Message.objects.filter(
            conversation=conversationId).order_by("send_date")

        serializer = MessagesSerializer(messages, many=True)

        custom_data = []
        for message in serializer.data:
            isMine = request.user.id == message["sender"]
            custom_message = {
                "id": message["id"],
                "sender": message["sender"],
                "content": message["content"],
                "timestamp": message["send_date"],
                "isMine": isMine,
            }
            custom_data.append(custom_message)
        return Response(custom_data, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["PUT"])
def updateReadedMessages(request):
    try:
        byte_string = request.body

        json_string = byte_string.decode('utf-8')

        data = json.loads(json_string)

        conversationId = data["body"]["id"]

        if not conversationId:
            return Response({"error": "ID is required in the body"}, status=400)

        messages = Message.objects.filter(conversation=conversationId)

        for message in messages:
            if request.user.id != message.sender.id:
                message.is_readed = True
                message.save()

        return Response({"success": "Messages updated successfully"}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=400)
