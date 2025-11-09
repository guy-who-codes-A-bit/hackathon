from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
from models import db, User, Restaurant, Claim
from utils import send_mail, refresh_daily_tokens
import random, string, requests
from datetime import datetime, timedelta
import threading
from authlib.integrations.flask_client import OAuth
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///replate.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")  # Add this line
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"  # Add this
app.config["SESSION_COOKIE_SECURE"] = False    # Add this (set True in production with HTTPS)


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
            "user_id": user.id,  # 👈 include this
            "name": user.name,
            "email": user.email,
            "id": user.id,
            "tokens": user.tokens,
            "claims_today": user.claims_today,
        }
    )

oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@app.route('/login/google')
def google_login():
    redirect_uri = "http://localhost:5000/auth/google/callback"
    return google.authorize_redirect(redirect_uri)

@app.route("/auth/google/callback")
def google_callback():
    try:
        token = google.authorize_access_token()
        user_info = token.get('userinfo')  # This might be None
        
        # If userinfo is not in token, fetch it manually
        if not user_info:
            userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
            headers = {'Authorization': f'Bearer {token.get("access_token")}'}
            user_response = requests.get(userinfo_url, headers=headers)
            user_info = user_response.json()
            
    except Exception as e:
        print(f"OAuth error: {e}")  # Debug print
        # Fallback: manually parse the callback
        code = request.args.get('code')
        if not code:
            return jsonify({"success": False, "message": "No authorization code"}), 400
        
        # Exchange code for token manually
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            'code': code,
            'client_id': os.getenv("GOOGLE_CLIENT_ID"),
            'client_secret': os.getenv("GOOGLE_CLIENT_SECRET"),
            'redirect_uri': "http://localhost:5000/auth/google/callback",
            'grant_type': 'authorization_code'
        }
        token_response = requests.post(token_url, data=token_data)
        token = token_response.json()
        
        # Get user info
        userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {'Authorization': f'Bearer {token.get("access_token")}'}
        user_response = requests.get(userinfo_url, headers=headers)
        user_info = user_response.json()
    
    print(f"Google user info: {user_info}")  # Debug print
    
    if not user_info:
        return jsonify({"success": False, "message": "Failed to get user info"}), 400
    
    email = user_info.get('email')
    name = user_info.get('name')
    
    print(f"Email: {email}, Name: {name}")  # Debug print
    
    # Check if user exists, create if not
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(name=name, email=email, password="google_oauth")
        db.session.add(user)
        db.session.commit()
        print(f"Created new user: {name} ({email})")  # Debug print
    else:
        print(f"Found existing user: {user.name} ({user.email})")  # Debug print
    
    # Refresh tokens
    refresh_daily_tokens(user)
    
    return f"""
    <script>
        localStorage.setItem('user_id', '{user.id}');
        localStorage.setItem('user_name', '{user.name}');
        localStorage.setItem('tokens', '{user.tokens}');
        window.location.href = 'http://localhost:5173/home';
    </script>
    """


def increment_daily_tokens():
    users = User.query.all()
    for user in users:
        user.tokens += 1
    db.session.commit()
    print("✅ All users' tokens incremented")


def schedule_next_increment():
    now = datetime.now()
    # Next midnight
    next_run = (now + timedelta(days=1)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    delay = (next_run - now).total_seconds()
    threading.Timer(delay, increment_daily_tokens).start()


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
    return jsonify({
        "count": len(all_rest),
        "restaurants":
        [
            {
                "id": r.id,
                "name": r.name,
                "lat": r.lat,
                "lon": r.lon,
                "address": r.address,
                "food_type": r.food_type,
                "tokens_left": r.tokens_left,
            }
            for r in all_rest
        ]}
    )


# 🏪 Restaurant signup
GOOGLE_MAPS_API_KEY = "AIzaSyATR6kdSwjqk8iaZrgr8LGHcV4jZAggxCE"


@app.route("/restaurant/signup", methods=["POST"])
def restaurant_signup():
    data = request.get_json()

    # Extract fields
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    address = data.get("address", "")
    food_type = data.get("food_type", "")
    tokens_left = data.get("tokens_left", 0)

    # Validate
    if not all([name, email, password, address]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Check if email exists
    if Restaurant.query.filter_by(email=email).first():
        return jsonify({"success": False, "message": "Email already registered"}), 400

    # 🔍 Geocode address using Google Maps API
    lat, lon = None, None
    try:
        resp = requests.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={"address": address, "key": GOOGLE_MAPS_API_KEY},
        )
        if resp.status_code == 200:
            results = resp.json().get("results")
            if results:
                location = results[0]["geometry"]["location"]
                lat, lon = location["lat"], location["lng"]
    except Exception as e:
        print("Geocoding error:", e)

    # 🏪 Create and save restaurant
    new_restaurant = Restaurant(
        name=name,
        email=email,
        password=password,
        address=address,
        lat=lat,
        lon=lon,
        food_type=food_type,
        tokens_left=tokens_left,
    )

    db.session.add(new_restaurant)
    db.session.commit()

    return (
        jsonify(
            {
                "success": True,
                "message": "Restaurant account created!",
                "lat": lat,
                "lon": lon,
            }
        ),
        201,
    )


# 🔑 Restaurant login
@app.route("/restaurant/login", methods=["POST"])
def restaurant_login():
    data = request.get_json()
    email, password = data.get("email"), data.get("password")

    restaurant = Restaurant.query.filter_by(email=email).first()
    if not restaurant or restaurant.password != password:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

    return jsonify(
        {
            "success": True,
            "id": restaurant.id,
            "name": restaurant.name,
            "address": restaurant.address,
        }
    )


@app.route("/claim", methods=["POST"])
def claim_food():
    data = request.get_json()
    user_id = data.get("user_id")
    restaurant_id = data.get("restaurant_id")

    user = User.query.get(user_id)
    restaurant = Restaurant.query.get(restaurant_id)

    if not user or not restaurant:
        return jsonify({"success": False, "message": "Invalid user or restaurant"}), 400

    # 🌞 Ensure daily refresh (reset tokens if a new day)
    refresh_daily_tokens(user)

    # 🧮 Check daily claim limit
    if user.claims_today >= 2:
        return jsonify({"success": False, "message": "Daily limit reached"}), 403

    # 🧮 Check user tokens
    if user.tokens <= 0:
        return jsonify({"success": False, "message": "No tokens left"}), 403

    # 🧮 Check restaurant availability
    if restaurant.tokens_left <= 0:
        return (
            jsonify({"success": False, "message": "No food left at this restaurant"}),
            403,
        )

    # ✅ Process claim
    restaurant.tokens_left -= 1
    user.tokens -= 1
    user.claims_today += 1

    # Record claim event
    claim = Claim(user_id=user.id, restaurant_id=restaurant.id)
    db.session.add(claim)
    db.session.commit()

    return jsonify(
        {
            "success": True,
            "message": f"Food claimed from {restaurant.name}!",
            "remaining_tokens": user.tokens,
            "restaurant": {
                "id": restaurant.id,
                "name": restaurant.name,
                "food_type": restaurant.food_type,
                "tokens_left": restaurant.tokens_left,
            },
        }
    )


@app.route("/restaurant/update-offer", methods=["POST"])
def restaurant_update_offer():
    data = request.get_json()
    restaurant_id = data.get("restaurant_id")
    food_type = data.get("food_type")
    tokens_left = data.get("tokens_left", 0)

    restaurant = Restaurant.query.get(restaurant_id)
    if not restaurant:
        return jsonify({"success": False, "message": "Restaurant not found"}), 404

    if not food_type:
        return jsonify({"success": False, "message": "Food type is required"}), 400

    # update restaurant offer
    restaurant.food_type = food_type
    restaurant.tokens_left = tokens_left
    db.session.commit()

    return (
        jsonify(
            {
                "success": True,
                "message": f"Offer updated! Now offering {food_type} with {tokens_left} servings left.",
            }
        ),
        200,
    )


@app.route("/restaurant/<int:restaurant_id>", methods=["GET"])
def get_restaurant_info(restaurant_id):
    """Return a single restaurant’s food type and token info."""
    restaurant = Restaurant.query.get(restaurant_id)

    if not restaurant:
        return jsonify({"success": False, "message": "Restaurant not found"}), 404

    return jsonify(
        {
            "success": True,
            "restaurant": {
                "id": restaurant.id,
                "name": restaurant.name,
                "address": restaurant.address,
                "food_type": getattr(restaurant, "food_type", "Assorted meals"),
                "tokens_left": getattr(restaurant, "tokens_left", 0),
                "lat": restaurant.lat,
                "lon": restaurant.lon,
            },
        }
    )


@app.route("/verify-claim", methods=["POST"])
def verify_claim():
    data = request.get_json()
    claim_id = data.get("claim_id")

    claim = Claim.query.get(claim_id)
    if not claim:
        return jsonify({"success": False, "message": "Invalid claim"}), 400

    claim.verified = True
    db.session.commit()
    return jsonify({"success": True, "message": "Claim verified successfully!"})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        increment_daily_tokens()
    app.run(debug=True)
