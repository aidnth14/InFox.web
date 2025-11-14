const OMDB_API_KEY = API_KEYS.OMDB;
const movieContainer = document.getElementById("movie-container");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

document.addEventListener("DOMContentLoaded", () => {
  async function searchMovies(query) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      movieContainer.innerHTML = `<p>No results found for "${query}".</p>`;
    }
  }

  function displayMovies(movies) {
    movieContainer.innerHTML = "";
    movies.forEach(movie => {
      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/150'}" alt="${movie.Title}" />
        <div class="movie-title">${movie.Title}</div>
        <div class="movie-year">${movie.Year}</div>
      `;
      movieContainer.appendChild(card);
    });
  }

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      searchMovies(query);
    }
  });

  searchInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });

  // Run default search on load:
  searchMovies("Avengers");
});
