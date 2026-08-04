CREATE DATABASE IF NOT EXISTS food_delivery_db;
USE food_delivery_db;

-- 1. Users Table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Restaurants Table
CREATE TABLE Restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_name VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    cuisine VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 0.0,
    delivery_time VARCHAR(20),
    location VARCHAR(255)
);

-- 3. Categories Table
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

-- 4. Food_Items Table
CREATE TABLE Food_Items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT,
    category_id INT,
    food_name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
);

-- 5. Cart Table
CREATE TABLE Cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    food_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES Food_Items(id) ON DELETE CASCADE
);

-- 6. Orders Table
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    delivery_address TEXT,
    order_status ENUM('Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Placed',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 7. Order_Items Table
CREATE TABLE Order_Items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    food_id INT,
    quantity INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES Food_Items(id) ON DELETE CASCADE
);

-- 8. Reviews Table
CREATE TABLE Reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    restaurant_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id) ON DELETE CASCADE
);

-- 9. Favorites Table
CREATE TABLE Favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    restaurant_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id) ON DELETE CASCADE
);

-- 10. Coupons Table
CREATE TABLE Coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_code VARCHAR(20) UNIQUE NOT NULL,
    discount_percentage INT NOT NULL
);

-- 11. Payments Table
CREATE TABLE Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    payment_type VARCHAR(50),
    payment_status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE
);

-- Seed Data
INSERT INTO Categories (category_name) VALUES ('Pizza'), ('Burgers'), ('Sushi'), ('Indian'), ('Desserts'), ('Drinks');

INSERT INTO Restaurants (restaurant_name, image, cuisine, rating, delivery_time, location) VALUES 
('The Pizza Palace', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', 'Italian, Pizza', 4.5, '25-30 min', 'Downtown'),
('Burger Kingly', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500', 'American, Burgers', 4.2, '15-20 min', 'Midtown'),
('Sushi Zen', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500', 'Japanese, Sushi', 4.8, '35-40 min', 'Uptown'),
('Spice Route', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500', 'Indian, Curry', 4.6, '30-35 min', 'Main St');

INSERT INTO Food_Items (restaurant_id, category_id, food_name, description, image, price, rating) VALUES 
(1, 1, 'Margherita Pizza', 'Classic tomato, mozzarella, and basil', 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500', 12.99, 4.7),
(1, 1, 'Pepperoni Feast', 'Double pepperoni with extra cheese', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500', 14.99, 4.8),
(2, 2, 'Classic Cheeseburger', 'Juicy beef patty with sharp cheddar', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', 9.99, 4.3),
(4, 4, 'Butter Chicken', 'Creamy tomato-based curry with tender chicken', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500', 15.50, 4.9);
