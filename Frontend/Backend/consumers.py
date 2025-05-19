import json
import base64
import cv2
import numpy as np
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import logging

# Set up logging
logger = logging.getLogger(__name__)

class VideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        logger.info("[WebSocket] Client attempting to connect")
        await self.accept()
        logger.info("[WebSocket] Client connected successfully")

    async def disconnect(self, close_code):
        logger.info(f"[WebSocket] Client disconnected with code: {close_code}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            logger.info(f"[WebSocket] Received message type: {data.get('type')}")

            if data['type'] == 'frames':
                # Process the frames
                await self.process_frames(data['data'])
            else:
                logger.warning(f"[WebSocket] Unknown message type: {data['type']}")

        except json.JSONDecodeError:
            logger.error("[WebSocket] Failed to parse JSON message")
        except Exception as e:
            logger.error(f"[WebSocket] Error processing message: {str(e)}")

    @sync_to_async
    def process_frames(self, data):
        try:
            frames = data['frames']
            validation_step = data['validation_step']
            batch_number = data['batch_number']
            
            logger.info(f"[Processing] Processing batch {batch_number} for step {validation_step}")
            
            # Process each frame
            for frame_data in frames:
                # Convert base64 to image
                frame_bytes = base64.b64decode(frame_data.split(',')[1])
                nparr = np.frombuffer(frame_bytes, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                # Process frame based on validation step
                result = self.validate_frame(frame, validation_step)
                
                if result:
                    # Send validation result back to client
                    self.send(text_data=json.dumps({
                        'type': 'validation_result',
                        'data': {
                            'validation': 'validated',
                            'validation_step': validation_step
                        }
                    }))
                    logger.info(f"[Validation] Step {validation_step} validated successfully")
                    return

        except Exception as e:
            logger.error(f"[Processing] Error processing frames: {str(e)}")
            self.send(text_data=json.dumps({
                'type': 'error',
                'data': {
                    'message': f'Error processing frames: {str(e)}'
                }
            }))

    def validate_frame(self, frame, validation_step):
        """
        Implement your validation logic here.
        This is a placeholder that you'll need to implement based on your requirements.
        """
        try:
            # Convert frame to RGB (OpenCV uses BGR)
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Add your validation logic here
            # For example:
            # - Use MediaPipe for hand detection
            # - Use OpenCV for gesture recognition
            # - Use a machine learning model for pose estimation
            
            # Placeholder validation (always returns False)
            return False

        except Exception as e:
            logger.error(f"[Validation] Error in validation: {str(e)}")
            return False 