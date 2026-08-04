from flask import Blueprint, request, jsonify, session
from backend.models.models import User
from backend.database import db, bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"message": "Email already registered"}), 400
        
    hashed_password = bcrypt.generate_password_hash(data.get('password')).decode('utf-8')
    
    new_user = User(
        full_name=data.get('full_name'),
        email=data.get('email'),
        phone=data.get('phone'),
        password=hashed_password,
        address=data.get('address')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and bcrypt.check_password_hash(user.password, data.get('password')):
        session['user_id'] = user.id
        session['user_name'] = user.full_name
        return jsonify({
            "message": "Login successful",
            "user": {"id": user.id, "full_name": user.full_name, "email": user.email}
        }), 200
        
    return jsonify({"message": "Invalid credentials"}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

@auth_bp.route('/me', methods=['GET'])
def get_me():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        return jsonify({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email
        }), 200
    return jsonify({"message": "Not authenticated"}), 401
