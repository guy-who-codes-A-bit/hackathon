from flask import Flask, jsonify, request
from flask_cors import CORS

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


if __name__ == "__main__":
    app.run(debug=True)
