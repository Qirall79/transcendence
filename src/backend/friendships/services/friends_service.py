import json
from rest_framework.response import Response
from authentication import serializers
from authentication.services import user_service
from friendships.models import FriendRequest, UserBlock
from notifications.utils import send_notification, send_profile_update
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from chat.models import Conversation


def check_blocked(user, other):
    if UserBlock.objects.filter(blocker=user, blocked=other).exists():
        return True
    return False


def check_friend(user, other):
    return user.friends.filter(id=other.id).exists()


def check_invited(user, other):
    if FriendRequest.objects.filter(sender=other, receiver=user).exists():
        return 1
    if FriendRequest.objects.filter(sender=user, receiver=other).exists():
        return 2
    return 0


def check_conversation(user, other):
    try:
        return Conversation.objects.filter(user_1=user, user_2=other).exists() or Conversation.objects.filter(user_1=other, user_2=user).exists()
    except Exception:
        return False


def add_friend(request):
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        friend = user_service.find_by_id(body["id"])

        if friend.id == user.id:
            raise Exception("You can't add yourself")

        if check_friend(user, friend):
            raise Exception("You are already friends with the user")

        if not FriendRequest.objects.filter(sender=friend, receiver=user).exists():
            raise Exception("You are not invited by the user")
        if friend:
            if check_blocked(user, friend) or check_blocked(friend, user):
                raise Exception(
                    "You are either blocking or blocked by the user")
            FriendRequest.objects.filter(sender=friend, receiver=user).delete()
            FriendRequest.objects.filter(sender=user, receiver=friend).delete()
            user.friends.add(friend)
            user.save()

        # notify
        notification = Notification(**{
            'user': friend,
            'type': 'accept',
            'message': f"{str(user.username)} accepted your invite",
            'link': f"/dashboard/users/{str(user.id)}"
        })

        notification.save()

        # create chat convo if it doesn't exist
        if not check_conversation(user, friend):
            conversation = Conversation(**{
                'user_1': user,
                'user_2': friend,
            })

            conversation.save()

        serializer = NotificationSerializer(notification)

        send_notification(serializer.data, f"notif_{friend.id}")

        send_profile_update({
            'type': 'accept'
        }, user.id)

        send_profile_update({
            'type': 'accept'
        }, friend.id)

        serializer = serializers.UserSerializer(user)
        return Response(serializer.data["friends"], status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


def remove_friend(request):
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        friend = user_service.find_by_id(body["id"])
        if friend:
            user.friends.remove(friend)
            user.save()
        send_profile_update({
            'type': 'remove'
        }, user.id)
        serializer = serializers.UserSerializer(user)
        return Response(serializer.data["friends"], status=200)
    except Exception as e:
        return Response({"error": "Something went wrong"}, status=400)


def block_user(request):
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        other = user_service.find_by_id(body["id"])

        if other.id == user.id:
            raise Exception("You can't block yourself")

        if other:
            if check_blocked(other, user):
                raise Exception("You are blocked by the user")

            user.friends.remove(other)
            FriendRequest.objects.filter(sender=other, receiver=user).delete()
            FriendRequest.objects.filter(sender=user, receiver=other).delete()
            UserBlock.objects.create(blocker=user, blocked=other)
            user.save()

        send_profile_update({
            'type': 'block'
        }, user.id)
        return Response({"status": "Success"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


def unblock_user(request):
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        other = user_service.find_by_id(body["id"])
        if other:
            UserBlock.objects.filter(blocker=user, blocked=other).delete()
            user.save()
        send_profile_update({
            'type': 'unblock'
        }, user.id)
        return Response({"status": "Success"}, status=200)
    except Exception as e:
        return Response({"error": "Something went wrong"}, status=400)


def invite_user(request):
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        other = user_service.find_by_id(body["id"])

        if other.id == user.id:
            raise Exception("You can't invite yourself")

        if other:
            if check_blocked(other, user) or check_blocked(user, other):
                raise Exception(
                    "You are erither blocking or blocked by the user")
            if check_friend(other, user):
                raise Exception("You are already friends with the user")
            FriendRequest.objects.create(sender=user, receiver=other)

        send_notification({
            'type': 'invite',
            'message': f"{str(user.username)} sent you a friend request",
            'link': f"/dashboard/users/{str(user.id)}"
        }, f"notif_{other.id}")

        send_profile_update({
            'type': 'invite'
        }, user.id)

        return Response({"status": "Success"}, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


def delete_invite(request):
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        other = user_service.find_by_id(body["id"])
        if other:
            FriendRequest.objects.filter(sender=user, receiver=other).delete()
            FriendRequest.objects.filter(sender=other, receiver=user).delete()

        send_profile_update({
            'type': 'delete'
        }, user.id)

        send_profile_update({
            'type': 'delete'
        }, other.id)
        return Response({"status": "Success"}, status=200)
    except Exception as e:
        return Response({"error": "Something went wrong"}, status=400)
