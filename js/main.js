document.addEventListener("DOMContentLoaded", () => {
    // Text to be displayed
    const introText = "Hi, I'm Anna Granberg!";
    
    const introElement = document.querySelector(".intro-text h1");
    
    // Index for current character
    let index = 0;

    // Function to create the typing effect
    function typeEffect() {
        // Check if there are more characters to display
        if (index < introText.length) {
            // Append current character to the text content
            introElement.textContent += introText[index];

            index++;
            // delay of 100ms
            setTimeout(typeEffect, 100);
        }
    }

    // Start the typing effect if the target element exists
    if (introElement) {
        typeEffect();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro');
    intro.classList.add('show');  // triggers the transition
  });


