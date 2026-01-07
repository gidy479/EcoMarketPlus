from flask import Flask, request, jsonify
from flask_cors import CORS
from spending_analyzer import analyze_spending
from recommender import get_recommendations

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "AI Service Running", "module": "EcoMarketPlus AI"})

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    transactions = data.get('transactions', [])
    result = analyze_spending(transactions)
    return jsonify(result)

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_id = data.get('user_id')
    history = data.get('history', [])
    recommendations = get_recommendations(user_id, history)
    return jsonify({"recommendations": recommendations})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
