async function fetchMovies(query) {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.results;
}

async function searchMovies() {
  const query = document.getElementById("searchInput").value;
  if (!query) {
    alert("Please enter a search term.");
    return;
  }

  localStorage.setItem("lastSearch", query);
  document.getElementById("trending").style.display = "none";

  const results = await fetchMovies(query);
  renderMovies(results, "Search Results");
}

// ⭐ Toggle favorite
function toggleFavourite(movieId, button) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.includes(movieId)) {
    favorites = favorites.filter((id) => id !== movieId);
    button.textContent = "🤍";
  } else {
    favorites.push(movieId);
    button.textContent = "❤️";
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// 🎬 Render any movie list
function renderMovies(movies, headingText = "") {
  const container = document.getElementById("results");
  container.innerHTML = headingText ? `<h2>${headingText}</h2>` : "";

  if (!movies || movies.length === 0) {
    container.innerHTML += "<p>No movies found.</p>";
    return;
  }

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  movies.forEach((movie) => {
    const isFav = favorites.includes(movie.id);
    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `
      <div class="movie-info">
        <a href="movie.html?id=${movie.id}" onclick="localStorage.setItem('restoreSearch', 'true')">
          <img src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : "https://via.placeholder.com/150"}" alt="${movie.title}" />
          <h3>${movie.title}</h3>
          <p>⭐ ${movie.vote_average}</p>
        </a>
        <button class="fav-btn" onclick="toggleFavourite(${movie.id}, this)">${isFav ? "❤️" : "🤍"}</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// 🔥 Load top 10 trending
async function loadTrendingMovies() {
  const res = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
  const data = await res.json();
  const trending = data.results.slice(0, 10);
  const container = document.getElementById("trending");
  container.innerHTML = "<h2>Top 10 Trending Movies</h2>";

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  trending.forEach((movie) => {
    const isFav = favorites.includes(movie.id);
    const card = document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML = `
      <div class="movie-info">
        <a href="movie.html?id=${movie.id}" onclick="localStorage.setItem('restoreSearch', 'true')">
          <img src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : "https://via.placeholder.com/150"}" alt="${movie.title}" />
          <h3>${movie.title}</h3>
          <p>⭐ ${movie.vote_average}</p>
        </a>
        <button class="fav-btn" onclick="toggleFavourite(${movie.id}, this)">${isFav ? "❤️" : "🤍"}</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// 🧑‍🤝‍🧑 Load popular
async function loadPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await res.json();
  renderMovies(data.results, "Popular Movies");
}

// 🌙 Setup dark mode
function setupThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
      toggle.checked = true;
    }
    toggle.addEventListener("change", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    });
  }
}

// 🚀 On page load
window.addEventListener("DOMContentLoaded", async () => {
  const lastSearch = localStorage.getItem("lastSearch");
  const shouldRestore = localStorage.getItem("restoreSearch");

  if (lastSearch && shouldRestore === "true") {
    document.getElementById("searchInput").value = lastSearch;
    const results = await fetchMovies(lastSearch);
    renderMovies(results, "Search Results");
  } else {
    await loadPopularMovies();
  }

  await loadTrendingMovies();
  localStorage.removeItem("restoreSearch");
  setupThemeToggle();
});

// ✅ Make global for HTML
window.searchMovies = searchMovies;
window.toggleFavourite = toggleFavourite;
