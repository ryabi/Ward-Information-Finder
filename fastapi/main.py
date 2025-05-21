from contextlib import asynccontextmanager
from fastapi import FastAPI,WebSocket,WebSocketException,
from pydantic import BaseModel
from .Validation import ConnectionManager
import base64
from PIL import Image
import io

import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

model={}

@asynccontextmanager
async def lifespan(app: FastAPI):
    
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
    
    
    pose_options = PoseLandmarkerOptions(
                    base_options=BaseOptions(model_asset_path='data/pose_landmarker_heavy.task'),
                    running_mode=VisionRunningMode.IMAGE,
                    min_pose_detection_confidence=0.55,
                    min_pose_presence_confidence=0.55,
                    output_segmentation_masks=False
                )

                # Initialize gesture recognizer options
    gesture_options = GestureRecognizerOptions(
                    base_options=gesture_BaseOptions(model_asset_path='data/gesture_recognizer.task'),
                    running_mode=gesture_VisionRunningMode.IMAGE,
                    min_hand_detection_confidence=0.55,
                    min_hand_presence_confidence=0.55,
                )

                # Create model instances
    model['pose_landmarker'] = PoseLandmarker.create_from_options(pose_options)
    model['gesture_recognizer'] = GestureRecognizer.create_from_options(gesture_options)
    yield
    model.clear()

app = FastAPI(lifespan=lifespan)




@app.websocket("ws/video/")
async def websocket_endpoint(websocket: WebSocket):  
    await websocket.accept()
    
    while True:
        data = await websocket.receive_json()
        print (data)
        await websocket.send_text(f"Message text was: {data}")

