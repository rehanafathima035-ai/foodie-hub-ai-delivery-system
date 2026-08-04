import os
from dotenv import load_dotenv
from datetime import timedelta
from urllib.parse import quote_plus
load_dotenv()

print("DB HOST:", os.environ.get("DB_HOST"))
print("DB USER:", os.environ.get("DB_USER"))
print("DB NAME:", os.environ.get("DB_NAME"))


class Config:
    # Basic Flask Config
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DEBUG = True
    
    # Database Config
    # If using local MySQL, replace with your credentials: mysql+pymysql://user:password@localhost/db_name
    DB_USER = os.environ.get('DB_USER')
    DB_PASSWORD = os.environ.get('DB_PASSWORD','') # Default usually empty for XAMPP/WAMP
    ENCODED_PASSWORD = quote_plus(str(DB_PASSWORD))

    DB_HOST = os.environ.get('DB_HOST')
    DB_NAME = os.environ.get('DB_NAME', 'food_delivery_db')
    
    DB_PORT = os.environ.get('DB_PORT', '4000')

    SQLALCHEMY_DATABASE_URI = (f"mysql+pymysql://{DB_USER}:{ENCODED_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}""?ssl_verify_cert=true")    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Session Config
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    # Uploads
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static/uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload
