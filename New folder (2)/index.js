// Constants
const API_KEY = "he2Ev4nEvwiR0pG6ul04B8GDqC3lXJzH";
const BASE_URL = "https://api.nytimes.com/svc/topstories/v2/";

// DOM Elements
const newsContainer = document.getElementById("newsContainer");
const categoryButtons = document.querySelectorAll(".category-buttons button[data-category]");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

let currentArticles = [];

// Fetch top stories by category
async function fetchNews(category = "home") {
  try {
    const response = await fetch(`${BASE_URL}${category}.json?api-key=${API_KEY}`);
    const data = await response.json();
    currentArticles = data.results || [];
    renderNews(currentArticles);
  } catch (error) {
    console.error("Error fetching news:", error);
    newsContainer.innerHTML = "<p>Error loading news. Please try again later.</p>";
  }
}

// Render news cards
function renderNews(articles) {
  if (!articles.length) {
    newsContainer.innerHTML = "<p style='text-align:center;'>No articles found.</p>";
    return;
  }

  newsContainer.innerHTML = articles.map(article => {
    const imageUrl = article.multimedia?.[0]?.url || "https://via.placeholder.com/400x200?text=No+Image";
    return `
      <div class="news-card">
        <img src="${imageUrl}" alt="${article.title}">
        <div class="news-content">
          <h3>${article.title}</h3>
          <p>${article.abstract}</p>
          <a href="${article.url}" target="_blank">Read More</a>
        </div>
      </div>
    `;
  }).join("");
}

// Search within loaded articles
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    renderNews(currentArticles);
    return;
  }

  const filtered = currentArticles.filter(article =>
    (article.title && article.title.toLowerCase().includes(query)) ||
    (article.abstract && article.abstract.toLowerCase().includes(query)) ||
    (article.byline && article.byline.toLowerCase().includes(query))
  );

  if (filtered.length === 0) {
    newsContainer.innerHTML = `<p style="text-align:center; font-size:1.2rem;">No articles found for "${query}".</p>`;
  } else {
    renderNews(filtered);
  }
});

// Load selected category
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    fetchNews(category);
  });
});

// Initial load
fetchNews();
