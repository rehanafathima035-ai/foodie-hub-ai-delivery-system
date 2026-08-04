from flask import Blueprint, jsonify, request
from backend.models.models import Restaurant, FoodItem, Category

restaurant_bp = Blueprint('restaurant', __name__)

@restaurant_bp.route('/', methods=['GET'])
def get_restaurants():
    query = Restaurant.query
    # Optional filtering
    cuisine = request.args.get('cuisine')
    if cuisine:
        query = query.filter(Restaurant.cuisine.like(f'%{cuisine}%'))
        
    restaurants = query.all()
    return jsonify([{
        "id": r.id,
        "name": r.restaurant_name,
        "image": r.image,
        "cuisine": r.cuisine,
        "rating": r.rating,
        "delivery_time": r.delivery_time,
        "location": r.location
    } for r in restaurants]), 200

@restaurant_bp.route('/<int:restaurant_id>', methods=['GET'])
def get_restaurant_details(restaurant_id):
    restaurant = Restaurant.query.get_or_404(restaurant_id)
    food_items = FoodItem.query.filter_by(restaurant_id=restaurant_id).all()
    
    return jsonify({
        "id": restaurant.id,
        "name": restaurant.restaurant_name,
        "image": restaurant.image,
        "cuisine": restaurant.cuisine,
        "rating": restaurant.rating,
        "menu": [{
            "id": f.id,
            "name": f.food_name,
            "description": f.description,
            "price": f.price,
            "image": f.image,
            "rating": f.rating
        } for f in food_items]
    }), 200

@restaurant_bp.route('/categories')
def get_categories():
    categories = Category.query.all()

    return jsonify([
        {
            "id": c.id,
            "name": c.category_name,
            "image": c.image
        }
        for c in categories
    ])
    
@restaurant_bp.route('/search', methods=['GET'])
def search():
    q = request.args.get('q', '')
    restaurants = Restaurant.query.filter(Restaurant.restaurant_name.like(f'%{q}%')).all()
    foods = FoodItem.query.filter(FoodItem.food_name.like(f'%{q}%')).all()
    
    return jsonify({
        "restaurants": [{"id": r.id, "name": r.restaurant_name} for r in restaurants],
        "foods": [{"id": f.id, "name": f.food_name, "restaurant_id": f.restaurant_id} for f in foods]
    }), 200
