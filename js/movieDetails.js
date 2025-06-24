const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

async function loadMovieDetails() {
  const container = document.getElementById("movieDetails");
  if(!container) {
    console.error("Container with id 'movieDetails' not found.");
    return;
  }
  const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
  const movie = await res.json();

  const videoRes= await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const videoData = await videoRes.json();

  const trailer= videoData.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
  
  const creditsRes = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
const creditsData = await creditsRes.json();
const cast = Array.isArray(creditsData.cast) ? creditsData.cast.slice(0, 6) : [];


  let castHTML = `
  <h2>Top Cast</h2>
  <div class="cast-list">
    ${cast
      .map(
        (actor) => `
      <div class="cast-card">
        <img src="${
          actor.profile_path
            ? IMG_BASE_URL + actor.profile_path
            : 'https://via.placeholder.com/100x150?text=No+Image'
        }" alt="${actor.name}" />
        <p>${actor.name}</p>
        <small>as ${actor.character}</small>
      </div>`
      )
      .join("")}
  </div>
`;

  let trailerEmbed = "";
  if (trailer) {
    trailerEmbed = `
    <h2>Watch Trailer</h2>
    <iframe width="100%" height="400" src="https://www.youtube.com/embed/${trailer.key}" title="${movie.title} Trailer" frameborder="0" allowfullscreen></iframe>
    `;
  } else {
    trailerEmbed = "<p>No trailer available.</p>";
  }
  if (!movieId) {
  document.getElementById("movieDetails").innerHTML = "<p>Invalid movie ID. Please go back and try again.</p>";
  return;
}

  container.innerHTML = `
        <h1>${movie.title}</h1>
         <img src="${
           movie.poster_path
             ? IMG_BASE_URL + movie.poster_path
             : "https://via.placeholder.com/150"
         }" alt="${movie.title}" />
        <p><strong>Rating:</strong> ${movie.vote_average}</p>
    <p><strong>Release Date:</strong> ${movie.release_date}</p>
    <p><strong>Overview:</strong> ${movie.overview}</p>
    <p><strong>Genres:</strong> ${movie.genres
      .map((g) => g.name)
      .join(", ")}</p>
      ${trailerEmbed}
      ${castHTML}
    <a href="index.html">← Back to Search</a>
    `;
}
loadMovieDetails();
const toggle=document.getElementById("themeToggle");
if(toggle){
  if(localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    toggle.checked = true;
  }
toggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});
}
