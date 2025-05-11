# management/commands/reset_data.py
from django.core.management.base import BaseCommand
from api.models import Candidates, Ward, Municipality, District, Province
import json
import os
from django.conf import settings

class Command(BaseCommand):
    help = 'Resets all data from the app models'

    def handle(self, *args, **kwargs):
        Candidates.objects.all().delete()
        Ward.objects.all().delete()
        Municipality.objects.all().delete()
        District.objects.all().delete()
        Province.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Data reset complete.'))

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")  # replace with your project name
# django.setup()

# from api.models import Candidates, Ward, Municipality, District, Province

# data_path=os.path.join(settings.BASE_DIR,'data/nepali_dataset.json')

# with open (data_path,'r',encoding='utf-8') as f:
#     data=json.load(f)
    
# for entry in data:
#     print(entry)