from flask import Blueprint, jsonify
from backend.models.models import FoodItem

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/recommendations', methods=['GET'])
def get_recommendations():
    # Mock AI logic: pick highly rated foods
    recommendations = FoodItem.query.filter(FoodItem.rating >= 4.5).limit(4).all()
    return jsonify([{
        "id": f.id,
        "name": f.food_name,
        "price": f.price,
        "image": f.image,
        "restaurant": f.restaurant.restaurant_name
    } for f in recommendations]), 200
