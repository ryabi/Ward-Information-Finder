from rest_framework import serializers
from .models import Candidates

class candidateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Candidates
        fields='__all__'
        
    # def to_representation(self, instance):
        
    #     return {
    #         "candidate":{
    #             instance
    #         }
    #     }