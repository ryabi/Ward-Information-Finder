"""
ASGI config for myproject project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import path
from user_validation.routing import webSocket_urlpatterns
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

application=ProtocolTypeRouter({  #This is root asgi application where out request(connection) will first hit after being parsed by asgi server. It's scope based routing
    "http":get_asgi_application(),
     "websocket": URLRouter(
        webSocket_urlpatterns
     )
})
# application = get_default_application()
