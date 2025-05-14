from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.parsers import FileUploadParser
# Create your views here.

class pose_detection(APIView):
    parser_classes = [FileUploadParser] 
    
    def post(self,request,format=None):
        file_obj=request.data["file"]
    