from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from uuid import uuid4

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not password:
            raise ValueError('The Password field must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = None
    otp_secret = models.CharField(max_length=32, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_google_user = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def name(self):
        return f'{self.first_name} {self.last_name}'
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()

    def __str__(self):
        return self.email
