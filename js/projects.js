const track = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".slider img");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let index = 0;

function updateSlider() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

nextBtn.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  updateSlider();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  updateSlider();
});

window.addEventListener("DOMContentLoaded", () => {
  const introProjects = document.getElementById("intro-projects");
  introProjects.classList.add("show");
});
