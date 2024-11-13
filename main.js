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
    fetch('https://backend-760143753690.us-central1.run.app/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: ""
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
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
    const numStars = 2000;

    function resizeCanvas() {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
        removeStars();
        createStars();
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            // Generate random angle and radius with decreasing density
            let angle = Math.random() * Math.PI * 2;
            let radius = Math.random() ** 2 * Math.max(starCanvas.width, starCanvas.height) / 4;

            // Convert polar to cartesian coordinates
            stars.push({
                x: starCanvas.width/2 + radius * Math.cos(angle),
                y: starCanvas.height/2 + radius * Math.sin(angle),
                base_size: Math.random() * 5.5,
                size: 0.0,
                alpha: Math.random() * 0.5
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
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        });
    }

    let mouseX = 0; // Initialize mouseX to track the X position of the mouse
    let mouseY = 0; // Initialize mouseY to track the Y position of the mouse

    function animateStars() {
        let mouseDistance = Math.sqrt((mouseX - starCanvas.width/2)**2 + (mouseY - starCanvas.height/2)**2);
        const speedFactor = Math.max(0, 1 - Math.abs(mouseDistance / (window.innerWidth/2))); // Speed peaks at center
        stars.forEach(star => {
            // Calculate distance from center and direction
            let centerX = starCanvas.width / 2;
            let centerY = starCanvas.height / 2;
            let dx = star.x - centerX;
            let dy = star.y - centerY;

            // Increase speed based on distance from center
            let distance = Math.sqrt(dx * dx + dy * dy);
            let speed = (distance / 50000) * (1 + 2 * speedFactor);

            // Update position
            star.x += dx * speed;
            star.y += dy * speed;

            // Scale size based on distance from center (closer to edges = bigger)
            let maxDistance = Math.sqrt((starCanvas.width/2)**2 + (starCanvas.height/2)**2);
            star.size = star.base_size * (distance / maxDistance) * 2;

            // Reset stars when they go off screen
            if (star.x < 0 || star.x > starCanvas.width ||
                star.y < 0 || star.y > starCanvas.height) {
                star.x = centerX + (Math.random() - 0.5) * 100;
                star.y = centerY + (Math.random() - 0.5) * 100;
                star.size = 0;
            }
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
        mouseX = e.clientX; // Update mouseX with the current X position of the mouse
        mouseY = e.clientY; // Update mouseY with the current Y position of the mouse
    });

    // Reset speed when switching windows
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        mouseY = 0; // Reset mouseY when the document is not visible
      }
    });
})();
