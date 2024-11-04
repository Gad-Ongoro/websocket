from django.urls import path
from . import views

urlpatterns = [
    path('rooms/', views.RoomCreateView.as_view(), name='room_create'),
    path('rooms/list/', views.RoomListView.as_view(), name='room_list'),
    path('rooms/<uuid:pk>/', views.RoomDetailView.as_view(), name='room_detail'),
    path('rooms/<uuid:room_id>/messages/new/', views.MessageCreateView.as_view(), name='message_create'),
    path('rooms/<uuid:room_id>/messages/view/', views.MessageListView.as_view(), name='message_list'),
]
