from django.urls import path
from .views import pose_detection

urlpatterns=[
    path('',pose_detection.as_view(),name='pose_detection')
    
]