const OMDB_API_KEY = "";
const YOUTUBE_API_KEY = "";
const NEWS_API_KEY = "";

let currentMood = "calm";
const grid = document.getElementById("grid");

document.getElementById("moodInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    analyzeMood();
  }
});



function detectMood(text) {
  text = text.toLowerCase();

  if (
    text.includes("sad") ||
    text.includes("cry") ||
    text.includes("depressed")
  ) {
    return "sad";
  }

  if (
    text.includes("happy") ||
    text.includes("great") ||
    text.includes("excited")
  ) {
    return "happy";
  }

  if (
    text.includes("angry") ||
    text.includes("mad") ||
    text.includes("frustrated")
  ) {
    return "angry";
  }

  return "calm";
}



function analyzeMood() {
  const value = document.getElementById("moodInput").value.trim();

  if (!value) {
    alert("Please enter your mood");
    return;
  }

  currentMood = detectMood(value);

  document.getElementById("title").innerText =
    `Curated for your ${currentMood.toUpperCase()} mood`;

  document.getElementById("result").classList.remove("hidden");


  showToast("Mood saved successfully ✅");

  loadMovies();
}


function voiceDemo() {
  currentMood = "happy";
  afterDemo();
}

function faceDemo() {
  currentMood = "calm";
  afterDemo();
}

function afterDemo() {
  document.getElementById("title").innerText =
    `Curated for your ${currentMood.toUpperCase()} mood`;

  document.getElementById("result").classList.remove("hidden");

  alert("Your mood has been saved");

  loadMovies();
}


function addCard(image, title, desc, action) {
  grid.innerHTML += `
        <div class="item" onclick="${action}">
            <img src="${image}">
            <div class="content">
                <h3>${title}</h3>
                <p>${desc}</p>
            </div>
        </div>
    `;
}



async function loadMovies() {
  try {
    grid.innerHTML = "<h3>Loading Movies...</h3>";

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${currentMood}&page=1`,
    );

    const data = await response.json();

    grid.innerHTML = "";

    if (data.Search) {
      data.Search.forEach((movie) => {
        addCard(
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300",
          movie.Title,
          "Movie Suggestion",
          `alert('Movie: ${movie.Title}')`,
        );
      });
    }
  } catch (error) {
    grid.innerHTML = "<h3>Failed to load movies</h3>";
  }
}



async function ytSearch(query, label) {
  try {
    grid.innerHTML = "<h3>Loading...</h3>";

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&videoDuration=long&maxResults=50&order=relevance&key=${YOUTUBE_API_KEY}`,
    );

    const data = await response.json();

    grid.innerHTML = "";

    if (!data.items || data.items.length === 0) {
      grid.innerHTML = "<h3>No videos found</h3>";
      return;
    }

    data.items.forEach((video) => {
      addCard(
        video.snippet.thumbnails.high.url,
        video.snippet.title,
        label,
        `openVideo('${video.id.videoId}')`,
      );
    });
  } catch (error) {
    console.log(error);
    grid.innerHTML = "<h3>Failed to load videos</h3>";
  }
}


function loadVideos() {
  ytSearch(`${currentMood}  long videos full length`, "Play Full Video");
}

function loadMusic() {
  ytSearch(`${currentMood}  music full songs`, "Play Music");
}

function loadReels() {
  ytSearch(`${currentMood} trending reels compilation`, "Play Reel");
}

function loadSongs() {
  ytSearch(`${currentMood}  full songs`, "Play Song");
}

function loadMoodVideos() {
  ytSearch(`${currentMood} mood healing long  videos`, "Play Mood Video");
}



async function loadBooks() {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${currentMood}+self+help`,
  );

  const data = await response.json();

  grid.innerHTML = "";

  if (data.items) {
    data.items.slice(0, 20).forEach((book) => {
      addCard(
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
        book.volumeInfo.title || "Book",
        "Book Suggestion",
        `window.open('${book.volumeInfo.infoLink}','_blank')`,
      );
    });
  }
}



async function loadNews() {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${currentMood}&pageSize=20&apiKey=${NEWS_API_KEY}`,
  );

  const data = await response.json();

  grid.innerHTML = "";

  if (data.articles) {
    data.articles.forEach((news) => {
      addCard(
        news.urlToImage || "https://via.placeholder.com/300",
        news.title || "News",
        "Open News",
        `window.open('${news.url}','_blank')`,
      );
    });
  }
}



async function loadJokes() {
  grid.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke",
    );

    const joke = await response.json();

    addCard(
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
      joke.setup,
      joke.punchline,
      "",
    );
  }
}



function openVideo(id) {
  document.getElementById("videoModal").style.display = "flex";

  document.getElementById("videoFrame").src =
    `https://www.youtube.com/embed/${id}`;
}

function closeModal() {
  document.getElementById("videoModal").style.display = "none";

  document.getElementById("videoFrame").src = "";
}


function setMoodText(text) {
  document.getElementById("moodInput").value = text;
  document.getElementById("moodInput").focus();
}

let isDragging = false,
  offsetX,
  offsetY;

const box = document.querySelector(".modal-box");

box.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - box.offsetLeft;
  offsetY = e.clientY - box.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  box.style.left = e.clientX - offsetX + "px";
  box.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});
