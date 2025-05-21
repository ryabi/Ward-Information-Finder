from fastapi import WebSocket
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

class ConnectionManager:
    async def connect(self, websocket: WebSocket):
        try :
            await websocket.accept()
        except Exception as e:
             pass

    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        await websocket.close()
        
    