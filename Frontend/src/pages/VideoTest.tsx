import React, { useRef, useState, useEffect } from 'react';
import { Camera, StopCircle, Play, X, Loader } from 'lucide-react';

type ValidationStep = 'initial' | 'ready' | 'leftHand' | 'rightHand' | 'bothHands' | 'completed' | 
  'Closed_Fist' | 'Open_Palm' | 'Thumb_Down' | 'Thumb_Up';

type GestureType = 'Closed_Fist' | 'Open_Palm' | 'Thumb_Down' | 'Thumb_Up';
const GESTURES: GestureType[] = ['Closed_Fist', 'Open_Palm', 'Thumb_Down', 'Thumb_Up'];

type ConfirmationState = 'none' | 'waitingToStart' | 'waitingToComplete';

interface FrameBatch {
  frames: string[];
  timestamp: number;
  batch_number: number;
}

const VideoTest: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameIntervalRef = useRef<number | null>(null);
  const sendIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const batchNumberRef = useRef<number>(0);
  const currentStepRef = useRef<ValidationStep>('initial');
  const frameBufferRef = useRef<string[]>([]);
  
  const [currentStep, setCurrentStep] = useState<ValidationStep>('initial');
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>('none');
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [promptMessage, setPromptMessage] = useState<string>('');
  const [showNextButton, setShowNextButton] = useState<boolean>(false);

  // Constants for timing
  const READY_DELAY = 3000; // 3 seconds get ready time
  const MAX_VALIDATION_TIME = 9000; // 9 seconds max validation time
  const FRAME_RATE = 24; // 24fps capture rate
  const FRAMES_TO_SEND = 10; // Send 10 frames per second
  const FRAME_INTERVAL = Math.floor(1000 / FRAME_RATE); // ~41.67ms between captures
  const SEND_INTERVAL = 1000; // Send batch every second

  // Keep currentStepRef in sync with currentStep state
  useEffect(() => {
    currentStepRef.current = currentStep;
    console.log('Current step changed to:', currentStep);
  }, [currentStep]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
    }
    setIsCapturing(false);
    setIsCameraActive(false);
    setStatus('');
    startTimeRef.current = 0;
    batchNumberRef.current = 0;
    frameBufferRef.current = [];
  };

  const captureFrame = async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return null;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64 JPEG
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const selectFramesToSend = (frames: string[]): string[] => {
    if (frames.length <= FRAMES_TO_SEND) return frames;
    
    const result: string[] = [];
    // Calculate the step size to get evenly spaced frames
    const step = Math.floor(frames.length / FRAMES_TO_SEND);
    
    // Select evenly spaced frames
    for (let i = 0; i < FRAMES_TO_SEND && i * step < frames.length; i++) {
      result.push(frames[i * step]);
    }
    
    return result;
  };

  const resetValidationState = () => {
    setStatus('');
    setCountdown(null);
    setShowPrompt(false);
    setPromptMessage('');
    setShowNextButton(false);
    setRemainingTime(9);
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }
    frameBufferRef.current = [];
    batchNumberRef.current = 0;
    startTimeRef.current = 0;
  };

  const isHandRaiseStep = (step: ValidationStep): boolean => {
    return step === 'leftHand' || step === 'rightHand' || step === 'bothHands';
  };

  const isGestureStep = (step: ValidationStep): boolean => {
    return GESTURES.includes(step as GestureType);
  };

  const getNextGesture = (currentGesture: GestureType | null): GestureType | null => {
    if (!currentGesture) return GESTURES[0];
    const currentIndex = GESTURES.indexOf(currentGesture);
    return currentIndex < GESTURES.length - 1 ? GESTURES[currentIndex + 1] : null;
  };

  const sendFrameBatch = async (batch: FrameBatch) => {
    try {
      const selectedFrames = selectFramesToSend(batch.frames);
      
      const response = await fetch('/api/validate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frames: selectedFrames,
          validation_step: currentStepRef.current,
          timestamp: batch.timestamp,
          batch_number: batch.batch_number,
          gesture_recognize: isGestureStep(currentStepRef.current)
        }),
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      console.log('Received validation result:', result);
      
      if (result.validation === 'validated') {
        if (currentStepRef.current === 'leftHand') {
          stopCapturing();
          resetValidationState();
          setShowPrompt(true);
          setPromptMessage('Left hand validated successfully! Ready for right hand validation?');
          setShowNextButton(true);
        } else if (currentStepRef.current === 'rightHand') {
          stopCapturing();
          resetValidationState();
          setShowPrompt(true);
          setPromptMessage('Right hand validated successfully! Ready to validate both hands?');
          setShowNextButton(true);
        } else if (currentStepRef.current === 'bothHands') {
          stopCapturing();
          resetValidationState();
          setShowPrompt(true);
          setPromptMessage('Hand raise validation completed! Ready to start gesture validation?');
          setShowNextButton(true);
        } else if (isGestureStep(currentStepRef.current)) {
          stopCapturing();
          resetValidationState();
          const nextGesture = getNextGesture(currentStepRef.current as GestureType);
          if (nextGesture) {
            setShowPrompt(true);
            setPromptMessage(`${currentStepRef.current} gesture validated! Ready for next gesture?`);
            setShowNextButton(true);
          } else {
            setShowPrompt(true);
            setPromptMessage('All validations completed successfully!');
            setShowNextButton(true);
            setCurrentStep('completed');
          }
        }
      }
      
    } catch (err) {
      console.error('Failed to upload frame batch:', err);
      setStatus('Failed to upload frames');
    }
  };

  const startCamera = async () => {
    try {
      setError('');
      setIsLoading(true);
      setStatus('Initializing camera...');

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 24 }
        }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setStatus('Camera ready');
      setIsCameraActive(true);
      setCurrentStep('ready');

    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to access camera. Please ensure you have granted camera permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const startValidation = () => {
    if (!streamRef.current) {
      setError('Camera not initialized');
      return;
    }

    resetValidationState();
    setCurrentStep('leftHand');
    setStatus('Please raise your left hand');
    startCapturing();
  };

  const handleConfirm = () => {
    if (confirmationState === 'waitingToStart') {
      if (currentStep === 'leftHand') {
        setStatus('Starting left hand validation...');
        startCapturing();
      } else if (currentStep === 'rightHand') {
        setStatus('Starting right hand validation...');
        startCapturing();
      }
      setConfirmationState('none');
    } else if (confirmationState === 'waitingToComplete') {
      if (currentStep === 'leftHand') {
        setCurrentStep('rightHand');
        setStatus('Please raise your right hand when ready');
        setConfirmationState('waitingToStart');
      } else if (currentStep === 'rightHand') {
        setCurrentStep('bothHands');
        setStatus('Please raise both hands when ready');
        setConfirmationState('waitingToStart');
      } else if (currentStep === 'bothHands') {
        setCurrentStep('completed');
        setConfirmationState('none');
      }
    }
  };

  const startCapturing = () => {
    setIsCapturing(true);
    frameBufferRef.current = [];
    batchNumberRef.current = 0;
    
    setStatus('Get ready... Starting in 3 seconds');
    setCountdown(3); // Start 3 second countdown
    
    setTimeout(() => {
      startTimeRef.current = Date.now();
      setStatus('Capturing and validating...');
      setCountdown(null); // Clear countdown
      
      // Start frame capture interval
      frameIntervalRef.current = window.setInterval(async () => {
        const frame = await captureFrame();
        if (frame) {
          frameBufferRef.current.push(frame);
        }
      }, FRAME_INTERVAL);

      // Start send interval with precise timing
      let lastSendTime = Date.now();
      sendIntervalRef.current = window.setInterval(async () => {
        const currentTime = Date.now();
        const timeSinceLastSend = currentTime - lastSendTime;
        
        // Only send if at least 1 second has passed
        if (timeSinceLastSend >= SEND_INTERVAL) {
          const elapsedTime = currentTime - startTimeRef.current;
          
          if (elapsedTime >= MAX_VALIDATION_TIME) {
            stopCapturing();
            resetValidationState();
            setStatus('Validation timeout. Please try again.');
            setCurrentStep('ready');
            return;
          }

          if (frameBufferRef.current.length > 0) {
            batchNumberRef.current++;
            const batch: FrameBatch = {
              frames: frameBufferRef.current,
              timestamp: currentTime,
              batch_number: batchNumberRef.current
            };
            frameBufferRef.current = [];
            lastSendTime = currentTime;  // Update last send time
            await sendFrameBatch(batch);
          }
        }
      }, 100); // Check more frequently but only send every SEND_INTERVAL
    }, READY_DELAY);
  };

  const stopCapturing = () => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    if (sendIntervalRef.current) {
      clearInterval(sendIntervalRef.current);
      sendIntervalRef.current = null;
    }
    setIsCapturing(false);
  };

  const stopCamera = () => {
    cleanup();
    setCurrentStep('initial');
  };

  // Add countdown effect
  useEffect(() => {
    let timer: number;
    if (countdown !== null && countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [countdown]);

  // Add timer update effect
  useEffect(() => {
    let timerInterval: number;
    
    if (isCapturing && remainingTime > 0) {
      timerInterval = window.setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            stopCapturing();
            resetValidationState();
            setStatus('Validation timeout. Please try again.');
            setCurrentStep('ready');
            return 7;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isCapturing]);

  const handleNextStep = () => {
    if (currentStep === 'leftHand') {
      setShowPrompt(false);
      setShowNextButton(false);
      setCurrentStep('rightHand');
      setStatus('Please raise your right hand');
      startCapturing();
    } else if (currentStep === 'rightHand') {
      setShowPrompt(false);
      setShowNextButton(false);
      setCurrentStep('bothHands');
      setStatus('Please raise both hands');
      startCapturing();
    } else if (currentStep === 'bothHands') {
      setShowPrompt(false);
      setShowNextButton(false);
      setCurrentStep(GESTURES[0]);
      setStatus(`Please perform the ${GESTURES[0]} gesture`);
      startCapturing();
    } else if (isGestureStep(currentStep)) {
      const nextGesture = getNextGesture(currentStep as GestureType);
      if (nextGesture) {
        setShowPrompt(false);
        setShowNextButton(false);
        setCurrentStep(nextGesture);
        setStatus(`Please perform the ${nextGesture} gesture`);
        startCapturing();
      } else {
        setShowPrompt(false);
        setShowNextButton(false);
        setCurrentStep('completed');
      }
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'initial':
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Video Validation Test</h2>
            <p className="text-gray-600 mb-6">
              Please ensure you are in a well-lit environment and have enough space to move your arms.
              Face the camera directly and make sure your upper body is clearly visible.
            </p>
            <button
              onClick={startCamera}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Initializing...
                </span>
              ) : (
                "Start Validation"
              )}
            </button>
          </div>
        );

      case 'ready':
        return (
          <div className="text-center">
            <button
              onClick={startValidation}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Begin Validation
            </button>
          </div>
        );

      case 'leftHand':
      case 'rightHand':
      case 'bothHands':
        return (
          <div className="text-center p-4">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              {currentStep === 'leftHand' ? 'Raise Your Left Hand' : 
               currentStep === 'rightHand' ? 'Raise Your Right Hand' : 
               'Raise Both Hands'}
            </h3>
            <p className="text-gray-600">
              Keep your hand{currentStep === 'bothHands' ? 's' : ''} raised until validated
            </p>
          </div>
        );

      case 'Closed_Fist':
      case 'Open_Palm':
      case 'Thumb_Down':
      case 'Thumb_Up':
        return (
          <div className="text-center p-4">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              Perform the {currentStep.replace('_', ' ')} Gesture
            </h3>
            <p className="text-gray-600">
              Hold the gesture until validated
            </p>
          </div>
        );

      case 'completed':
        return (
          <div className="text-center p-4">
            <h3 className="text-xl font-semibold text-green-600 mb-4">
              All Validations Completed Successfully!
            </h3>
            <button
              onClick={() => {
                cleanup();
                setCurrentStep('initial');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Start New Validation
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
            
            {/* Camera controls overlay */}
            <div className="absolute inset-0">
              {/* Initial countdown timer */}
              {countdown !== null && countdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full w-24 h-24 flex items-center justify-center">
                    <span className="text-white text-5xl font-bold">
                      {countdown}
                    </span>
                  </div>
                </div>
              )}

              {/* Simple remaining time display */}
              {isCapturing && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white">
                  <span>{remainingTime}s remaining</span>
                </div>
              )}

              {/* Camera close button */}
              {isCameraActive && !isCapturing && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={stopCamera}
                    className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all"
                    title="Close Camera"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Recording indicator */}
              {isCapturing && (
                <div className="absolute top-4 left-4">
                  <div className="flex items-center space-x-2 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-white text-sm">Recording</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Validation Prompts */}
          {showPrompt && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p className="text-sm font-medium">{promptMessage}</p>
              {showNextButton && (
                <button
                  onClick={handleNextStep}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {currentStep === 'leftHand' ? 'Start Right Hand Validation' : 
                   currentStep === 'rightHand' ? 'Start Both Hands Validation' : 
                   'Continue to Next Page'}
                </button>
              )}
            </div>
          )}

          {status && !showPrompt && (
            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
              <p className="text-sm font-medium">{status}</p>
            </div>
          )}

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VideoTest; 