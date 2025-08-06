from rest_framework import serializers
from .models import TicTacToeMatch, TicTacToePlayerStats
from authentication.serializers import UserSerializer


class TicTacToeMatchSerializer(serializers.ModelSerializer):
    player1 = UserSerializer(read_only=True)
    player2 = UserSerializer(read_only=True)
    winner = UserSerializer(read_only=True)

    class Meta:
        model = TicTacToeMatch
        fields = [
            "id",
            "room_id",
            "player1",
            "player2",
            "winner",
            "is_draw",
            "created_at",
        ]


class TicTacToePlayerStatsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    win_rate = serializers.FloatField(read_only=True)

    class Meta:
        model = TicTacToePlayerStats
        fields = [
            "id",
            "user",
            "games_played",
            "wins",
            "losses",
            "draws",
            "win_rate",
            "last_updated",
        ]
