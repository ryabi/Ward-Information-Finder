from django.core.management.base import BaseCommand
import json
import os
from django.conf import settings
from api.models import Candidates, Ward, Municipality, District, Province
import re

data_path=os.path.join(settings.BASE_DIR,'data/nepali_dataset.json')

class Command(BaseCommand):
    help="load Province,District,Municipality,Ward data"
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            required=True,
            help="path to the jason file containing data"
        )
        
    def handle(self,*args,**options):
        file_path=options['file']
        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"❌ File not found: {file_path}"))
            return

        with open (data_path,'r',encoding='utf-8') as f:
            data=json.load(f)
        
        expression=r"(.*?)\s+(Rural Municipality|Municipality|Sub-Metropolitan City|Metropolitan City)"
        
        for entry in data:
          
            province, _ = Province.objects.get_or_create(name=entry["state"].lower())
            district, _ = District.objects.get_or_create(name=entry["district"].lower(), province=province)
            match=re.match(expression,entry["municipality"])
            if match:
                municipality, _ = Municipality.objects.get_or_create(
                    name=match.group(1).lower(),
                    district=district,
                    type=match.group(2).lower()
                )
            for x in entry["wards"]:    
                ward,_=Ward.objects.get_or_create(ward_no=x,municipality=municipality)
        
        
        self.stdout.write(self.style.SUCCESS("✅ Data successfully loaded!"))