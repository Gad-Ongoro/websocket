from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

# Create your views here.
class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search_term = self.request.query_params.get('search', None)
        if search_term:
            queryset = queryset.filter(first_name__icontains=search_term) or queryset.filter(last_name__icontains=search_term)
        return queryset

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer