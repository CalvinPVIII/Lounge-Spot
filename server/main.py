from flask import Flask, request, redirect, jsonify
from flask_socketio import join_room, leave_room, send, SocketIO
from flask_cors import CORS
import random
from string import ascii_uppercase
import uuid
import time

app = Flask(__name__)
app.config["SECRET_KEY"] = "super secret key!!!"
CORS(app, origins="*")
socketio = SocketIO(app, cors_allowed_origins="*")

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
        rooms[room_code] = {"members": {}, "messages": []}
        print("room created: " + room_code)
        response = jsonify({"status": "success", "message": "Room created", "data": {"roomCode": room_code}})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

@app.route("/room/join", methods=["POST"])
def connect_to_room():
    if(request.method == "POST"):
        data = request.json
        room_code = data['roomCode']
        user_name = data['userName']
        user_id = uuid.uuid4();
        if not room_code or room_code not in rooms:
            return jsonify({"status": "error", "message":"Room does not exist"})
        elif not user_name:
            return jsonify({"status": "error", "message":"Please enter a name"})
        response = jsonify({"status": "success", "message": "Room joined", "data": {"userId": user_id, "roomCode": room_code}})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response



@socketio.on("connect")
def connect(auth):
    print("attempting to connect")
    room = request.headers.get("Room-Code").upper()
    user_id = request.headers.get("User-Id")
    user_name = request.headers.get("User-Name")

    print("name: " + user_name + " room: " + room + " id: " + user_id)
    print(rooms)

    if not room or not user_id or not user_name:
        print("no room id or name")
        return
    
    if room not in rooms:
        print("room not in rooms")
        leave_room(room)
        return
    
    join_room(room)
    rooms[room]["members"][user_id] = {"userId": user_id, "name": user_name}
    rooms[room]["messages"].append({"user": {"id": "system"}, "message": f"{user_name} joined room {room}", "timestamp": time.time() })
    socketio.emit("establishConnection", rooms[room])
    print(f"{user_name} joined room {room}")

@socketio.on("sendMessage")
def receive_message(data):
    print(data)
    room = request.headers.get("Room-Code").upper()
    user = data['user']
    message = data['message']
    
    if not message or not user or not room:
        return
    
    rooms[room]["messages"].append({"user": user, "message": message, "timestamp": time.time()})
    socketio.emit("receiveMessage", rooms[room]["messages"])




if(__name__) == "__main__":
    socketio.run(app, debug=True)



