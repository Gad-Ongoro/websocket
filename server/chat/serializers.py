# chat/serializers.py
from rest_framework import serializers
from .models import ChatMessage, Vote, Room
from users.serializers import UserSerializer

# Room serializer
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
        
class RoomListSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True)
    class Meta:
        model = Room
        fields = '__all__'

# ChatMessage serializer
class ChatMessageListSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    class Meta:
        model = ChatMessage
        fields = '__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'
