const randombtn = document.querySelector(".random-btn");

async function loadRandomRecipe() {
  try {
    // Hämtar ett slumpmässigt recept från TheMealDB API
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );

    // Omvandlar API-svaret till JSON
    const data = await res.json();
    // MealDB returnerar recept i en array, vi tar det första
    const meal = data.meals[0];
    // Samlar alla ingredienser och mått i en lista
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      // Om ingrediensen inte är tom läggs den till listan
      if (ingredient) ingredients.push(`${ingredient} - ${measure}`);
    }

    // Skapar HTML som visar receptets information
    const randomRecipeHTML = `
    <div class="random-recipe-container">
      <div class="recipe-info">
        <h3>${meal.strMeal}</h3>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3><strong>Category:</strong> ${meal.strCategory}</h3>
        <h3><strong>Origin:</strong> ${meal.strArea}</h3>
        <h3>Ingridients:</h3>
        <ul>${ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
        <h4>Instructions:</h4>
        <p>${meal.strInstructions}</p>
      </div>
    </div>
  `;
    // Lägger in HTML:en i sidan så att receptet visas för användaren
    document.getElementById("random-recipe-container").innerHTML =
      randomRecipeHTML;
  } catch (error) {
    // Om något går fel vid API-anropet fångas felet här
    console.error("Failed to load Random recipe:", error);
  }
}
// Laddar ett slumpmässigt recept direkt när sidan öppnas
document.addEventListener("DOMContentLoaded", loadRandomRecipe);

// Laddar ett nytt recept varje gång användaren klickar på knappen
randombtn.addEventListener("click", loadRandomRecipe);
