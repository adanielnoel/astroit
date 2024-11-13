// Move handleSubmit outside of the IIFE to make it globally accessible
window.handleSubmit = function(event) {
    event.preventDefault();

    const email = document.getElementById('emailInput').value;

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Option 1: Send to your backend API
    fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        alert('Thank you for signing up!');
        document.getElementById('emailForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error. Please try again.');
    });
};

// Your existing IIFE
(function () {
    // Star animation
    const starCanvas = document.createElement('canvas');
    starCanvas.id = 'stars';
    document.body.appendChild(starCanvas);
    const ctx = starCanvas.getContext('2d');
    let stars = [];
    const numStars = 100;

    function resizeCanvas() {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
        removeStars();
        createStars();
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                radius: Math.random() * 2.5,
                alpha: Math.random()
            });
        }
    }

    function removeStars() {
        stars = [];
    }

    function drawStars() {
        ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        });
    }

    let mouseY = 0; // Initialize mouseY to track the Y position of the mouse

    function animateStars() {
        const speedFactor = 1 - Math.abs((mouseY - window.innerHeight/2) / (window.innerHeight/2)); // Speed peaks at center
        stars.forEach(star => {
            star.x += 0.3 * (star.alpha + 0.5) * (1 + 4 * speedFactor); // Adjust horizontal speed
            star.y += 0.2 * (star.alpha + 0.5) * (1 + 4 * speedFactor); // Adjust vertical speed
            if (star.x < 0) star.x = starCanvas.width;
            if (star.x > starCanvas.width) star.x = 0;
            if (star.y < 0) star.y = starCanvas.height;
            if (star.y > starCanvas.height) star.y = 0;
        });
        drawStars();
        requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    createStars();
    animateStars();

    // Mouse movement effect
    document.addEventListener('mousemove', function (e) {
        mouseY = e.clientY; // Update mouseY with the current Y position of the mouse
    });

    // Reset speed when switching windows
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        mouseY = 0; // Reset mouseY when the document is not visible
      }
    });
})();
