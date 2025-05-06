from django.db import models
from django.contrib.auth.models import AbstractUser,AbstractBaseUser,PermissionsMixin
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _ 
from rest_framework_simplejwt.tokens import RefreshToken
# Create your models here.

class User(AbstractUser):
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    email = models.EmailField(blank=False,unique=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    # photo = models.ImageField(upload_to='user_photos/', blank=True, null=True)
    country = models.CharField(max_length=100,blank=False)
    province = models.CharField(max_length=100,blank=False)
    district = models.CharField(max_length=100,blank=False)
    municipality = models.CharField(max_length=100,blank=False)
    town = models.CharField(max_length=100,blank=False)
    ward_no = models.CharField(max_length=10)
    
    date_of_birth = models.DateField(blank=True, null=True)
    
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=False) # Validators should be a list
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name','last_name','email','phone_number']
    
    def __str__(self): # this method returns the username as the name of the object instead of "object" when we fetch it's name in admin or in shell
        return f'{self.first_name} {self.last_name}'
    
    @property
    def get_full_name(self):
        return f'{self.first_name} {self.last_name}'
 
    def get_token(self):
        refresh=RefreshToken.for_user(self)
        return {
            'refresh':str(refresh),
            'access':str(refresh.access_token)
        }
       
class OneTimePassword(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    code = models.CharField(max_length=4,unique=True)
    def __str__(self):
        return f'{self.user.first_name}--Passcode'
    
