const API_KEY = "he2Ev4nEvwiR0pG6ul04B8GDqC3lXJzH";
const BASE_URL = "https://api.nytimes.com/svc/topstories/v2";

const newsContainer = document.getElementById("newsContainer");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-buttons button");

const categoryMap = {
  business: "business",
  sports: "sports",
  entertainment: "arts",
  technology: "technology",
  food: "food"
};

// Load default category (e.g., general news via 'home')
window.addEventListener("DOMContentLoaded", () => {
  fetchTopStories("home");
});

// Category filter buttons
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    const mappedCategory = categoryMap[category];
    if (mappedCategory) {
      fetchTopStories(mappedCategory);
    }
  });
});

// Search functionality
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchSearchResults(query);
  }
});

// Fetch top stories by NYT section
async function fetchTopStories(section) {
  try {
    const res = await fetch(`${BASE_URL}/${section}.json?api-key=${API_KEY}`);
    const data = await res.json();
    renderTopStories(data.results);
  } catch (error) {
    console.error("Error fetching top stories:", error);
    newsContainer.innerHTML = "<p>Failed to load news.</p>";
  }
}

// Fetch search results using NYT article search API
async function fetchSearchResults(query) {
  try {
    const searchURL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${API_KEY}`;
    const res = await fetch(searchURL);
    const data = await res.json();
    renderSearchResults(data.response.docs);
  } catch (error) {
    console.error("Search failed:", error);
    newsContainer.innerHTML = "<p>No results found.</p>";
  }
}

// Render top stories (from Top Stories API)
function renderTopStories(articles) {
  newsContainer.innerHTML = "";

  if (!articles.length) {
    newsContainer.innerHTML = "<p>No news found.</p>";
    return;
  }

  articles.forEach(article => {
    let image = "https://via.placeholder.com/400x200"; // fallback
    if (article.multimedia && article.multimedia.length > 0) {
      const bestImage = article.multimedia.find(media => media.format === "superJumbo") || article.multimedia[0];
      if (bestImage?.url) image = bestImage.url;
    }

    const card = document.createElement("div");
    card.className = "news-card";

    card.innerHTML = `
      <img src="${image}" alt="News Image" />
      <div class="news-content">
        <h3>${article.title}</h3>
        <p>${article.abstract || "No description available."}</p>
        <a href="${article.url}" target="_blank">Read More</a>
      </div>
    `;

    newsContainer.appendChild(card);
  });
}

// Render search results (from Article Search API)
function renderSearchResults(docs) {
  newsContainer.innerHTML = "";

  if (!docs.length) {
    newsContainer.innerHTML = "<p>No news found.</p>";
    return;
  }

  docs.forEach(doc => {
    let image = "https://via.placeholder.com/400x200"; // fallback
    if (doc.multimedia && doc.multimedia.length > 0) {
      image = `https://static.nytimes.com/${doc.multimedia[0].url}`;
    }

    const card = document.createElement("div");
    card.className = "news-card";

    card.innerHTML = `
      <img src="${image}" alt="News Image" />
      <div class="news-content">
        <h3>${doc.headline.main}</h3>
        <p>${doc.abstract || doc.lead_paragraph || "No description available."}</p>
        <a href="${doc.web_url}" target="_blank">Read More</a>
      </div>
    `;

    newsContainer.appendChild(card);
  });
}
