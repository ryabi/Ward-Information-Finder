from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

class registerSerializer(serializers.ModelSerializer):
    password=serializers.CharField(max_length=20,min_length=8,write_only=True)
    re_password=serializers.CharField(max_length=20,min_length=8,write_only=True)
    class Meta:
        model=User
        fields=[ 'first_name', 'last_name', 'email', 'phone_number', 'gender',
            'country', 'province', 'district', 'municipality', 'town', 'ward_no',
            'date_of_birth', 'username', 'password', 're_password']   
        
    def create(self,validate_data):  # create a model user object from serialized data to pass to database.
        del validate_data['re_password']
        user=User.objects.create_user(**validate_data)
        return user
           
    def validate(self, attrs):
        password=attrs.get('password','')
        re_password=attrs.get('re_password','')
        if password != re_password:
            raise serializers.ValidationError("Passwords do not match")
        
        # del attrs['re_password']
        return attrs   
        
class loginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField(write_only=True)  
    
    
    # i don't need it as i'm not using model serializer.
    # isAdmin = serializers.BooleanField(read_only=True)
    # full_name=serializers.CharField(read_only=True)
    # access_token=serializers.CharField(max_length=256,read_only=True)
    # refresh_token=serializers.CharField(max_length=256,read_only=True)
    
    # class Meta:
    #     model=User
    #     fields=['username','password','full_name','isAdmin','access_token','refresh_token']
    
    # def get_isAdmin(self, obj):
    #     return obj.is_staff
        
    def validate(self, attrs):
        username=attrs.get('username')
        password=attrs.get('password')
        request=self.context.get('request')
        user=authenticate(request,username=username,password=password)
        
        if not user :
            raise AuthenticationFailed("Invalide Username or Password, TRY AGAIN")
        
        token=user.get_token() 
        self.user=user 
        self.token=token
        
        return attrs
    
    def to_representation(self, instance):
         return {
            'username':self.user.username,
            'access_token':self.token.get('access'),
            'refresh_token':self.token.get('refresh'),
        }
        
        
class userSerializer(serializers.ModelSerializer):
    isAdmin = serializers.SerializerMethodField()
    class Meta:
        model=User
        fields=[ 'id','first_name', 'last_name','username','email','isAdmin','phone_number','province','district','date_of_birth','ward_no','municipality']
         
    def get_isAdmin(self, obj):
        return obj.is_staff
        
class logoutSerializer(serializers.Serializer):
    refresh_token=serializers.CharField()
        
        
    