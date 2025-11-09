from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

db = SQLAlchemy()


# 🧍 User table
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    tokens = db.Column(db.Integer, default=1)  # how many tokens available
    last_token_date = db.Column(
        db.Date, default=date.today
    )  # when last token was given
    claims_today = db.Column(db.Integer, default=0)  # track how many claims today
    claims = db.relationship("Claim", back_populates="user")


# 🍽️ Restaurant table
class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    address = db.Column(db.String(200))
    food_items = db.relationship("FoodItem", back_populates="restaurant")


# 🍱 Food Item table
class FoodItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    tokens_left = db.Column(db.Integer, default=0)
    price = db.Column(db.Float, default=0.0)
    posted_at = db.Column(db.DateTime, default=datetime.utcnow)
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurant.id"))
    restaurant = db.relationship("Restaurant", back_populates="food_items")
    claims = db.relationship("Claim", back_populates="food_item")


# 🎟️ Claim table
class Claim(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    food_id = db.Column(db.Integer, db.ForeignKey("food_item.id"))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship("User", back_populates="claims")
    food_item = db.relationship("FoodItem", back_populates="claims")
