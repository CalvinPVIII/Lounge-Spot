from flask import Flask, request, redirect, jsonify
from flask_socketio import join_room, leave_room, send, SocketIO
from flask_cors import CORS
import random
from string import ascii_uppercase
import uuid

app = Flask(__name__)
app.config["SECRET_KEY"] = "super secret key!!!"
CORS(app, origins="*")
socketio = SocketIO(app)

rooms = {}

def generate_unique_code(length):
    while True:
        code = ""
        for _ in range(length):
            code += random.choice(ascii_uppercase)
        
        if code not in rooms:
            break
    
    return code

@app.route("/")
def home():
    return jsonify({"message": "hello world"})


@app.route("/room/create", methods=["POST"])
def create_room():
    if(request.method == "POST"):
        room_code = generate_unique_code(4)
        rooms[room_code] = {"members": 0, "messages": []}
        print("room created: " + room_code)
        response = jsonify({"status": "success", "message": "Room created", "data": {"roomCode": room_code}})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

@app.route("/room/join", methods=["POST"])
def join_room():
    if(request.method == "POST"):
        data = request.json
        room_code = data['roomCode']
        user_name = data['userName']
        user_id = uuid.uuid4();
        if not room_code or room_code not in rooms:
            return jsonify({"status": "error", "message":"Room does not exist"})
        elif not user_name:
            return jsonify({"status": "error", "message":"Please enter a name"})
        print( user_name + " joined room: "  + room_code)
        response = jsonify({"status": "success", "message": "Room joined", "data": {"userId": user_id, "roomCode": room_code}})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response



if(__name__) == "__main__":
    socketio.run(app, debug=True)



