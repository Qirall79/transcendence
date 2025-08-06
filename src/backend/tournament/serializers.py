from rest_framework import serializers
from .models import Tournament
from authentication.models import User
from authentication.serializers import UserSerializer

class TournamentSerializer(serializers.ModelSerializer):
    players = UserSerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)
    final_winner = UserSerializer(read_only=True)

    class Meta:
        model = Tournament
        fields = ['id', 'is_open', 'is_full', 'owner', 'final_winner', 'name', 'game', 'participants', 'players', 'opened', 'started', 'closed']

