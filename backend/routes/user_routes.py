from flask import Blueprint, jsonify, request, session
from backend.models.models import User, Cart, Order, OrderItem, FoodItem
from backend.database import db

user_bp = Blueprint('user', __name__)

@user_bp.route('/cart', methods=['GET'])
def get_cart():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401
        
    cart_items = db.session.query(Cart, FoodItem).join(FoodItem, Cart.food_id == FoodItem.id).filter(Cart.user_id == user_id).all()
    
    result = []
    for item, food in cart_items:
        result.append({
            "cart_id": item.id,
            "food_id": food.id,
            "name": food.food_name,
            "price": food.price,
            "quantity": item.quantity,
            "image": food.image
        })
    return jsonify(result), 200

@user_bp.route('/cart/add', methods=['POST'])
def add_to_cart():
    user_id = session.get('user_id')
    if not user_id: return jsonify({"message": "Unauthorized"}), 401
    
    data = request.get_json()
    food_id = data.get('food_id')
    
    existing = Cart.query.filter_by(user_id=user_id, food_id=food_id).first()
    if existing:
        existing.quantity += 1
    else:
        new_item = Cart(user_id=user_id, food_id=food_id, quantity=1)
        db.session.add(new_item)
    
    db.session.commit()
    return jsonify({"message": "Added to cart"}), 200

@user_bp.route('/cart/update', methods=['POST'])
def update_cart():
    user_id = session.get('user_id')
    if not user_id: return jsonify({"message": "Unauthorized"}), 401
    
    data = request.get_json()
    cart_id = data.get('cart_id')
    action = data.get('action') # 'increase', 'decrease', 'remove'
    
    item = Cart.query.filter_by(id=cart_id, user_id=user_id).first()
    if not item: return jsonify({"message": "Item not found"}), 404
    
    if action == 'increase':
        item.quantity += 1
    elif action == 'decrease':
        if item.quantity > 1:
            item.quantity -= 1
        else:
            db.session.delete(item)
    elif action == 'remove':
        db.session.delete(item)
        
    db.session.commit()
    return jsonify({"message": "Cart updated"}), 200

@user_bp.route('/checkout', methods=['POST'])
def checkout():
    user_id = session.get('user_id')
    if not user_id: return jsonify({"message": "Unauthorized"}), 401
    
    data = request.get_json()
    cart_items = db.session.query(Cart, FoodItem).join(FoodItem, Cart.food_id == FoodItem.id).filter(Cart.user_id == user_id).all()
    
    if not cart_items:
        return jsonify({"message": "Cart is empty"}), 400
        
    total = sum(food.price * item.quantity for item, food in cart_items)
    
    new_order = Order(
        user_id=user_id,
        total_amount=total,
        payment_method=data.get('payment_method'),
        delivery_address=data.get('address'),
        order_status='Placed'
    )
    db.session.add(new_order)
    db.session.flush() # Get order ID
    
    for item, food in cart_items:
        order_item = OrderItem(
            order_id=new_order.id,
            food_id=food.id,
            quantity=item.quantity,
            subtotal=food.price * item.quantity
        )
        db.session.add(order_item)
        db.session.delete(item) # Clear cart
        
    db.session.commit()
    return jsonify({"message": "Order placed successfully", "order_id": new_order.id}), 201

@user_bp.route('/orders', methods=['GET'])
def get_orders():
    user_id = session.get('user_id')
    if not user_id: return jsonify({"message": "Unauthorized"}), 401
    
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.order_date.desc()).all()
    return jsonify([{
        "id": o.id,
        "total": o.total_amount,
        "status": o.order_status,
        "date": o.order_date.strftime('%Y-%m-%d %H:%M')
    } for o in orders]), 200
