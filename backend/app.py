from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
import os

from backend.config import Config
from backend.database import init_db
from backend.routes.auth_routes import auth_bp
from backend.routes.restaurant_routes import restaurant_bp
from backend.routes.user_routes import user_bp
from backend.routes.admin_routes import admin_bp
from backend.routes.ai_routes import ai_bp

def create_app():
    # Configure template and static folders
    # templates are in frontend/ (as per user request structure)
    # static is in backend/static/
    app = Flask(__name__, 
                template_folder=os.path.abspath('frontend'),
                static_folder=os.path.abspath('backend/static'))
    
    app.config.from_object(Config)
    
    # Initialize Extensions
    init_db(app)
    CORS(app)
    
    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(restaurant_bp, url_prefix='/api/restaurants')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    # Page Routes
    @app.route('/')
    def index():
        return render_template('index.html')
        
    @app.route('/login')
    def login_page():
        return render_template('login.html')
        
    @app.route('/register')
    def register_page():
        return render_template('register.html')
        
    @app.route('/restaurants')
    def restaurants_page():
        return render_template('restaurants.html')
        
    @app.route('/menu/<int:restaurant_id>')
    def menu_page(restaurant_id):
        return render_template('menu.html', restaurant_id=restaurant_id)
        
    @app.route('/cart')
    def cart_page():
        return render_template('cart.html')
        
    @app.route('/checkout')
    def checkout_page():
        return render_template('checkout.html')
        
    @app.route('/profile')
    def profile_page():
        return render_template('profile.html')
        
    @app.route('/orders')
    def orders_page():
        return render_template('orders.html')
        
    @app.route('/admin')
    def admin_page():
        return render_template('admin.html')

    return app

if __name__ == '__main__':
    app = create_app()
    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=5000)