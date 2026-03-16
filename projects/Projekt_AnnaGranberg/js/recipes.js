class RecipeWidget extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // Körs automatiskt när komponenten läggs till i DOM:en
    // Renderar komponentens HTML-struktur
    this.innerHTML = `
      <div class="search-bar">
        <input id="searchInput" placeholder="Search recipe">
        <select id="areaSelect">
          <option value="">Area</option>
        </select>
        <button id="searchBtn">Search</button>
      </div>

      <div id="recipes-container"></div>

      <div id="recipe-modal">
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <div id="recipe-details"></div>
        </div>
      </div>
    `;

    // Hämtar och sparar referenser till viktiga element i komponenten
    this.container = this.querySelector("#recipes-container");
    this.modal = this.querySelector("#recipe-modal");
    this.modalContent = this.querySelector("#recipe-details");
    this.searchInput = this.querySelector("#searchInput");
    this.searchBtn = this.querySelector("#searchBtn");
    this.areaSelect = this.querySelector("#areaSelect");

    // Laddar områden (länder) till dropdown och hämtar alla recept
    this.loadAreas();
    this.fetchAllRecipes();

    // Sökknappens funktion: avgör om vi ska söka på namn eller filtrera på område
    this.searchBtn.addEventListener("click", () => {
      const q = this.searchInput.value.trim();
      const area = this.areaSelect.value;

      if (q) this.fetchSearch(q); // sök på namn
      else if (area) this.fetchArea(area); // filtrera på område
      else this.fetchAllRecipes(); // hämta alla recept
    });

    // Stänger modalen när användaren trycker på X
    this.querySelector(".close-btn").addEventListener("click", () => {
      this.modal.style.display = "none";
    });
  }

  async loadAreas() {
    // Hämtar lista över områden (länder där recepten kommer ifrån)
    const r = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    const d = await r.json();
    // Fyller dropdown med områden
    d.meals.forEach((a) => {
      this.areaSelect.innerHTML += `<option value="${a.strArea}">${a.strArea}</option>`;
    });
  }

  async fetchAllRecipes() {
    this.container.innerHTML = "<p>Loading...</p>";
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");
    let all = [];

    // Hämtar recept för alla bokstäver och bygger en lista
    for (const l of letters) {
      const r = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${l}`
      );
      const d = await r.json();
      if (d.meals) all.push(...d.meals); // lägger till recepten om de finns
    }
    // Visar resultatet
    this.displayRecipes(all);
  }

  async fetchSearch(q) {
    // Hämtar recept baserat på användarens sökterm
    const r = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`
    );
    const d = await r.json();
    // Visar resultatet
    this.displayRecipes(d.meals);
  }

  async fetchArea(a) {
    // Hämtar recept baserat på land
    const r = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${a}`
    );
    const d = await r.json();
    this.displayRecipes(d.meals);
  }

  displayRecipes(meals) {
    // Rensar container
    this.container.innerHTML = "";
    // Om inga recept hittades

    if (!meals) {
      this.container.innerHTML = "<p>No recipe found.</p>";
      return;
    }
    // Skapar ett kort (card) för varje recept
    meals.forEach((meal) => {
      const card = document.createElement("div");
      card.className = "recipe-card";
      // Visuell presentation av receptet
      card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h4>${meal.strMeal}</h4>
      `;
      // Klickar man på ett kort visas detaljer i en modal
      card.addEventListener("click", () => this.showDetails(meal.idMeal));
      this.container.appendChild(card);
    });
  }

  async showDetails(id) {
    // Hämtar detaljerat recept baserat på ID
    const r = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const d = await r.json();
    const meal = d.meals[0];
    // Samlar ihop ingredienser och mått
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const m = meal[`strMeasure${i}`];
      if (ing) ingredients.push(`<li>${ing} - ${m}</li>`);
    }
    // Skriver ut allt i modalen
    this.modalContent.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" style="width:100%;border-radius:8px;">
      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Area:</strong> ${meal.strArea}</p>
      <h3>Ingredients:</h3>
      <ul>${ingredients.join("")}</ul>
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    `;

    this.modal.style.display = "flex";
  }
}
// Registrerar web component så den kan användas som <recipe-widget>
customElements.define("recipe-widget", RecipeWidget);
