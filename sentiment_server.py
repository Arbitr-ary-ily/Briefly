from flask import Flask, request, jsonify, render_template  # Added render_template
import pandas as pd  # Added import for pandas
from joblib import load  # Ensure joblib is imported
from sklearn.feature_extraction.text import CountVectorizer  # Use CountVectorizer

app = Flask(__name__)

# Load the pre-trained model and vectorizer
model = load('sentiment_model.pkl')  # Load the sentiment model
cv = load('tfidf_vectorizer.pkl')  # Load the CountVectorizer

@app.route('/')
def home():
    return render_template('home.html')  # Render home template

@app.route('/analyze_sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.json
    text = data.get('text', '')
    
    # Transform the input text using the CountVectorizer
    vect = cv.transform([text]).toarray()  # Transform input text
    sentiment = model.predict(vect)[0]  # Predict sentiment using the model
    
    # Map sentiment to emoji
    if sentiment == 'positive':
        emoji = '😊'
    elif sentiment == 'negative':
        emoji = '☹️'
    else:
        emoji = '😐'
    
    return jsonify({'sentiment': sentiment, 'emoji': emoji})

if __name__ == '__main__':
    app.run(debug=True, port=5000)