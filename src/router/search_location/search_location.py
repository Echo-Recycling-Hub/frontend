from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS

import requests
import json
import pandas as pd

app = Flask(__name__)
api = Api(app)
CORS(app)
app.debug = True

# API Key
access_key = 'BjziMs2j8QwD1JAtzP7oQ5KCJmP/xDfhiJ2fn7Zev9geBe37W238GnmAyuSM6YTFbTFuyUEAveKWYItWTmKvWQ=='
# access_key = 'BjziMs2j8QwD1JAtzP7oQ5KCJmP%2FxDfhiJ2fn7Zev9geBe37W238GnmAyuSM6YTFbTFuyUEAveKWYItWTmKvWQ%3D%3D'

@app.route('/location', methods=['GET', 'POST'])
def receive_location():
    if request.method == 'GET':
        return jsonify({'message': 'GET 요청을 성공적으로 처리했습니다.'}), 200
    elif request.method == 'POST':
        data = request.get_json()
        current_latitude = data['currentLatitude']
        current_longitude = data['currentLongitude']
        clicked_latitude = data['clickedLatitude']
        clicked_longitude = data['clickedLongitude']

        # API 호출을 위한 부분
        response = get_request_url(current_latitude, current_longitude, clicked_latitude, clicked_longitude)

        return jsonify(
            {
                'message': f'Received current latitude: {current_latitude}, current longitude: {current_longitude}, clicked latitude: {clicked_latitude}, clicked longitude: {clicked_longitude}',
                'busRouteInfo': response}), 200
    else:
        return jsonify({'error': 'Method Not Allowed'}), 405

def get_request_url(current_latitude, current_longitude, clicked_latitude, clicked_longitude):
    url = "http://ws.bus.go.kr/api/rest/pathinfo/getPathInfoByBus"
    params = {
        'serviceKey': access_key,
        'resultType': 'json',
        'startX': current_longitude,
        'startY': current_latitude,
        'endX': clicked_longitude,
        'endY': clicked_latitude
    }
    response = requests.get(url, params=params)
    print("Raw API Response:", response.text)  # 원본 응답 로깅
    return response.text


if __name__ == '__main__':
    app.run(host='localhost')
    # app.run(debug=True)