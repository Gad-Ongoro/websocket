import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import datetime
import uuid
from .models import Room, ChatMessage
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    # create connection
    async def connect(self):
        query_params = parse_qs(self.scope['query_string'].decode())
        self.user_id = query_params.get('user_id')[0]
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.chat_type = self.scope['url_route']['kwargs'].get('room_type', 'GROUP')
 
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )

        await self.accept()

    # close connection
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )
        
        self.close(close_code)

    # receive and broadcast msg
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender = data['sender']
        
        event = {
            'type': 'send_message',
            'message': message,
            'timestamp': str(datetime.datetime.now()),
            'sender': sender,
            'room_type': self.chat_type
        }
        
        # save msg to db
        await self.save_message(self.user_id, message, self.chat_type)

        # broadcast msg to room
        await self.channel_layer.group_send(
            self.room_name,
            event
        )
    
    # send message
    async def send_message(self, event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'id': str(uuid.uuid4()),
            'message': message,
            'timestamp': str(datetime.datetime.now()),
            'sender': sender
        }))
        
    @database_sync_to_async
    def save_message(self, sender, message, room_type):
        room_name = self.room_name
        try:
            sender = User.objects.get(id=self.user_id)
        except ObjectDoesNotExist:
            raise ValueError(f"User with ID '{self.user_id}' does not exist.")

        if room_type == 'DM':
            room, created = Room.objects.get_or_create(
                room_type='DM',
                name=room_name
            )
        else:
            room, created = Room.objects.get_or_create(
                room_type='GROUP',
                name=self.room_name
            )

        ChatMessage.objects.create(
            room=room,
            sender=sender,
            message=message
        )