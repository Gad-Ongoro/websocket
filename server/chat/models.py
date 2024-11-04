from django.db import models
from django.contrib.auth import get_user_model
from uuid import uuid4

User = get_user_model()

# Create your models here.
class Room(models.Model):
    ROOM_TYPE_CHOICES = [
        ('DM', 'Direct Message'),
        ('GROUP', 'Group Chat'),
    ]
    
    room_id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    name = models.CharField(max_length=100, blank=True, null=True)
    room_type = models.CharField(max_length=5, choices=ROOM_TYPE_CHOICES)
    participants = models.ManyToManyField(User, related_name='rooms')

    def __str__(self):
        if self.room_type == 'DM':
            return f"DM between {self.participants.all()[0]} and {self.participants.all()[1]}"
        return f"Group Chat: {self.name or 'Unnamed Group'}"

class ChatMessage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    message = models.TextField()
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    timestamp = models.DateTimeField(auto_now_add=True)
    edited = models.BooleanField(default=False)
    
    def __str__(self):
        return f'{self.sender}: {self.message}'

class Vote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    option = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
