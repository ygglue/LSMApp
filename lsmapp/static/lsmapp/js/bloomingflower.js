document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const letterOverlay = document.getElementById("letter-overlay");
    const letterText = document.getElementById("letter-text");

    // Remove loading class to start CSS animations
    setTimeout(() => {
        body.classList.remove("not-loaded");
    }, 1000);

    // Fetch letter content
    fetch('/static/lsmapp/data/letter.json')
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                letterText.innerText = data.message;
                // Show overlay after a short delay to allow flower to start growing
                setTimeout(() => {
                    letterOverlay.classList.add("visible");
                }, 5000);
            }
        })
        .catch(err => console.error("Error loading letter:", err));
});
