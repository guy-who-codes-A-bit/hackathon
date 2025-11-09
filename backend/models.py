from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

db = SQLAlchemy()


# 🧍 User table
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    tokens = db.Column(db.Integer, default=1)
    last_token_date = db.Column(db.Date, default=date.today)
    claims_today = db.Column(db.Integer, default=0)
    claims = db.relationship("Claim", back_populates="user")


# 🍽️ Restaurant table (simplified)
class Restaurant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(200))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    food_type = db.Column(db.String(120), nullable=False)  # e.g. “Bakery”, “Fast Food”
    tokens_left = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    claims = db.relationship("Claim", back_populates="restaurant")


# 🎟️ Claim table (now linked directly to restaurant)
class Claim(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    restaurant_id = db.Column(db.Integer, db.ForeignKey("restaurant.id"))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    verified = db.Column(db.Boolean, default=False)
    user = db.relationship("User", back_populates="claims")
    restaurant = db.relationship("Restaurant", back_populates="claims")
