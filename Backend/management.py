# management/commands/reset_data.py
from django.core.management.base import BaseCommand
from api.models import Candidate, Ward, Municipality, District, Province

class Command(BaseCommand):
    help = 'Resets all data from the app models'

    def handle(self, *args, **kwargs):
        Candidate.objects.all().delete()
        Ward.objects.all().delete()
        Municipality.objects.all().delete()
        District.objects.all().delete()
        Province.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Data reset complete.'))
