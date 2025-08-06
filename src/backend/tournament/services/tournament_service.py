import json
import uuid
import datetime
from rest_framework.response import Response
from authentication import serializers
from authentication.services import user_service
from tournament.models import Tournament
from notifications.utils import send_notification, send_profile_update
from notifications.models import Notification
from notifications.serializers import NotificationSerializer


def check_tournament(name):
    try:
        if Tournament.objects.filter(name=name).exists():
            return 1
        return 0
    except Exception as e:
        #print(f"check_tournament::exception::{str(e)}")
        return 0

def check_tournament_by_id(request):
    #print("tournament_services::check_tournament_by_id()")
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        if not(body) or "id" not in body:
            raise Exception("no id in request")

        #print(f"check_by_id::{str(body['id'])}")

        if Tournament.objects.filter(id=body["id"]).exists():
            return Response({"status": "Success"}, status=200)

        return Response({"status": "NotFound"}, status=201)
    except Exception as e:
        #print(f"tournament_services::check_tournament_by_id::exception::{str(e)}")
        return Response({"error": "Exception"}, status=201)

def check_tournament_by_name(request):
    #print("tournament_services::check_tournament_by_name()")
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        if not(body) or "name" not in body:
            raise Exception("no name in request")

        if Tournament.objects.filter(name=body["name"]).exists():
            return Response({"status": "Success"}, status=200)

        return Response({"status": "NotFound"}, status=201)
    except Exception as e:
        #print(f"tournament_services::check_tournament_by_name::exception::{str(e)}")
        return Response({"error": "Exception"}, status=201)


def delete_tournament(request):
    #print("tournament_services::delete_tournament()")
    try:
        body = json.loads(request.body.decode("utf-8"))
        #print(body)

        if "id" not in body:
            raise Exception("id is required to delete a tournament")

        tournament = Tournament.objects.filter(id=body["id"]).first()

        if not (tournament):
            raise Exception("could not find tournament")

        Tournament.objects.filter(id=body["id"]).first().delete()

        return Response({"status": "Success"}, status=200)
    except Exception as e:
        #print("delete_tournament::exception::", str(e))
        return Response({"error": str(e)}, status=400)


def create_tournament(request):
    #print("tournament_service::create_tournament()")
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))

        if check_tournament(body['name']) == 1:
            raise Exception("tournament name is taken")

        tournament = Tournament.objects.create(
            owner=user,
            name=body['name'],
            game=body['game'],
            participants=body['participants'])

        return Response({"status": "Success", "id": tournament.id}, status=200)
    except Exception as e:
        #print("create_tournament::exception::", str(e))
        return Response({"error": str(e)}, status=400)


def get_subscriptions(request):
    #print("tournament_services::get_subscriptions()")
    try:
        body = json.loads(request.body.decode("utf-8"))
        if "id" not in body:
            raise Exception("id is required")

        tournament = Tournament.objects.filter(id=body['id']).first()

        if not (tournament):
            raise Exception("could not find it")

        subscribers = tournament.players.all()

        subscribers_data = [
            {"id": user.id,
             "username": user.username,
             "email": user.email,
             "picture": user.picture}
            for user in subscribers
        ]

        return Response({"status": "Success", "subscribers": subscribers_data}, status=200)
    except Exception as e:
        #print("get_tournament_subscribers::exception::", str(e))
        return Response({"error": str(e)}, status=400)


def start_tournament(user, tournament, subscribers):
    #print("tournament_services::start_tournament()")
    try:
        for player in subscribers:
            notification1 = Notification(**{
                'user': player,
                'type': 'tournament starting',
                'message': f"tournament {str(tournament.id)} is starting now",
                'link': f"/dashboard/games/ping_pong/tournament?tid={str(tournament.id)}&id={str(player.id)}",
            })
            notification1.save()
            serializer = NotificationSerializer(notification1)
            send_notification(serializer.data, f"notif_{player.id}")
    except Exception as e:
        pass
        #print(f"start_tournament::exception::{str(e)}")


def subscripe_to_tournament(request):
    #print("tournament_services::start_tournament()")
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))

        if "id" not in body:
            raise Exception("id is required to subscribe")

        tournament = Tournament.objects.filter(id=body['id']).first()

        if not (tournament):
            raise Exception("could not find tournament")

        if tournament.is_open == False:
            notification = Notification(**{
                'user': user,
                'type': 'tournament subscription',
                'message': f"tournament {str(tournament.name)} is not open",
                'link': "/",
            })
            notification.save()
            serializer = NotificationSerializer(notification)
            send_notification(serializer.data, f"notif_{user.id}")
            raise Exception("tournament is not open")
        elif tournament.is_full == True:
            notification = Notification(**{
                'user': user,
                'type': 'tournament subscription',
                'message': f"tournament {str(tournament.name)} is full",
                'link': "/",
            })
            notification.save()
            serializer = NotificationSerializer(notification)
            send_notification(serializer.data, f"notif_{user.id}")
            raise Exception("tournament is full")

        tournament.players.add(user)
        subscribers = tournament.players.all()
        if len(subscribers) == tournament.participants:
            tournament.is_full = True
        tournament.save()

        notification = Notification(**{
            'user': user,
            'type': 'tournament subscription',
            'message': f"you just subscriped to tournament {str(tournament.name)}",
            'link': f"/dashboard/games/ping_pong/tournament?tid={str(tournament.id)}&id={user.id}"
        })
        notification.save()
        serializer = NotificationSerializer(notification)
        send_notification(serializer.data, f"notif_{user.id}")

        if tournament.is_full:
            start_tournament(user, tournament, subscribers)

        return Response({"status": "Success", "id": tournament.id}, status=200)
    except Exception as e:
        #print("subscripe_to_tournament::exception::", str(e))
        return Response({"error": str(e)}, status=400)


def unsubscripe_from_tournament(request):
    #print("tournament_services::unsubscribe_from_tournament()")
    user = request.user
    try:
        body = json.loads(request.body.decode("utf-8"))
        #print("unsubscribe request body: ", body)

        if "id" not in body:
            raise Exception("id is required to subscribe")

        tournament = Tournament.objects.filter(id=body['id']).first()

        if not (tournament):
            raise Exception("could not find tournament")

        tournament.players.remove(user)
        tournament.is_full = False
        tournament.save()

        notification = Notification(**{
            'user': user,
            'type': 'tournament unsubscription',
            'message': f"you just unsubscriped from tournament {str(tournament.name)}",
            'link': f"/dashboard/games/ping_pong/tournament?tid={str(tournament.id)}&id={str(user.id)}"
        })
        notification.save()
        serializer = NotificationSerializer(notification)
        send_notification(serializer.data, f"notif_{user.id}")

        return Response({"status": "Success"}, status=200)
    except Exception as e:
        #print("unsubscripe_from_tournament::exception::", str(e))
        return Response({"error": str(e)}, status=400)
