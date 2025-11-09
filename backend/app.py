from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
from models import db, User, Restaurant, FoodItem, Claim
from utils import send_mail, refresh_daily_tokens
import random, string

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///replate.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

verification_codes = {}


@app.route("/")
def home():
    return {"message": "RePlate backend is running ✅"}


# ---------------- AUTH ---------------- #


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name, email, password = data["name"], data["email"], data["password"]

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already registered"})

    new_user = User(name=name, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"success": True, "message": "Account created!"})


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email, password = data["email"], data["password"]
    user = User.query.filter_by(email=email).first()

    if not user or user.password != password:
        return jsonify({"success": False, "message": "Invalid credentials"})

    refresh_daily_tokens(user)

    return jsonify(
        {
            "success": True,
            "name": user.name,
            "tokens": user.tokens,
            "claims_today": user.claims_today,
        }
    )


# ---------------- PASSWORD RESET ---------------- #


@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email")

    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "message": "No account with that email"}), 404

    code = "".join(
        random.choice(string.ascii_uppercase + string.digits) for _ in range(3)
    )
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    verification_codes[email] = {"code": code, "expires_at": expires_at}

    subject = "Your RePlate password reset code"
    body = f"""
    Hello {user.name},

    Your verification code is: {code}
    It expires in 10 minutes.

    If you didn’t request a reset, you can ignore this email.
    """

    success = send_mail(email, subject, body)
    if not success:
        return jsonify({"success": False, "message": "Failed to send email"}), 500

    return jsonify({"success": True, "message": "Verification code sent!"})


@app.route("/verify-code", methods=["POST"])
def verify_code():
    data = request.get_json() or {}
    email = data.get("email")
    code = data.get("code")

    record = verification_codes.get(email)
    if not record:
        return jsonify({"success": False, "message": "No code found"}), 404

    if datetime.utcnow() > record["expires_at"]:
        verification_codes.pop(email)
        return jsonify({"success": False, "message": "Code expired"}), 400

    if record["code"] != code:
        return jsonify({"success": False, "message": "Invalid code"}), 400

    verification_codes.pop(email)
    return jsonify({"success": True, "message": "Code verified!"})


@app.route("/reset-password", methods=["POST"])
def reset_password():
    """
    After verifying the code, allow the user to set a new password.
    Request JSON: { "email": "user@example.com", "password": "newPassword123" }
    """
    data = request.get_json() or {}
    email = data.get("email")
    new_password = data.get("password")

    if not email or not new_password:
        return (
            jsonify({"success": False, "message": "Email and password required"}),
            400,
        )

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "message": "No account found"}), 404

    # Hash the new password for security  #TODO
    user.password = new_password
    db.session.commit()

    return jsonify({"success": True, "message": "Password reset successful!"})


# ---------------- RESTAURANT LOGIC ---------------- #


@app.route("/restaurants", methods=["GET"])
def get_restaurants():
    all_rest = Restaurant.query.all()
    return jsonify(
        [
            {
                "id": r.id,
                "name": r.name,
                "lat": r.lat,
                "lon": r.lon,
                "address": r.address,
                "food_items": [f.name for f in r.food_items],
            }
            for r in all_rest
        ]
    )


@app.route("/restaurants/add", methods=["POST"])
def add_restaurant():
    data = request.get_json()
    new_rest = Restaurant(
        name=data["name"],
        lat=data.get("lat"),
        lon=data.get("lon"),
        address=data.get("address", ""),
    )
    db.session.add(new_rest)
    db.session.commit()
    return jsonify({"success": True, "message": "Restaurant added!"})


@app.route("/foods/add", methods=["POST"])
def add_food():
    data = request.get_json()
    food = FoodItem(
        name=data["name"],
        tokens_left=data["tokens_left"],
        price=data.get("price", 0),
        restaurant_id=data["restaurant_id"],
    )
    db.session.add(food)
    db.session.commit()
    return jsonify({"success": True, "message": "Food added!"})


@app.route("/claim", methods=["POST"])
def claim_food():
    data = request.get_json()
    user = User.query.get(data["user_id"])
    food = FoodItem.query.get(data["food_id"])

    refresh_daily_tokens(user)

    if user.claims_today >= 2:
        return jsonify({"success": False, "message": "Daily limit reached"})

    if user.tokens <= 0:
        return jsonify({"success": False, "message": "No tokens left"})

    if not food or food.tokens_left <= 0:
        return jsonify({"success": False, "message": "Food unavailable"})

    food.tokens_left -= 1
    user.tokens -= 1
    user.claims_today += 1

    claim = Claim(user_id=user.id, food_id=food.id)
    db.session.add(claim)
    db.session.commit()

    return jsonify(
        {"success": True, "message": "Food claimed!", "remaining_tokens": user.tokens}
    )


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
