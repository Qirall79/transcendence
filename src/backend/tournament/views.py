import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Tournament
from .serializers import TournamentSerializer
from .services import tournament_service
from authentication import serializers

@api_view(["GET", "POST", "DELETE"])
def tournament_controller(request):
    tournaments = Tournament.objects.all()
    serializer = TournamentSerializer(tournaments, many=True)
    
    if request.method == "GET":
        return Response(serializer.data, status=200)
    if request.method == "POST":
        return tournament_service.create_tournament(request)
    if request.method == "DELETE":
        return tournament_service.delete_tournament(request)

@api_view(["GET", "POST", "DELETE"])
def tournament_check_controller(request):
    if request.method == "POST":
        return tournament_service.check_tournament_by_id(request)
    if request.method == "DELETE":
        return tournament_service.check_tournament_by_name(request)

@api_view(["GET", "POST", "DELETE"])
def tournament_subscription_controller(request):
    if request.method == "POST":
        return tournament_service.subscripe_to_tournament(request)
    if request.method == "DELETE":
        return tournament_service.unsubscripe_from_tournament(request)

@api_view(["GET", "POST", "DELETE"])
def tournament_subscribers(request):
    if request.method == "POST":
        return tournament_service.get_subscriptions(request)
