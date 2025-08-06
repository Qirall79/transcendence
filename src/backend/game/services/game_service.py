import json
import uuid
from rest_framework.response import Response
from authentication import serializers
from authentication.services import user_service
from game.models import GameInvite
from notifications.utils import send_notification, send_profile_update
from notifications.models import Notification
from notifications.serializers import NotificationSerializer


def check_game_invitation(user, other):
    try:
        if GameInvite.objects.filter(sender=other, receiver=user).exists():
            return 1
        if GameInvite.objects.filter(sender=user, receiver=other).exists():
            return 2
        return 0
    except Exception as e:
        #print(f"check_game_invitation::exception::{str(e)}")
        return 0


def start_match(request):
    #print("game_services::start_match()")
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        other = user_service.find_by_id(body["id"])

        if not (other):
            raise Exception("could not find a user to play with")

        invitation_state = check_game_invitation(user, other)
        if invitation_state == 0:
            raise Exception(
                f"game invitation canceled by {str(other.username)}")

        GameInvite.objects.filter(sender=user, receiver=other).delete()
        GameInvite.objects.filter(sender=other, receiver=user).delete()

        room_uuid = uuid.uuid4()

        notification1 = Notification(**{
            'user': user,
            'type': 'game_start',
            'message': f"starting match {str(user.username)} VS {str(other.username)}",
            'link': f"/dashboard/games/ping_pong/online?id={user.id}&mode={room_uuid}",
        })
        notification2 = Notification(**{
            'user': other,
            'type': 'game_start',
            'message': f"starting match {str(other.username)} VS {str(user.username)}",
            'link': f"/dashboard/games/ping_pong/online?id={other.id}&mode={room_uuid}",
        })
        notification1.save()
        notification2.save()

        serializer1 = NotificationSerializer(notification1)
        serializer2 = NotificationSerializer(notification2)

        send_notification(serializer1.data, f"notif_{user.id}")
        send_notification(serializer2.data, f"notif_{other.id}")

        #print("game_services::start_match()::success")
        return Response({"status": "Success"}, status=200)
    except Exception as e:
        #print(f"start_match::exception::{str(e)}")
        return Response({"error": str(e)}, status=400)


def delete_match(request):
    #print("game_services::delete_match()")
    try:
        body = json.loads(request.body.decode("utf-8"))

        if "room_id" not in body:
            raise Exception("room_id is required to delete a match")

        match = Match.objects.filter(room_id=body["room_id"])

        if not (match):
            raise Exception("could not find match in history")

        Match.objects.filter(room_id=body["room_id"]).delete()

        #print("game_services::delete_match()::success")
        return Response({"status": "Success"}, status=200)
    except Exception as e:
        #print("delete_match::exception::", str(e))
        return Response({"error": str(e)}, status=400)


def send_game_invite(request):
    #print("game_services::send_game_invite()")
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        other = user_service.find_by_id(body["id"])

        if not (other):
            raise Exception("could not find the notif receipient")

        invitation_state = check_game_invitation(user, other)
        if invitation_state == 1:
            raise Exception("you have alredy sent this guy an anvitation")
        elif invitation_state == 2:
            raise Exception("this guy already sent you an invitation")

        GameInvite.objects.create(sender=user, receiver=other)

        notification = Notification(**{
            'user': other,
            'type': 'game_invite',
            'message': f"{str(user.username)} is challenging you to a match",
            'link': f"/dashboard/users/{str(user.id)}",
        })

        notification.save()

        serializer = NotificationSerializer(notification)

        send_notification(serializer.data, f"notif_{other.id}")

        #print("game_services::send_game_invite()::success")
        return Response({"status": "Success"}, status=200)
    except Exception as e:
        #print("send_game_invite::exception::", str(e))
        return Response({"error": str(e)}, status=400)


def delete_game_invite(request):
    #print("game_services::delete_game_invite()")
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        other = user_service.find_by_id(body["id"])

        if not (other):
            raise Exception("could not find the notif second end")

        GameInvite.objects.filter(sender=user, receiver=other).delete()
        GameInvite.objects.filter(sender=other, receiver=user).delete()

        notification = Notification(**{
            'user': other,
            'type': 'game_invite_cancel',
            'message': f"game invitation canceled by {str(user.username)}",
            'link': f"/dashboard/users/{str(user.id)}",
        })
        notification.save()
        serializer = NotificationSerializer(notification)
        send_notification(serializer.data, f"notif_{other.id}")

        #print("game_services::delete_game_invite()::success")
        return Response({"status": "Success"}, status=200)
    except Exception as e:
        #print("delete_game_invite::exception::", str(e))
        return Response({"error": str(e)}, status=400)
