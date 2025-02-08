import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

API_KEY = " " #add Your API key here...

# Predefined fraud types
FRAUD_TYPES = [
    "Visa and Passport", "Cyberattacks", "ATM", "Software", "Marriage", 
    "AI", "Cryptocurrency", "Digital Arrest", "Housing", "Fake Voters", 
    "Share Market", "FIR"
]

@app.route('/api/fraud-data', methods=['GET'])
def get_fraud_data():
    city = request.args.get('city')  # City input
    fraud_type = request.args.get('fraud_type')  # Fraud type input

    if not city:
        return jsonify({"error": "City is required"}), 400

    # List of all fraud types
    fraud_types = [
        "Visa and Passport", "Cyberattacks", "ATM", "Software", "Marriage", 
        "AI", "Cryptocurrency", "Digital arrest", "Housing", 
        "Fake Voters", "Share Market", "FIR"
    ]

    # List to store fraud types present in the city
    available_fraud_types = []

    # For each fraud type, check if articles exist in the city
    for fraud in fraud_types:
        url = f" " #add you API Url
        response = requests.get(url)
        data = response.json()

        if data.get("articles", []):
            available_fraud_types.append(fraud)

    if fraud_type:
        # If a fraud type is selected, get data for that specific fraud type
        url = f" " #add you API Url
        response = requests.get(url)
        data = response.json()

        fraud_articles = []
        for article in data.get("articles", []):
            fraud_articles.append({
                "title": article["title"],
                "source": article["source"]["name"],
                "url": article["url"],
                "publishedAt": article["publishedAt"],
                "fraud_type": fraud_type
            })

        return jsonify({
            "city": city,
            "fraud_types": available_fraud_types,  # Only return fraud types with data for that city
            "fraud_articles": fraud_articles
        })
    
    return jsonify({
        "city": city,
        "fraud_types": available_fraud_types,  # Return fraud types relevant to the city
        "fraud_articles": []
    })

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
