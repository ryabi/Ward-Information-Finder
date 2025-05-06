from django.db import models

# Create your models here.
class Province(models.Model):
    name=models.CharField(max_length=50,unique=True)

    def __str__(self):
        return self.name

class District(models.Model):
    name=models.CharField(max_length=50,unique=True)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name='districts')
    
    class Meta:
        unique_together = ('name', 'province')

    def __str__(self):
        return f"{self.name}, {self.province.name}"
    
class Municipality(models.Model):
    MUNICIPALITY_TYPES = [
        ('Rural', 'Rural Municipality'),
        ('Urban', 'Urban Municipality'),
        ('SubMetropolitan', 'Sub-Metropolitan City'),
        ('Metropolitan', 'Metropolitan City'),
    ]

    name = models.CharField(max_length=100)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='municipalities')
    type = models.CharField(max_length=20, choices=MUNICIPALITY_TYPES)

    class Meta:
        unique_together = ('name', 'district')

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

class Ward(models.Model):
    ward_no = models.PositiveIntegerField()
    municipality = models.ForeignKey(Municipality, on_delete=models.CASCADE, related_name='wards')
    info = models.TextField(blank=True, null=True)  # or use JSONField if you want structured info

    class Meta:
        unique_together = ('ward_no', 'municipality')

    def __str__(self):
        return f"Ward {self.ward_no} - {self.municipality.name}"

class Candidates(models.Model):
    name=models.CharField(max_length=256)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    post=models.CharField(max_length=50)
    ward=models.ForeignKey(Ward, on_delete=models.CASCADE, related_name='candidates')
    bio = models.TextField(blank=True, null=True)
    class Meta:
        unique_together=('post','ward')
    
    def __str__(self):
        return self.name