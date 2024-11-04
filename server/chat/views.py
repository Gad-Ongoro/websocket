from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import ChatMessage, Room
from . import serializers
from rest_framework import status

User = get_user_model()

# Create your views here.

# Room views
class RoomCreateView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = serializers.RoomSerializer

    def perform_create(self, serializer):
        participants = self.request.data.get('participants')
        room_type = self.request.data.get('room_type')

        if room_type == 'DM':
            if len(participants) != 2:
                return Response(
                    {'error': 'DMs must have exactly 2 participants.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            existing_room = Room.objects.filter(room_type='DM').filter(participants__in=participants).distinct()
            if existing_room.exists():
                return Response({'error': 'DM room already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        
class RoomListView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = serializers.RoomListSerializer
        
class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = serializers.RoomSerializer

# ChatMessage views
class MessageCreateView(generics.CreateAPIView):
    queryset = ChatMessage.objects.all()
    serializer_class = serializers.ChatMessageSerializer

    def perform_create(self, serializer):
        room = Room.objects.get(pk=self.kwargs['room_id'])
        serializer.save(room=room, sender=self.request.user)
        
class MessageListView(generics.ListAPIView):
    serializer_class = serializers.ChatMessageListSerializer

    def get_queryset(self):
        room_id = self.kwargs['room_id']
        return ChatMessage.objects.filter(room_id=room_id).order_by('timestamp')
