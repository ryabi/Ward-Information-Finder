from rest_framework import serializers
from .models import Candidates,Ward,Municipality

class candidateSerializer(serializers.ModelSerializer):
    municipality=serializers.CharField(write_only=True)
    ward=serializers.IntegerField(write_only=True)
    class Meta:
        model=Candidates
        fields=['name','gender','post','email','bio','municipality','ward']
        
    
    def create(self, validated_data):
        print(validated_data)
        municipality_obj=Municipality.objects.get(name=validated_data["municipality"].lower())
        ward_obj=Ward.objects.get(ward_no=validated_data["ward"],municipality=municipality_obj)
        del validated_data["municipality"]
        del validated_data["ward"]
        print(validated_data)
        canidate_obj=Candidates.objects.create(
            ward=ward_obj, **validated_data
        )
        
        return canidate_obj
    # def to_representation(self, instance):
        
    #     return {
    #         "candidate":{
    #             instance
    #         }
    #     }