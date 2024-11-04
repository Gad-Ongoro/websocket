from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UserListCreateView.as_view(), name='users_list_create'),
    path('users/<uuid:pk>/', views.UserDetailView.as_view(), name='user_detail'),
]