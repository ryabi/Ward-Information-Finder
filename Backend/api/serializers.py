from rest_framework import serializers
from .models import Candidates,Ward,Municipality,District,Province

class candidateSerializer(serializers.ModelSerializer):
    district=serializers.CharField(write_only=True)
    municipality=serializers.CharField(write_only=True)
    ward=serializers.IntegerField(write_only=True)
    class Meta:
        model=Candidates
        fields=['name','gender','post','email','bio','municipality','ward','district']
        
    
    def create(self, validated_data):
        print(validated_data)
        district_obj=District.objects.get(name=validated_data["district"].lower())
        municipality_obj=Municipality.objects.get(name=validated_data["municipality"].lower(),district=district_obj)
        ward_obj=Ward.objects.get(ward_no=validated_data["ward"],municipality=municipality_obj)
        del validated_data["municipality"]
        del validated_data["ward"]
        del validated_data["district"]
        print(validated_data)
        canidate_obj=Candidates.objects.create(
            ward=ward_obj, **validated_data
        )
        
        return canidate_obj
   
    
class MunicipalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipality
        fields = ['id', 'name', 'type','district']
        
        
class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = ['id', 'name', 'province']
        

        
class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ['id', 'name']