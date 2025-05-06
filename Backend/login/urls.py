
from django.urls import path
from .views import Register,Login,LogOut,userInfo
urlpatterns = [
    path('register/',Register.as_view(),name='register'),
    path('login/',Login.as_view(),name='login'),
    path('logout/',LogOut.as_view(),name='logout'),
     path('user/',userInfo.as_view(),name='user')
]
