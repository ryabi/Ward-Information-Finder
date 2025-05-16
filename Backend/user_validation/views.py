from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import os
from mediapipe import solutions
from mediapipe.framework.formats import landmark_pb2
import numpy as np

from rest_framework import status
from PIL import Image
import io
import base64
from .serializer import validationSerializer


model_path='./data/pose_landmarker_full.task'
gesture_model_path='./data/gesture_recognizer.task'

BaseOptions = mp.tasks.BaseOptions
PoseLandmarker = mp.tasks.vision.PoseLandmarker
PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
PoseLandmarkerResult = mp.tasks.vision.PoseLandmarkerResult
VisionRunningMode = mp.tasks.vision.RunningMode

options = PoseLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=model_path),
    running_mode=VisionRunningMode.IMAGE,
    min_pose_detection_confidence=0.55,
    min_pose_presence_confidence=0.55,
    output_segmentation_masks=False
)

#For gesture recognition model. Configuring Model

gesture_BaseOptions = mp.tasks.BaseOptions
GestureRecognizer = mp.tasks.vision.GestureRecognizer
GestureRecognizerOptions = mp.tasks.vision.GestureRecognizerOptions
gesture_VisionRunningMode = mp.tasks.vision.RunningMode

gesture_options = GestureRecognizerOptions(
    base_options=gesture_BaseOptions(model_asset_path=gesture_model_path),
    running_mode=gesture_VisionRunningMode.IMAGE,
    min_hand_detection_confidence=0.55,
    min_hand_presence_confidence=0.55,
    )

# Create your views here.

class pose_detection(APIView):
    serializer_class=validationSerializer
    count_req=0
    
    def post(self, request):
        self.count_req +=1
        serialized_data=self.serializer_class(data=request.data)
        # print(serialized_data.is_valid())
        if serialized_data.is_valid():
            frames=serialized_data.validated_data['frames']
            validation_step=serialized_data.validated_data['validation_step']
            gesture_recognize=serialized_data.validated_data['gesture_recognize']
            print(f"Received validation step: {validation_step}")
            if not gesture_recognize:
                true_counter=0
                false_counter=0
                with PoseLandmarker.create_from_options(options) as landmarker:
                    for frame in frames:
                        try:
                            if 'base64' in frame:
                                frame=frame.split('base64,')[1]
                                img_data = base64.b64decode(frame)
                                
                                pil_image = Image.open(io.BytesIO(img_data)).convert('RGB')
                                # pil_image.save(f'./data/test_cliend_sent_frame/my_image{self.count_frame+i}.png')
                                np_img = np.array(pil_image)
                                print(np_img.shape)
                                mp_image = mp.Image(
                                    image_format=mp.ImageFormat.SRGB, 
                                    data=np_img
                                    )
                                
                            
                                result = landmarker.detect(mp_image)
                                
                                if not result.pose_landmarks:
                                    print("No pose landmarks detected")
                                    return Response({'validation': 'not_validated'})

                                print(f"Processing {validation_step}")
                                
                                if validation_step == 'leftHand':
                                    left_valid = self.left_hand_validation(result)
                                    right_valid=self.right_hand_validation(result)
                                    is_valid =left_valid and not right_valid
                                    print(f"Left hand validation result: {is_valid}")
                                elif validation_step == 'rightHand':
                                    left_valid = self.left_hand_validation(result)
                                    right_valid=self.right_hand_validation(result)
                                    is_valid = right_valid and not left_valid
                                    
                                    print(f"Right hand validation result: {is_valid}")
                                elif validation_step == 'bothHands':
                                    left_valid = self.left_hand_validation(result)
                                    right_valid=self.right_hand_validation(result)
                                    is_valid= left_valid and right_valid
                                    
                                    print(f"Both hand validation result: {is_valid}")
                                else:
                                    is_valid = False
                                    print(f"Unknown validation step: {validation_step}")

                                if is_valid:
                                    true_counter+=1
                                else:
                                    false_counter+=1 
                                if true_counter >=3:
                                    return Response({'validation': 'validated'}) 
                                if false_counter>=7:
                                    return Response({'validation': 'not_validated'})         
                                
                        except Exception as e :
                            print(f"Error converting base64 to numpy: {e}")
                            return Response({
                                'message':'Error converting base64'
                    
                            })  
            elif gesture_recognize:      
                true_counter=0
                false_counter=0      
                with GestureRecognizer.create_from_options(gesture_options) as gesture_recognizer:
                    for frame in frames:
                        try:
                            if 'base64' in frame:
                                frame=frame.split('base64,')[1]
                                img_data = base64.b64decode(frame)
                                
                                pil_image = Image.open(io.BytesIO(img_data)).convert('RGB')
                                # pil_image.save(f'./data/test_cliend_sent_frame/my_image{self.count_frame+i}.png')
                                np_img = np.array(pil_image)
                                print(np_img.shape)
                                mp_image = mp.Image(
                                    image_format=mp.ImageFormat.SRGB, 
                                    data=np_img
                                    )
                                
                                gesture_result=gesture_recognizer.recognize(mp_image)
                                
                                if validation_step=="Closed_Fist" and gesture_result.gestures[0][0].category_name== validation_step :
                                    true_counter+=1
                                    
                                elif validation_step=='Open_Palm' and gesture_result.gestures[0][0].category_name== validation_step :
                                    true_counter+=1
                                    
                                elif validation_step=='Thumb_Down' and gesture_result.gestures[0][0].category_name== validation_step :
                                    true_counter+=1
                                    # return Response({'validation': 'validated'})
                                elif validation_step=='Thumb_Up' and gesture_result.gestures[0][0].category_name== validation_step :
                                    true_counter+=1
                                   
                                else:
                                    false_counter +=1
                                    
                                if true_counter >=3:
                                    return Response({'validation': 'validated'}) 
                                if false_counter>=7:
                                    return Response({'validation': 'not_validated'})
                                
                        except Exception as e :
                            print(f"Error converting base64 to numpy: {e}")
                            return Response({
                                'message':'Error converting base64'
                    
                            })         
                
                
        else:
            return Response(serialized_data.errors,status=status.HTTP_400_BAD_REQUEST)
        
        
        
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
            # print(f"Left hand landmarks: Y13={pose_landmarks_list[0][13].y}, Y19={pose_landmarks_list[0][19].y}, Y15={pose_landmarks_list[0][15].y}")
            # print(f"Visibility: {pose_landmarks_list[0][13].visibility}, Presence: {pose_landmarks_list[0][13].presence}")
            return leftRaise
        except Exception as e:
            print(f"Error in left hand validation: {str(e)}")
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
            # print(f"Right hand landmarks: Y14={pose_landmarks_list[0][14].y}, Y20={pose_landmarks_list[0][20].y}, Y16={pose_landmarks_list[0][16].y}")
            # print(f"Visibility: {pose_landmarks_list[0][14].visibility}, Presence: {pose_landmarks_list[0][14].presence}")
            return rightRaise
        except Exception as e:
            print(f"Error in right hand validation: {str(e)}")
            return False
    