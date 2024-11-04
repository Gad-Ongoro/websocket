from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from . import models

# user
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ['id', 'first_name', 'last_name', 'name', 'email', 'is_verified', 'is_google_user', 'password', 'date_joined', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True},
            'otp_secret': {'read_only': True},
            'is_verified': {'read_only': True},
            'is_google_user': {'read_only': True},
        }

    def create(self, validated_data):
        if not validated_data.get('is_google_user', False):
            validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance