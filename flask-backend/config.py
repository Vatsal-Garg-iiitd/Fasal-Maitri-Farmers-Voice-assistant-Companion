import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    MAX_AUDIO_SIZE = int(os.getenv('MAX_AUDIO_SIZE', 10485760))  # 10MB
    WHISPER_MODEL = os.getenv('WHISPER_MODEL', 'base')
    CLEANUP_INTERVAL = int(os.getenv('CLEANUP_INTERVAL', 3600))  # 1 hour
    
    # Flask settings
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
