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

logger = logging.getLogger(__name__)

class ValidateUser(AsyncWebsocketConsumer):
    model_path='./data/pose_landmarker_full.task'
    gesture_model_path='./data/gesture_recognizer.task'
    
    BaseOptions = mp.tasks.BaseOptions
    PoseLandmarker = mp.tasks.vision.PoseLandmarker
    PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
    PoseLandmarkerResult = mp.tasks.vision.PoseLandmarkerResult
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

    async def connect(self):
        logger.info("[WebSocket] Client attempting to connect")
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

            await self.accept()
            logger.info("[WebSocket] Client connected successfully and models initialized")
        except Exception as e:
            logger.error(f"[WebSocket] Error during connection: {str(e)}")
            await self.close()
        
    async def disconnect(self, close_code):
        logger.info(f"[WebSocket] Client disconnected with code: {close_code}")
        try:
            # Clean up model resources
            if self.pose_landmarker:
                self.pose_landmarker.close()
                self.pose_landmarker = None
            if self.gesture_recognizer:
                self.gesture_recognizer.close()
                self.gesture_recognizer = None
            logger.info("[WebSocket] Model resources cleaned up")
        except Exception as e:
            logger.error(f"[WebSocket] Error during cleanup: {str(e)}")

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
            await self.send_error("Invalid JSON message")
        except Exception as e:
            logger.error(f"[WebSocket] Error processing message: {str(e)}")
            await self.send_error(str(e))

    async def send_error(self, message):
        await self.send(text_data=json.dumps({
            'type': 'error',
            'data': {
                'message': message
            }
        }))

    async def send_validation_result(self, validation, validation_step):
        await self.send(text_data=json.dumps({
            'type': 'validation_result',
            'data': {
                'validation': validation,
                'validation_step': validation_step
            }
        }))

    @sync_to_async
    def process_frames(self, data):
        try:    
            frames = data['frames']
            validation_step = data['validation_step']
            batch_number = data['batch_number']
            gesture_recognize = data['gesture_recognize']
            logger.info(f"[Processing] Processing batch {batch_number} for step {validation_step}")

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
                                logger.warning("No pose landmarks detected")
                                return self.send_validation_result('not_validated', validation_step)

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
                                logger.warning(f"Unknown validation step: {validation_step}")

                            if is_valid:
                                true_counter += 1
                            else:
                                false_counter += 1

                            if true_counter >= 3:
                                return self.send_validation_result('validated', validation_step)
                            if false_counter >= 7:
                                return self.send_validation_result('not_validated', validation_step)

                    except Exception as e:
                        logger.error(f"Error processing frame: {str(e)}")
                        return self.send_error(f"Error processing frame: {str(e)}")

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
                                    return self.send_validation_result('validated', validation_step)
                                if false_counter >= 7:
                                    return self.send_validation_result('not_validated', validation_step)

                    except Exception as e:
                        logger.error(f"Error processing gesture frame: {str(e)}")
                        return self.send_error(f"Error processing gesture frame: {str(e)}")

        except Exception as e:
            logger.error(f"[Processing] Error processing frames: {str(e)}")
            return self.send_error(f"Error processing frames: {str(e)}")

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
            logger.error(f"Error in left hand validation: {str(e)}")
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
            logger.error(f"Error in right hand validation: {str(e)}")
            return False
    
        