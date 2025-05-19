from django.urls import path,re_path
from .consumers import ValidateUser

webSocket_urlpatterns=[
    re_path(r'^ws/video/?$',ValidateUser.as_asgi()),
]

