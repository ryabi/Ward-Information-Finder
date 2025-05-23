# Generated by Django 5.2 on 2025-05-08 08:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_district_province_candidates_bio_candidates_gender_and_more'),
    ]

    operations = [
        
        migrations.AddField(
            model_name='candidates',
            name='email',
            field=models.EmailField(default=None, max_length=254),
        ),
        migrations.AddField(
            model_name='ward',
            name='ward_numbers',
            field=models.JSONField(default=list),
        ),
        migrations.AlterUniqueTogether(
            name='ward',
            unique_together={('ward_numbers', 'municipality')},
        ),
        
        migrations.RemoveField(
            model_name='ward',
            name='ward_no',
        ),
    ]
