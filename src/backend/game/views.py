import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import (
    Match,
    GameInvite,
)
from .serializers import (
    MatchSerializer,
    GameInviteSerializer,
    MatchSummarySerializer
)
from authentication import serializers
from game.services import game_service
from authentication.services.user_service import find_by_id
from django.db.models import Q, Count, Case, When, F, Window
from django.db.models.functions import TruncMonth, Rank
from authentication.models import User


@api_view(["GET", "POST", "DELETE"])
def game_invite_controller(request):
    game_invites = GameInvite.objects.all()
    serializer = GameInviteSerializer(game_invites, many=True)
    if request.method == "GET":
        return Response(serializer.data, status=200)
    if request.method == "POST":
        return game_service.send_game_invite(request)
    if request.method == "DELETE":
        return game_service.delete_game_invite(request)


@api_view(["GET", "POST", "DELETE"])
def match_controller(request):
    if request.method == "GET":
        matches = Match.objects.filter(Q(player1=request.user) | Q(
            player2=request.user)).order_by('-played_at')
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data, status=200)
    if request.method == "POST":
        return game_service.start_match(request)
    if request.method == "DELETE":
        return game_service.delete_match(request)


@api_view(["GET", "POST", "DELETE"])
def get_user_matches(request, id):
    try:
        user = find_by_id(id)
        matches = Match.objects.filter(
            Q(player1=user) | Q(player2=user)).order_by('-played_at')
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data, status=200)
    except Exception as e:
        return Response({"error": "user not found"}, status=404)


@api_view(["GET"])
def get_stats(request):
    user = request.user

    matches = Match.objects.filter(
        Q(player1=user) | Q(player2=user)
    ).annotate(
        month=TruncMonth('played_at')
    ).values('month').annotate(
        wins=Count(Case(
            When(winner=user, then=1),
        )),
        losses=Count(Case(
            When(~Q(winner=user), then=1),
        ))
    ).order_by('month')

    serializer = MatchSummarySerializer(matches, many=True)

    rank = User.objects.filter(
        total_score__gt=user.total_score
    ).count() + 1

    return Response({
        "matches": serializer.data,
        "rank": rank
    }, status=200)


@api_view(["GET"])
def get_leaderboard(request):

    leaderboard = User.objects.annotate(
        rank=Window(
            expression=Rank(),
            order_by=F('total_score').desc()
        )
    )
    serializer = serializers.MiniUserSerializer(leaderboard, many=True)

    return Response({
        "leaderboard": serializer.data,
    }, status=200)
