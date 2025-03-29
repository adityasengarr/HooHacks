import os
import random
import uuid
from flask import Flask, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi
from googletrans import Translator
from gtts import gTTS

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = "static"  # Folder to store generated audio files

# Ensure the static folder exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

@app.route('/api/translate', methods=['POST'])
def translate_video():
    data = request.get_json()
    video_id = data.get('videoId')
    target_language = data.get('targetLanguage')
    if not video_id or not target_language:
        return jsonify({"message": "Missing videoId or targetLanguage"}), 400

    try:
        # Get English transcript from the video
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        # Pick a random subtitle segment
        segment = random.choice(transcript)
        text = segment['text']
        
        # Translate the segment
        translator = Translator()
        translation = translator.translate(text, dest=target_language)
        translated_text = translation.text
        
        # Convert translated text to speech
        tts = gTTS(text=translated_text, lang=target_language)
        filename = f"translated_audio_{uuid.uuid4().hex}.mp3"
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        tts.save(file_path)
        
        # Build the URL to the audio file (Flask will serve files from /static)
        audio_url = f"/static/{filename}"
        return jsonify({"message": f"Translated: {translated_text}", "audioUrl": audio_url})
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)