# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import bcrypt
import jwt
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = '12345'
CORS(app)

# Connect to MongoDB
try:
    client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=3000)
    client.server_info()  # Gọi thử để xác nhận kết nối
    print("✅ MongoDB connected successfully!")
except Exception as e:
    print("❌ Failed to connect to MongoDB:", e)
db = client['booking_db']
users_collection = db['users']
rooms_collection = db['rooms']
bookings_collection = db['bookings']

# Helper decorator to verify JWT token
def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# -------- User Registration and Authentication --------

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if users_collection.find_one({'username': username}):
        return jsonify({'message': 'Username already exists'}), 400
    # Hash the password and decode it to a string
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user = {
        'username': username,
        'password': hashed_password,
        'role': 'user'
    }
    result = users_collection.insert_one(user)
    user['_id'] = str(result.inserted_id)
    user.pop('password', None)  # Remove password from response
    return jsonify({'message': 'User registered successfully', 'user': user}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = users_collection.find_one({'username': username})
    # Re-encode stored hashed password since it is stored as a string
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        token = jwt.encode(
            {'user_id': str(user['_id']), 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        return jsonify({'token': token, 'user': {'username': user['username'], 'role': user.get('role', 'user')}})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
@token_required
def logout(current_user):
    # In JWT-based systems, logout is typically handled client-side by removing the token.
    # This endpoint simply returns a success message.
    return jsonify({'message': 'Logged out successfully'})

# -------- Booking Endpoints --------

# Book a room (creates a pending booking request)
@app.route('/book', methods=['POST'])
@token_required
def book_room(current_user):
    data = request.get_json()
    room_id = data.get('room_id')
    arrival_time = data.get('arrival_time')
    end_time = data.get('end_time')
    number_of_people = data.get('number_of_people')
    user_id = str(current_user['_id'])

    # Kiểm tra trùng giờ
    existing_bookings = bookings_collection.find({
        'room_id': room_id,
        '$or': [
            {'arrival_time': {'$lt': end_time, '$gte': arrival_time}},  # Check if the booking overlaps with the new booking arrival time
            {'end_time': {'$gt': arrival_time, '$lte': end_time}},      # Check if the booking overlaps with the new booking end time
            {'arrival_time': {'$lte': arrival_time}, 'end_time': {'$gte': end_time}}  # Check if the new booking fully overlaps with an existing one
        ]
    })

    # Thay thế `count()` bằng `len()`
    if len(list(existing_bookings)) > 0:
        return jsonify({'message': 'Đã có người đặt phòng này vào giờ này rồi'  }), 400

    # Nếu không có xung đột, tiếp tục đặt phòng
    booking = {
        'room_id': room_id,
        'user_id': user_id,
        'arrival_time': arrival_time,
        'end_time': end_time,
        'number_of_people': number_of_people,
        'booking_date': datetime.datetime.utcnow(),
        'status': 'pending'
    }

    # 🧾 In thông tin ra console để debug
    print("📥 Booking data to insert:")
    for k, v in booking.items():
        print(f"  {k}: {v}")

    result = bookings_collection.insert_one(booking)

    print(f"✅ Inserted booking with ID: {result.inserted_id}")

    return jsonify({'message': 'Booking request submitted. Await admin approval.'})


@app.route('/rooms', methods=['GET'])
def get_rooms():
    rooms = list(rooms_collection.find())
    for room in rooms:
        room['_id'] = str(room['_id'])
    return jsonify(rooms)

@app.route('/user/bookings', methods=['GET'])
@token_required
def user_bookings(current_user):
    user_id = str(current_user['_id'])
    bookings = list(bookings_collection.find({'user_id': user_id}))
    for booking in bookings:
        booking['_id'] = str(booking['_id'])
    return jsonify(bookings)

# -------- Admin Endpoints --------

# Admin endpoint: Get all rooms with clear "in use" time details
@app.route('/admin/rooms', methods=['GET'])
@token_required
def admin_get_rooms(current_user):
    # Kiểm tra quyền của người dùng
    if current_user.get('role') != 'admin':
        print("Unauthorized access attempt")
        return jsonify({'message': 'Unauthorized'}), 403

    # Lấy danh sách phòng từ MongoDB
    rooms = list(rooms_collection.find())
    

    for room in rooms:
        room['_id'] = str(room['_id'])  # chuyển _id về string để không lỗi khi jsonify
        room_number = room.get('room_number')
        print(f"Processing room: {room_number}")

        # Nếu phòng đang được sử dụng, tìm booking đã được duyệt
        if room.get('status') == 'in use':
            print(f"Room {room_number} is in use, checking for accepted booking...")

            # Giả sử bên bookings lưu room_id là room_number (VD: "H1-101")
            accepted_booking = bookings_collection.find_one({'room_id': room_number, 'status': 'accepted'})
            if accepted_booking:
                accepted_booking['_id'] = str(accepted_booking['_id'])
                print(f"Accepted booking found: {accepted_booking}")
                room['in_use_time'] = {
                    'arrival_time': accepted_booking.get('arrival_time'),
                    'end_time': accepted_booking.get('end_time'),
                    'number_of_people': accepted_booking.get('number_of_people')
                }
                print(f"Room {room_number} in_use_time updated: {room['in_use_time']}")
            else:
                room['in_use_time'] = None
                print(f"No accepted booking found for room {room_number}, setting in_use_time to None")
        else:
            room['in_use_time'] = None
            print(f"Room {room_number} is not in use, setting in_use_time to None")

    print(f"Returning rooms data: {rooms}")
    return jsonify(rooms)



@app.route('/admin/rooms', methods=['POST'])
@token_required
def admin_add_room(current_user):
    if current_user.get('role') != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    data = request.get_json()
    room = {
        'picture': data.get('picture'),
        'status': data.get('status', 'empty'),  # status can be 'empty', 'in use', or 'bảo trì'
        'max_people': data.get('max_people'),
        'room_type': data.get('room_type'),
        'building': data.get('building'),
        'facility': data.get('facility'),
        'room_number': data.get('room_number')
    }
    result = rooms_collection.insert_one(room)
    room['_id'] = str(result.inserted_id)
    return jsonify(room), 201

@app.route('/admin/rooms/<room_id>', methods=['PUT'])
@token_required
def admin_update_room(current_user, room_id):
    if current_user.get('role') != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    data = request.get_json()
    update_data = {}
    if 'status' in data:
        update_data['status'] = data['status']
    if 'picture' in data:
        update_data['picture'] = data['picture']
    if 'max_people' in data:
        update_data['max_people'] = data['max_people']
    if 'room_type' in data:
        update_data['room_type'] = data['room_type']
    if 'building' in data:
        update_data['building'] = data['building']
    if 'facility' in data:
        update_data['facility'] = data['facility']
    if 'room_number' in data:
        update_data['room_number'] = data['room_number']
    rooms_collection.update_one({'_id': ObjectId(room_id)}, {'$set': update_data})
    return jsonify({'message': 'Room updated successfully'})

@app.route('/admin/rooms/<room_id>', methods=['DELETE'])
@token_required
def admin_delete_room(current_user, room_id):
    if current_user.get('role') != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    rooms_collection.delete_one({'_id': ObjectId(room_id)})
    return jsonify({'message': 'Room deleted successfully'})

@app.route('/admin/stats', methods=['GET'])
@token_required
def admin_stats(current_user):
    if current_user.get('role') != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    total_rooms = rooms_collection.count_documents({})
    in_use = rooms_collection.count_documents({'status': 'in use'})
    empty = rooms_collection.count_documents({'status': 'empty'})
    maintenance = rooms_collection.count_documents({'status': 'bảo trì'})
    stats = {
        'total_rooms': total_rooms,
        'in_use': in_use,
        'empty': empty,
        'maintenance': maintenance
    }
    return jsonify(stats)

# Admin endpoints for managing booking requests

@app.route('/admin/bookings', methods=['GET'])
@token_required
def admin_get_bookings(current_user):
    if current_user.get('role') != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    bookings = list(bookings_collection.find({'status': 'pending'}))
    for booking in bookings:
        booking['_id'] = str(booking['_id'])
    return jsonify(bookings)

@app.route('/admin/bookings/<booking_id>/approve', methods=['POST'])
@token_required
def admin_approve_booking(current_user, booking_id):
    # Chỉ cho phép admin
    
    if current_user.get('role') != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403

    # Tìm booking theo ID
    booking = bookings_collection.find_one({'_id': ObjectId(booking_id)})
    if not booking:
        return jsonify({'message': 'Booking not found'}), 404

    # Lấy room_id từ booking
    room_id = booking.get('room_id')

    # Lấy tất cả room_number trong rooms
    rooms = rooms_collection.find({}, {'room_number': 1})
    room_numbers = [room.get('room_number') for room in rooms]

    # Kiểm tra nếu room_id trùng với room_number
    if room_id not in room_numbers:
        return jsonify({'message': 'Invalid room_id (not found in room_number list)'}), 400

    # Cập nhật trạng thái booking
    bookings_collection.update_one(
        {'_id': ObjectId(booking_id)},
        {'$set': {'status': 'accepted'}}
    )

    # Cập nhật trạng thái phòng tương ứng
    rooms_collection.update_one(
        {'room_number': room_id},
        {'$set': {'status': 'in use'}}
    )

    return jsonify({'message': 'Booking approved'})


@app.route('/admin/bookings/<booking_id>/reject', methods=['POST'])
@token_required
def admin_reject_booking(current_user, booking_id):
    if current_user.get('role') != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
    booking = bookings_collection.find_one({'_id': ObjectId(booking_id)})
    if not booking:
        return jsonify({'message': 'Booking not found'}), 404
    bookings_collection.update_one({'_id': ObjectId(booking_id)}, {'$set': {'status': 'rejected'}})
    return jsonify({'message': 'Booking rejected'})
def create_default_admin():
    # Check if an admin account already exists
    admin_user = users_collection.find_one({"username": "admin"})
    if not admin_user:
        # Hash the default admin password and decode it to store as a string
        hashed_password = bcrypt.hashpw("admin".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin = {
            "username": "admin",
            "password": hashed_password,
            "role": "admin"
        }
        result = users_collection.insert_one(admin)
        print("Default admin created with username: 'admin' and password: 'admin'")
    else:
        print("Default admin already exists.")
if __name__ == '__main__':
    create_default_admin()

    app.run(debug=True)
