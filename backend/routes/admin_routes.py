from flask import Blueprint, jsonify
from backend.models.models import Order, User, Restaurant, FoodItem
from backend.database import db
from sqlalchemy import func

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    total_orders = Order.query.count()
    total_users = User.query.count()
    revenue = db.session.query(func.sum(Order.total_amount)).scalar() or 0
    recent_orders = Order.query.order_by(Order.order_date.desc()).limit(5).all()
    
    return jsonify({
        "total_orders": total_orders,
        "total_users": total_users,
        "revenue": round(float(revenue), 2),
        "recent_orders": [{
            "id": o.id,
            "total": o.total_amount,
            "status": o.order_status
        } for o in recent_orders]
    }), 200

# Mock AI Recommendations
ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    # Mock AI logic: pick 4 random high-rated foods
    recommendations = FoodItem.query.filter(FoodItem.rating >= 4.5).limit(4).all()
    return jsonify([{
        "id": f.id,
        "name": f.food_name,
        "price": f.price,
        "image": f.image,
        "restaurant": f.restaurant.restaurant_name
    } for f in recommendations]), 200
