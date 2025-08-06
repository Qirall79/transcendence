from rest_framework import serializers
from .models import Conversation
from .models import Message
from authentication.serializers import FriendSerializer





class ConversationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Conversation
        fields = ['id', 'user_1', 'user_2', 'modified_date']



class MessagesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'conversation', 'content', 'is_readed', 'send_date']