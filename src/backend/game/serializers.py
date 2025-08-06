from rest_framework import serializers
from .models import Match, GameInvite
from authentication.models import User
from authentication.serializers import UserSerializer

class MatchSerializer(serializers.ModelSerializer):
    player1 = UserSerializer(read_only=True)
    player2 = UserSerializer(read_only=True)
    winner = UserSerializer(read_only=True)

    class Meta:
        model = Match
        fields = ['room_id', 'player1', 'player2', 'winner', 'winner_score', 'loser_score', 'game', 'played_at']

class GameInviteSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = GameInvite
        fields = ['sender', 'receiver']

class MatchSummarySerializer(serializers.Serializer):
    month = serializers.DateTimeField(format='%b')
    wins = serializers.IntegerField()
    losses = serializers.IntegerField()

