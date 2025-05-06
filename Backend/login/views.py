from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import registerSerializer,userSerializer,loginSerializer
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token

# Create your views here.

class Register(APIView):
    serializer_class=registerSerializer
    def post(self,request):
        data=request.data
        print(data)
        serailizer=self.serializer_class(data=data)
        if serailizer.is_valid(raise_exception=True):       # here is_valid() calls validation function from serializer.
            serailizer.save()
            user=serailizer.instance
            print(user)
            print('Done')
            return Response({
                'data':serailizer.data, # it needs json so using serializer.data
                'message':f'Hello, {user.first_name}' #it needs object instance for getting first_name
            },status=status.HTTP_201_CREATED)
        return Response(serailizer.errors, status=status.HTTP_400_BAD_REQUEST)
         
        
class Login(APIView):
    def post(self,request):
        data=request.data
        serializer=loginSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
class userInfo(APIView):   
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user = request.user  # authenticated user
        serializer = userSerializer(user)
        return Response(serializer.data)
        
        
class LogOut(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,request):
        try:
            data=request.data
            refresh_token=data['refresh_token']
            token=RefreshToken(refresh_token)
            token.blacklist()
            return Response({
                'msg':'Logged Out sucessfully'
            })
        except Exception as e:
            return Response({
                'msg':'Invalid Token'
            })
        