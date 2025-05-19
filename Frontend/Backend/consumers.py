import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import base64
import cv2
import numpy as np
from .models import ValidationResult

class VideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("WebSocket connected")

    async def disconnect(self, close_code):
        print("WebSocket disconnected")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            
            if data['type'] == 'frames':
                # Process frames and perform validation
                validation_result = await self.process_frames(data['data'])
                
                # Send validation result back to client
                await self.send(text_data=json.dumps({
                    'type': 'validation_result',
                    'data': {
                        'validation': validation_result
                    }
                }))
        except Exception as e:
            print(f"Error processing message: {str(e)}")
            await self.send(text_data=json.dumps({
                'type': 'error',
                'data': {
                    'message': str(e)
                }
            }))

    @database_sync_to_async
    def process_frames(self, data):
        try:
            frames = data['frames']
            validation_step = data['validation_step']
            gesture_recognize = data['gesture_recognize']

            # Process frames and perform validation
            # This is where you'll implement your existing validation logic
            # For now, returning a simple validation result
            return 'validated'
        except Exception as e:
            print(f"Error processing frames: {str(e)}")
            return 'invalid' 