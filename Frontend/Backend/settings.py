INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'channels',
    # ... your other apps ...
]

# Add Channels configuration
ASGI_APPLICATION = 'Backend.asgi.application'

# Channel layers configuration (using in-memory channel layer for development)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}

# ... rest of your settings ... 