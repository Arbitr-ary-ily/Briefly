from flask import Flask, request, jsonify, render_template  # Added render_template
import pandas as pd  # Added import for pandas
from joblib import load  # Ensure joblib is imported
from sklearn.feature_extraction.text import CountVectorizer  # Use CountVectorizer

app = Flask(__name__)

# Load the pre-trained bias detection model and vectorizer
model = load('bias_model.pkl')  # Load the bias detection model
cv = load('bias_vectorizer.pkl')  # Load the bias vectorizer

@app.route('/')
def home():
    return render_template('home.html')  # Render home template

@app.route('/analyze_bias', methods=['POST'])  # Change endpoint to analyze_bias
def analyze_bias():  # Change function name to analyze_bias
    data = request.json
    text = data.get('text', '')
    
    # Transform the input text using the bias vectorizer
    vect = cv.transform([text]).toarray()  # Transform input text
    bias = model.predict(vect)[0]  # Predict bias using the model
    
    # Map bias to emoji or response
    if bias == 'biased':
        emoji = '⚠️'
    elif bias == 'neutral':
        emoji = '😐'
    else:
        emoji = '✅'
    
    return jsonify({'bias': bias, 'emoji': emoji})  # Update response keys

if __name__ == '__main__':
    app.run(debug=True, port=5000)
