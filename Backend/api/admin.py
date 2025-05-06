from django.contrib import admin
from .models import Candidates,Ward,Municipality,District,Province
# Register your models here.
admin.site.register([Candidates,Ward,Municipality,District,Province])