from flask import Flask, jsonify,request
from flask_cors import CORS, cross_origin
from youtube_transcript_api import YouTubeTranscriptApi as transcript
import math
import json
import os

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route('/api/transcript/<videoId>',methods=['GET'])
def transcriptFunction(videoId):
    try:
        transcriptData=transcript.get_transcript(videoId)
        with open(os.path.join('backend/transcripts.json'),'w') as json_file:
            json.dump(transcriptData,json_file)
        return jsonify({'message':'Video transcripted successfully'})
    except:
        with open(os.path.join('backend/transcripts.json'),'w') as json_file:
            json.dump({'message':'video has no subtitle'},json_file)
        return jsonify({'message':'video has no subtitle'});

@app.route('/api/cclist/<start_time>',methods=["GET"])
def main(start_time):
    try:
        with open(os.path.join('backend/transcripts.json')) as json_file:
            json_data = json.load(json_file)

        
        start_time_c = math.ceil(float(start_time))

        start_time_f = math.floor(float(start_time))

        data = list(filter(lambda x: math.ceil(x['start'])==start_time_c or math.floor(x['start'])==start_time_f ,json_data))
        return jsonify(data[0]) if data else jsonify({'start':start_time,'text':'No transcript found'})
    except:
        return jsonify({'start':start_time,'text':'This video has no subtitles'})

@app.route('/api/postcclist',methods=['POST'])
def postData():
    data = jsonify(request.get_json())
    return data

if __name__ == "__main__":
    app.run()
