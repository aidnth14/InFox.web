const API_KEY = "63fe3bddc3f94c3ab94406675dedfcef";
const BASE_URL = "https://newsapi.org/v2";

const newsContainer = document.getElementById("newsContainer");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-buttons button");

// Default load
window.addEventListener("DOMContentLoaded", () => {
  fetchNews("general");
});

// Category filter
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    fetchNews(category);
  });
});

// Search functionality
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) fetchSearchNews(query);
});

// Fetch top headlines by category
async function fetchNews(category) {
  try {
    const res = await fetch(`${BASE_URL}/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`);
    const data = await res.json();
    renderNews(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
    newsContainer.innerHTML = "<p>Failed to load news.</p>";
  }
}

// Fetch news based on search
async function fetchSearchNews(query) {
  try {
    const res = await fetch(`${BASE_URL}/everything?q=${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    renderNews(data.articles);
  } catch (error) {
    console.error("Search failed:", error);
    newsContainer.innerHTML = "<p>No results found.</p>";
  }
}

// Render articles to DOM
function renderNews(articles) {
  newsContainer.innerHTML = "";

  if (!articles.length) {
    newsContainer.innerHTML = "<p>No news found.</p>";
    return;
  }

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "news-card";

    card.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" alt="News Image" />
      <div class="news-content">
        <h3>${article.title}</h3>
        <p>${article.description || "No description available."}</p>
        <a href="${article.url}" target="_blank">Read More</a>
      </div>
    `;

    newsContainer.appendChild(card);
  });
}
