from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_session import Session

db = SQLAlchemy()
bcrypt = Bcrypt()
sess = Session()

def init_db(app):
    db.init_app(app)
    bcrypt.init_app(app)
    sess.init_app(app)
    
    with app.app_context():
        # This will create tables based on models if they don't exist
        # Requires the database to exist already
        try:
            db.create_all()
            print("Database tables initialized successfully.")
        except Exception as e:
            print(f"Error initializing database: {e}")
            print("Ensure your MySQL server is running and the database 'food_delivery_db' exists.")
