from django.core.management.base import BaseCommand
import json
import os
from django.conf import settings
from api.models import Candidates, Ward, Municipality, District, Province
import re

class add_candidate(BaseCommand):
    help="ADD candidate daata from CLI"
    
    def handle(self, *args, **options):
        
        return super().handle(*args, **options)