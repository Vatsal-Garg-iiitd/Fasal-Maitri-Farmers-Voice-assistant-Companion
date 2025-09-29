from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import whisper
from deep_translator import GoogleTranslator
from gtts import gTTS
import os
import google.generativeai as genai
import tempfile
import uuid
import logging
from datetime import datetime
import json

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)

# Configure Gemini AI
genai.configure(api_key=os.getenv('GEMINI_API_KEY', Gemini_api_key))

app = Flask(__name__)
CORS(app)

# Configuration
LANGUAGES = {
    'en': 'English',
    'hi': 'Hindi',
    'mr': 'Marathi',
    'pa': 'Punjabi',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'bn': 'Bengali',
    'ta': 'Tamil',
    'te': 'Telugu',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam'
}

# TTS Language mapping (some languages use different codes for TTS)
TTS_LANGUAGE_MAP = {
    'en': 'en',
    'hi': 'hi',
    'mr': 'mr',
    'pa': 'pa',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'it': 'it',
    'pt': 'pt',
    'ru': 'ru',
    'ja': 'ja',
    'ko': 'ko',
    'ar': 'ar',
    'zh': 'zh',
    'bn': 'bn',
    'ta': 'ta',
    'te': 'te',
    'gu': 'gu',
    'kn': 'kn',
    'ml': 'ml'
}

# Load Whisper model
print("Loading Whisper model...")
stt_model = whisper.load_model("base")  # Use "base" for faster processing, "medium" or "large" for better accuracy
print("Whisper model loaded successfully!")

# Initialize Gemini model
llm_model = genai.GenerativeModel('gemini-1.5-flash')

# Ensure directories exist
os.makedirs('uploads', exist_ok=True)
os.makedirs('responses', exist_ok=True)
os.makedirs('logs', exist_ok=True)

def get_llm_response(prompt_text, user_language='en'):
    """Generate agricultural advice using Gemini AI"""
    try:
        # Enhanced prompt for agricultural context
        agricultural_prompt = f"""
        You are an expert agricultural advisor and farming assistant with deep knowledge of:
        - Crop cultivation and management
        - Plant diseases and pest control
        - Soil health and fertilization
        - Weather patterns and farming
        - Irrigation and water management
        - Organic farming practices
        - Farm equipment and technology
        - Market prices and crop economics
        - Sustainable agriculture
        
        A farmer is asking: "{prompt_text}"
        
        Please provide:
        1. Direct, practical advice
        2. Step-by-step instructions if applicable
        3. Preventive measures
        4. Cost-effective solutions
        5. Seasonal considerations
        
        If the question is not related to agriculture, politely redirect them to ask about 
        farming, crops, plant diseases, agricultural practices, livestock, or rural development.
        
        Keep your response:
        - Helpful and actionable
        - Clear and easy to understand
        - Under 200 words for audio playback
        - Suitable for farmers of all experience levels
        
        Focus on practical solutions that farmers can implement immediately.
        """
        
        response = llm_model.generate_content(agricultural_prompt)
        return response.text
    except Exception as e:
        logging.error(f"LLM Error: {e}")
        return "Sorry, I couldn't generate an answer right now. Please try asking about farming practices, crop diseases, soil management, or agricultural techniques."

def process_audio_question(audio_data, target_lang_code):
    """Process audio through the complete pipeline"""
    try:
        # Create unique filenames
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        
        input_audio_path = os.path.join('uploads', f"input_{timestamp}_{unique_id}.wav")
        output_audio_path = os.path.join('responses', f"response_{timestamp}_{unique_id}.mp3")
        
        # Save uploaded audio
        with open(input_audio_path, 'wb') as f:
            f.write(audio_data)
        
        logging.info(f"Processing audio file: {input_audio_path}")

        # Transcribe audio to text using Whisper
        result = stt_model.transcribe(input_audio_path, task="transcribe")
        transcribed_text = result["text"].strip()
        detected_lang = result.get("language", "en")
        confidence = result.get("confidence", 0.8)
        
        logging.info(f"Transcribed: '{transcribed_text}' (Language: {detected_lang}, Confidence: {confidence})")
        
        # Clean up input audio file
        try:
            os.remove(input_audio_path)
        except:
            pass

        # Validate transcription
        if not transcribed_text or len(transcribed_text.strip()) < 3:
            return None, "Could not understand the audio. Please speak clearly and try again."
        
        # Get LLM response in English
        llm_answer_en = get_llm_response(transcribed_text, detected_lang)
        logging.info(f"LLM Response: {llm_answer_en[:100]}...")
        
        # Validate target language
        if target_lang_code not in LANGUAGES:
            target_lang_code = detected_lang if detected_lang in LANGUAGES else 'en'
        
        # Translate if necessary
        final_answer = llm_answer_en
        if target_lang_code != 'en':
            try:
                translator = GoogleTranslator(source="en", target=target_lang_code)
                final_answer = translator.translate(llm_answer_en)
                logging.info(f"Translated to {target_lang_code}: {final_answer[:100]}...")
            except Exception as e:
                logging.error(f"Translation error: {e}")
                final_answer = llm_answer_en
                target_lang_code = 'en'  # Fallback to English
        
        # Generate audio response using gTTS
        try:
            tts_lang = TTS_LANGUAGE_MAP.get(target_lang_code, 'en')
            tts = gTTS(text=final_answer, lang=tts_lang, slow=False)
            tts.save(output_audio_path)
            logging.info(f"Audio response saved: {output_audio_path}")
        except Exception as e:
            logging.error(f"TTS error: {e}")
            return None, f"Could not generate audio response: {str(e)}"
        
        # Return metadata along with file path
        metadata = {
            'transcribed_text': transcribed_text,
            'detected_language': detected_lang,
            'target_language': target_lang_code,
            'ai_response': llm_answer_en,
            'translated_response': final_answer,
            'confidence': confidence,
            'audio_file': output_audio_path
        }
        
        return output_audio_path, metadata
        
    except Exception as e:
        logging.error(f"Processing error: {e}")
        return None, f"Processing failed: {str(e)}"

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "message": "Voice Assistant API is running",
        "available_languages": list(LANGUAGES.keys()),
        "timestamp": datetime.now().isoformat()
    })

@app.route('/languages', methods=['GET'])
def get_languages():
    """Get available languages"""
    return jsonify({
        "languages": LANGUAGES,
        "tts_supported": list(TTS_LANGUAGE_MAP.keys())
    })

@app.route('/ask_audio', methods=['POST'])
def ask_audio():
    """Main endpoint for processing voice queries"""
    try:
        # Validate request
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        file = request.files['audio']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
            
        language = request.form.get('lang', 'en')
        
        # Validate language
        if language not in LANGUAGES:
            language = 'en'
            
        logging.info(f"Processing audio request in language: {language}")

        # Read audio data
        audio_data = file.read()
        if len(audio_data) == 0:
            return jsonify({"error": "Empty audio file"}), 400
        
        if len(audio_data) > 10 * 1024 * 1024:  # 10MB limit
            return jsonify({"error": "Audio file too large (max 10MB)"}), 400
            
        # Process audio
        response_audio_path, result = process_audio_question(audio_data, language)

        if response_audio_path and os.path.exists(response_audio_path):
            # Return audio file
            return send_file(
                response_audio_path, 
                mimetype="audio/mpeg", 
                as_attachment=False,
                download_name="response.mp3"
            )
        else:
            error_message = result if isinstance(result, str) else "Audio processing failed"
            return jsonify({"error": error_message}), 500
            
    except Exception as e:
        logging.error(f"Endpoint error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/ask_text', methods=['POST'])
def ask_text():
    """Text-based query endpoint (optional)"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400
            
        text = data['text']
        language = data.get('language', 'en')
        
        # Get AI response
        ai_response = get_llm_response(text, language)
        
        # Translate if needed
        if language != 'en':
            try:
                translator = GoogleTranslator(source="en", target=language)
                translated_response = translator.translate(ai_response)
            except:
                translated_response = ai_response
        else:
            translated_response = ai_response
            
        return jsonify({
            "original_text": text,
            "ai_response": ai_response,
            "translated_response": translated_response,
            "language": language
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/cleanup', methods=['POST'])
def cleanup_files():
    """Cleanup old audio files"""
    try:
        import time
        current_time = time.time()
        cleanup_count = 0
        
        # Clean files older than 1 hour
        for folder in ['uploads', 'responses']:
            if os.path.exists(folder):
                for filename in os.listdir(folder):
                    file_path = os.path.join(folder, filename)
                    if os.path.isfile(file_path):
                        file_age = current_time - os.path.getctime(file_path)
                        if file_age > 3600:  # 1 hour
                            os.remove(file_path)
                            cleanup_count += 1
                            
        return jsonify({
            "message": f"Cleaned up {cleanup_count} old files",
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("🚀 Starting Voice Assistant API...")
    print(f"📋 Available languages: {list(LANGUAGES.keys())}")
    print("🎤 Whisper model loaded for speech recognition")
    print("🤖 Gemini AI configured for agricultural advice")
    print("🔊 Google TTS ready for audio responses")
    print("="*50)
    
    # Run the Flask app
    app.run(
        debug=True, 
        host='0.0.0.0', 
        port=5000,
        threaded=True
    )
