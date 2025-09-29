import whisper
import os
from gtts import gTTS
import tempfile
import uuid

class AudioProcessor:
    def __init__(self, model_size="base"):
        self.stt_model = whisper.load_model(model_size)
    
    def transcribe_audio(self, audio_path):
        """Transcribe audio file to text"""
        result = self.stt_model.transcribe(audio_path, task="transcribe")
        return result
    
    def generate_speech(self, text, language="en", output_path=None):
        """Generate speech from text"""
        if not output_path:
            output_path = os.path.join(tempfile.gettempdir(), f"speech_{uuid.uuid4()}.mp3")
        
        tts = gTTS(text=text, lang=language, slow=False)
        tts.save(output_path)
        return output_path
