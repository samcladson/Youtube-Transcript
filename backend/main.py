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
        with open(os.path.join('transcripts.json'),'w') as json_file:
            json.dump(transcriptData,json_file)
        return jsonify({"status":200,'text':'Video transcripted successfully'})
    except:
        with open(os.path.join('transcripts.json'),'w') as json_file:
            json.dump({'text':'video has no subtitle'},json_file)
        return jsonify({"status":404,'text':'video has no subtitle'});

@app.route('/api/cclist/<start_time>',methods=["GET"])
def main(start_time):
    try:
        with open(os.path.join('transcripts.json')) as json_file:
            json_data = json.load(json_file)
            data = min(json_data,key=lambda x:abs(x["start"]-float(start_time)))
        return jsonify(data) if data else jsonify({'status':200,'start':start_time,'text':'No transcript found'})
    except:
        return jsonify({'status':404,'start':start_time,'text':'This video has no subtitles'})

@app.route('/api/postcclist',methods=['POST'])
def postData():
    data = jsonify(request.get_json())
    return data

@app.route('/api',methods=['GET'])
def welcome():
    return jsonify({'message':'welcome to flask application'})

if __name__ == "__main__":
    app.run()
    
