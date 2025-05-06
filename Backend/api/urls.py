
from django.urls import path,include
from .views import Candidate

urlpatterns = [
    path('auth/',include('login.urls')),
    path('candidate/',Candidate.as_view()),
    path('candidate/<int:pk>/', Candidate.as_view()),
]
