from rest_framework import serializers
from django.core.validators import MinLengthValidator, MaxLengthValidator

class validationSerializer(serializers.Serializer):
    frames = serializers.ListField(
        child=serializers.CharField(),
        validators=[
            MinLengthValidator(10),
            MaxLengthValidator(10)
        ]
    )
    batch_number=serializers.IntegerField()
    timestamp=serializers.IntegerField()
    validation_step=serializers.CharField()
    
    # def validate(self, value):
    #     """
    #     Validate that all frames are valid base64 encoded JPEG images
    #     """
    #     if len(value) != 10:
    #         raise serializers.ValidationError("Must provide exactly 10 frames")
        
    #     # Optional: Add base64 validation if needed
    #     for frame in value:
    #         if not frame.startswith('data:image/jpeg;base64,'):
    #             raise serializers.ValidationError("Invalid frame format. Must be base64 encoded JPEG")
        
    #     return value
