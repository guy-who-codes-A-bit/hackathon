from flask import Flask, jsonify, request
from flask_cors import CORS
import smtplib
import os
from dotenv import load_dotenv
import random
import string
from datetime import datetime, timedelta
load_dotenv()


# Sample user database
users = [
    {"email": "user1@example.com", "name": "John"},
    {"email": "user2@example.com", "name": "Sarah"},
]


app = Flask(__name__)
CORS(app)  # allow frontend requests (localhost:5173)

# Mock data for now
restaurants = [
    {
        "id": 1,
        "name": "The Green Spoon",
        "lat": 51.045,
        "lon": -114.07,
        "food": "Pasta & Salad",
        "tokens_left": 6,
        "price": 0,
    },
    {
        "id": 2,
        "name": "Sushi Corner",
        "lat": 51.049,
        "lon": -114.066,
        "food": "Sushi rolls",
        "tokens_left": 4,
        "price": 1,
    },
]

verification_codes = {}


def send_mail(to_address: str):
    gmail = os.getenv("GMAIL")
    password = os.getenv("GMAIL_PASS")
    subject = "Replate Password Reset Verification"
    code = str(random.randint(100, 999))
    body = (
        f"Hello 👋,\n\n"
        f"Your verification code is: {code}\n"
        "Use this code to continue resetting your password. It expires in 10 minutes.\n"
        "If you did not request this, just ignore this email.\n\n"
        "Replate Team"
    )
    msg = f"Subject: {subject}\n\n{body}"
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(gmail, password)
    server.sendmail(from_addr=gmail, to_addrs=to_address, msg=msg.encode('utf-8'))
    server.quit()
    return("message sent")

print(send_mail("nhialmadit79@gmail.com"))
print(send_mail("tan16120@gmail.com"))

@app.route("/")
def home():
    return {"message": "CityBite backend is running"}


@app.route("/restaurants", methods=["GET"])
def get_restaurants():
    return jsonify(restaurants)


@app.route("/claim", methods=["POST"])
def claim_food():
    data = request.get_json()
    restaurant_id = data.get("restaurant_id")

    for r in restaurants:
        if r["id"] == restaurant_id and r["tokens_left"] > 0:
            r["tokens_left"] -= 1
            return jsonify(
                {
                    "success": True,
                    "message": "Food claimed successfully",
                    "remaining": r["tokens_left"],
                }
            )
    return jsonify({"success": False, "message": "Food unavailable"}), 400


@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    """Generate a secure random 3-digit code, email it to the user, and store it for later verification.

    Request JSON: { "email": "user@example.com" }
    """
    data = request.get_json() or {}
    email = data.get("email")
    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    # Generate a simple random 3-character code (letters and/or digits)
    alphabet = string.ascii_uppercase + string.digits
    code = "".join(random.choice(alphabet) for _ in range(3))

    # Save with expiration (e.g., 10 minutes)
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    verification_codes[email] = {"code": code, "expires_at": expires_at}

    # Compose the email message
    subject = "Your CityBite password reset code"
    body = (
        f"Hello,\n\nWe received a request to reset your CityBite password.\n"
        f"Your verification code is: {code}\n\n"
        "If you did not request a password reset, please ignore this email. "
        "This code will expire in 10 minutes.\n\n"
        "Thanks,\nCityBite Team"
    )

    sent = send_mail(to_address=email, subject=subject, body=body)
    if not sent:
        return jsonify({"success": False, "message": "Failed to send email"}), 500

    return jsonify({"success": True, "message": "Verification code sent"})


@app.route("/verify-code", methods=["POST"])
def verify_code():
    """Verify a code previously issued via /forgot-password.

    Request JSON: { "email": "user@example.com", "code": "123" }
    """
    data = request.get_json() or {}
    email = data.get("email")
    code = data.get("code")
    if not email or not code:
        return jsonify({"success": False, "message": "Email and code are required"}), 400

    record = verification_codes.get(email)
    if not record:
        return jsonify({"success": False, "message": "No code found for this email"}), 400

    if datetime.utcnow() > record["expires_at"]:
        # expired
        verification_codes.pop(email, None)
        return jsonify({"success": False, "message": "Code expired"}), 400

    if record["code"] != str(code):
        return jsonify({"success": False, "message": "Invalid code"}), 400

    # Success — consume the code
    verification_codes.pop(email, None)
    return jsonify({"success": True, "message": "Code verified"})


if __name__ == "__main__":
    app.run(debug=True)
