from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

OMDB_API_KEY = "18798a3c"
YOUTUBE_API_KEY = "AIzaSyCjfZHY_NBOsyJZIlsGVKXLCK4FLuLbHOs"
NEWS_API_KEY = "7fba774653eb4d38ba56763f36bb4e9d"

# =========================
# MOOD DETECTION (IMPROVED)
# =========================
def detect_mood(text):
    text = text.lower()

    moods = {
        "sad": ["sad", "cry", "depressed", "lonely"],
        "happy": ["happy", "great", "excited", "joy"],
        "angry": ["angry", "mad", "frustrated"],
        "anxious": ["anxious", "stress", "worried"],
        "motivated": ["motivated", "focus", "goal"]
    }

    for mood, words in moods.items():
        for word in words:
            if word in text:
                return mood

    return "calm"


# =========================
# ANALYZE MOOD
# =========================
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text", "")

    mood = detect_mood(text)

    return jsonify({
        "mood": mood,
        "message": f"Detected mood: {mood}"
    })


# =========================
# MOVIES
# =========================
@app.route("/movies/<mood>")
def movies(mood):
    url = f"https://www.omdbapi.com/?apikey={OMDB_API_KEY}&s={mood}&page=1"
    res = requests.get(url).json()

    results = []

    if "Search" in res:
        for movie in res["Search"]:
            results.append({
                "title": movie["Title"],
                "poster": movie["Poster"]
            })

    return jsonify(results)


# =========================
# YOUTUBE
# =========================
@app.route("/videos/<mood>")
def videos(mood):
    url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={mood}&type=video&maxResults=20&key={YOUTUBE_API_KEY}"
    res = requests.get(url).json()

    results = []

    for item in res.get("items", []):
        results.append({
            "title": item["snippet"]["title"],
            "videoId": item["id"]["videoId"],
            "thumbnail": item["snippet"]["thumbnails"]["high"]["url"]
        })

    return jsonify(results)


# =========================
# BOOKS
# =========================
@app.route("/books/<mood>")
def books(mood):
    url = f"https://www.googleapis.com/books/v1/volumes?q={mood}"
    res = requests.get(url).json()

    results = []

    for item in res.get("items", [])[:10]:
        info = item["volumeInfo"]

        results.append({
            "title": info.get("title"),
            "link": info.get("infoLink")
        })

    return jsonify(results)


# =========================
# NEWS
# =========================
@app.route("/news/<mood>")
def news(mood):
    url = f"https://newsapi.org/v2/everything?q={mood}&apiKey={NEWS_API_KEY}"
    res = requests.get(url).json()

    results = []

    for article in res.get("articles", [])[:10]:
        results.append({
            "title": article["title"],
            "url": article["url"]
        })

    return jsonify(results)


# =========================
# JOKES
# =========================
@app.route("/jokes")
def jokes():
    results = []

    for _ in range(5):
        joke = requests.get("https://official-joke-api.appspot.com/random_joke").json()

        results.append({
            "setup": joke["setup"],
            "punchline": joke["punchline"]
        })

    return jsonify(results)


# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True)