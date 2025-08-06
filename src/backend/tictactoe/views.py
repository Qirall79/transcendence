from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from .models import TicTacToeMatch, TicTacToePlayerStats
from .serializers import TicTacToeMatchSerializer, TicTacToePlayerStatsSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def match_history(request):
    """Get match history for current user"""
    user = request.user

    matches = TicTacToeMatch.objects.filter(Q(player1=user) | Q(player2=user)).order_by(
        "-created_at"
    )[:50]

    serializer = TicTacToeMatchSerializer(matches, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def player_stats(request):
    """Get player's game statistics"""
    user = request.user

    stats, created = TicTacToePlayerStats.objects.get_or_create(user=user)

    serializer = TicTacToePlayerStatsSerializer(stats)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def leaderboard(request):
    """Get leaderboard of top players"""
    top_players = TicTacToePlayerStats.objects.filter(games_played__gte=3).order_by(
        "-wins"
    )[:10]

    serializer = TicTacToePlayerStatsSerializer(top_players, many=True)
    return Response(serializer.data)
