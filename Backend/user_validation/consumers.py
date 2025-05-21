from channels.consumer import SyncConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import os
import io
import numpy as np
from mediapipe import solutions
from mediapipe.framework.formats import landmark_pb2
import logging
import json
import base64
from PIL import Image
import absl.logging
import sys

# Suppress MediaPipe warnings
logging.root.removeHandler(absl.logging._absl_handler)
absl.logging._warn_preinit_stderr = False

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Remove any existing handlers to prevent duplicate logs
for handler in logger.handlers[:]:
    logger.removeHandler(handler)

# Create a formatter with more detailed information
formatter = logging.Formatter(
    '%(asctime)s - %(levelname)s - [%(name)s] - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Create console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Create file handler
file_handler = logging.FileHandler('validation.log')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Suppress MediaPipe specific warnings
logging.getLogger('mediapipe').setLevel(logging.ERROR)

# Prevent propagation to root logger to avoid duplicate logs
logger.propagate = False

class ValidateUser(AsyncWebsocketConsumer):
    model_path='./data/pose_landmarker_full.task'
    gesture_model_path='./data/gesture_recognizer.task'
    
    BaseOptions = mp.tasks.BaseOptions
    PoseLandmarker = mp.tasks.vision.PoseLandmarker
    PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
    # PoseLandmarkerResult = mp.tasks.vision.PoseLandmarkerResult
    VisionRunningMode = mp.tasks.vision.RunningMode

    #For gesture recognition model. Configuring Model
    gesture_BaseOptions = mp.tasks.BaseOptions
    GestureRecognizer = mp.tasks.vision.GestureRecognizer
    GestureRecognizerOptions = mp.tasks.vision.GestureRecognizerOptions
    gesture_VisionRunningMode = mp.tasks.vision.RunningMode

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.pose_landmarker = None
        self.gesture_recognizer = None
        self.pose_options = None
        self.gesture_options = None
        self.client_id = None

    async def connect(self):
        self.client_id = id(self)
        logger.info(f"Client {self.client_id} attempting to connect")
        try:
            # Initialize pose landmarker options
            self.pose_options = self.PoseLandmarkerOptions(
                base_options=self.BaseOptions(model_asset_path=self.model_path),
                running_mode=self.VisionRunningMode.IMAGE,
                min_pose_detection_confidence=0.55,
                min_pose_presence_confidence=0.55,
                output_segmentation_masks=False
            )

            # Initialize gesture recognizer options
            self.gesture_options = self.GestureRecognizerOptions(
                base_options=self.gesture_BaseOptions(model_asset_path=self.gesture_model_path),
                running_mode=self.gesture_VisionRunningMode.IMAGE,
                min_hand_detection_confidence=0.55,
                min_hand_presence_confidence=0.55,
            )

            # Create model instances
            self.pose_landmarker = self.PoseLandmarker.create_from_options(self.pose_options)
            self.gesture_recognizer = self.GestureRecognizer.create_from_options(self.gesture_options)

            awai~t self.accept()
            logger.info(f"Client {self.client_id} connected successfully and models initialized")
        except Exception as e:
            logger.error(f"Client {self.client_id} error during connection: {str(e)}")
            await self.close()
        
    async def disconnect(self, close_code):
        logger.info(f"[WebSocket] Client {self.client_id} disconnected with code: {close_code}")
        try:
            # Clean up model resources
            if self.pose_landmarker:
                self.pose_landmarker.close()
                self.pose_landmarker = None
            if self.gesture_recognizer:
                self.gesture_recognizer.close()
                self.gesture_recognizer = None
            logger.info(f"[WebSocket] Client {self.client_id} model resources cleaned up")
        except Exception as e:
            logger.error(f"[WebSocket] Client {self.client_id} error during cleanup: {str(e)}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            logger.info(f"[WebSocket] Client {self.client_id} received message type: {data.get('type')}")

            if data['type'] == 'frames':
                # Process the frames
                await self.process_frames(data['data'])
            else:
                logger.warning(f"[WebSocket] Client {self.client_id} unknown message type: {data['type']}")

        except json.JSONDecodeError:
            logger.error(f"[WebSocket] Client {self.client_id} failed to parse JSON message")
            await self.send_error("Invalid JSON message")
        except Exception as e:
            logger.error(f"[WebSocket] Client {self.client_id} error processing message: {str(e)}")
            await self.send_error(str(e))

    async def send_error(self, message):
        response = {
            'type': 'error',
            'data': {
                'message': message
            }
        }
        logger.error(f"[WebSocket] Client {self.client_id} sending error response: {json.dumps(response)}")
        await self.send(text_data=json.dumps(response))

    async def send_validation_result(self, validation, validation_step):
        response = {
            'type': 'validation_result',
            'data': {
                'validation': validation,
                'validation_step': validation_step
            }
        }
        try:
            await self.send(text_data=json.dumps(response))
            logger.info(f"Client {self.client_id} - {validation_step}: {validation}")
        except Exception as e:
            logger.error(f"Client {self.client_id} - Error sending validation result: {str(e)}")

    async def process_frames(self, data):
        try:    
            frames = data['frames']
            validation_step = data['validation_step']
            batch_number = data['batch_number']
            gesture_recognize = data['gesture_recognize']
            logger.info(f"Client {self.client_id} - Processing batch {batch_number} for {validation_step}")

            if not gesture_recognize:
                true_counter = 0
                false_counter = 0
                for frame in frames:
                    try:
                        if 'base64' in frame:
                            frame = frame.split('base64,')[1]
                            img_data = base64.b64decode(frame)
                            
                            pil_image = Image.open(io.BytesIO(img_data)).convert('RGB')
                            np_img = np.array(pil_image)
                            mp_image = mp.Image(
                                image_format=mp.ImageFormat.SRGB, 
                                data=np_img
                            )
                            
                            result = self.pose_landmarker.detect(mp_image)
                            
                            if not result.pose_landmarks:
                                logger.warning(f"Client {self.client_id} - No pose landmarks detected")
                                await self.send_validation_result('not_validated', validation_step)
                                return

                            if validation_step == 'leftHand':
                                left_valid = self.left_hand_validation(result)
                                right_valid = self.right_hand_validation(result)
                                is_valid = left_valid and not right_valid
                            elif validation_step == 'rightHand':
                                left_valid = self.left_hand_validation(result)
                                right_valid = self.right_hand_validation(result)
                                is_valid = right_valid and not left_valid
                            elif validation_step == 'bothHands':
                                left_valid = self.left_hand_validation(result)
                                right_valid = self.right_hand_validation(result)
                                is_valid = left_valid and right_valid
                            else:
                                is_valid = False
                                logger.warning(f"Client {self.client_id} - Unknown validation step: {validation_step}")

                            if is_valid:
                                true_counter += 1
                            else:
                                false_counter += 1

                            if true_counter >= 3:
                                await self.send_validation_result('validated', validation_step)
                                logger.info(f"Client {self.client_id} - {validation_step} validation successful")
                                return
                            if false_counter >= 5:
                                await self.send_validation_result('not_validated', validation_step)
                                logger.info(f"Client {self.client_id} - {validation_step} validation failed")
                                return

                    except Exception as e:
                        logger.error(f"Client {self.client_id} - Error processing frame: {str(e)}")
                        await self.send_error(f"Error processing frame: {str(e)}")
                        return

            elif gesture_recognize:
                true_counter = 0
                false_counter = 0
                for frame in frames:
                    try:
                        if 'base64' in frame:
                            frame = frame.split('base64,')[1]
                            img_data = base64.b64decode(frame)
                            
                            pil_image = Image.open(io.BytesIO(img_data)).convert('RGB')
                            np_img = np.array(pil_image)
                            mp_image = mp.Image(
                                image_format=mp.ImageFormat.SRGB, 
                                data=np_img
                            )
                            
                            gesture_result = self.gesture_recognizer.recognize(mp_image)
                            
                            if gesture_result.gestures and gesture_result.gestures[0]:
                                detected_gesture = gesture_result.gestures[0][0].category_name
                                is_valid = detected_gesture == validation_step
                                
                                if is_valid:
                                    true_counter += 1
                                else:
                                    false_counter += 1

                                if true_counter >= 3:
                                    await self.send_validation_result('validated', validation_step)
                                    logger.info(f"Client {self.client_id} - {validation_step} gesture validation successful")
                                    return
                                if false_counter >= 7:
                                    await self.send_validation_result('not_validated', validation_step)
                                    logger.info(f"Client {self.client_id} - {validation_step} gesture validation failed")
                                    return

                    except Exception as e:
                        logger.error(f"Client {self.client_id} - Error processing gesture frame: {str(e)}")
                        await self.send_error(f"Error processing gesture frame: {str(e)}")
                        return

        except Exception as e:
            logger.error(f"Client {self.client_id} - Error processing frames: {str(e)}")
            await self.send_error(f"Error processing frames: {str(e)}")
            return

    def left_hand_validation(self, detection_result):
        if not detection_result.pose_landmarks:
            return False
        pose_landmarks_list = detection_result.pose_landmarks
        try:
            leftRaise = (
                (pose_landmarks_list[0][13].y > pose_landmarks_list[0][19].y) and 
                (pose_landmarks_list[0][13].y > pose_landmarks_list[0][15].y) and
                (pose_landmarks_list[0][13].visibility > 0.55) and 
                (pose_landmarks_list[0][13].presence > 0.55)
            )
            return leftRaise
        except Exception as e:
            logger.error(f"Client {self.client_id} - Error in left hand validation: {str(e)}")
            return False

    def right_hand_validation(self, detection_result):
        if not detection_result.pose_landmarks:
            return False
        pose_landmarks_list = detection_result.pose_landmarks
        try:
            rightRaise = (
                (pose_landmarks_list[0][14].y > pose_landmarks_list[0][20].y) and
                (pose_landmarks_list[0][14].y > pose_landmarks_list[0][16].y) and
                (pose_landmarks_list[0][14].visibility > 0.55) and 
                (pose_landmarks_list[0][14].presence > 0.55)
            )
            return rightRaise
        except Exception as e:
            logger.error(f"Client {self.client_id} - Error in right hand validation: {str(e)}")
            return False
    
        