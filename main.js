window.handleSubmit = function(event) {
    event.preventDefault();

    const email = document.getElementById('emailInput').value;

    // Basic email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Option 1: Send to your backend API
    fetch('https://astroit.io/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        // Create and show success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('signup-message', 'success');
        successMessage.textContent = 'Thank you for signing up!';

        // Insert after the form
        const form = document.getElementById('emailForm');
        form.parentNode.insertBefore(successMessage, form.nextSibling);

        // Reset form
        form.reset();

        setTimeout(() => {
            successMessage.remove();
        }, 4000);
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('signup-message', 'error');
        errorMessage.textContent = 'There was an error. Please try again.';
        // Insert after the form
        const form = document.getElementById('emailForm');
        form.parentNode.insertBefore(errorMessage, form.nextSibling);
        setTimeout(() => {
            errorMessage.remove();
        }, 4000);
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
        const speedFactor = Math.max(0, 1 - Math.abs(mouseDistance / (window.innerHeight/2))); // Speed peaks at center
        stars.forEach(star => {
            // Calculate distance from center and direction
            let centerX = starCanvas.width / 2;
            let centerY = starCanvas.height / 2;
            let dx = star.x - centerX;
            let dy = star.y - centerY;

            // Increase speed based on distance from center
            let distance = Math.sqrt(dx * dx + dy * dy);
            let speed = (distance / 80000) * (1 + 2 * speedFactor);

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

    let previousWidth = window.innerWidth;

    window.addEventListener('resize', () => {
        const currentWidth = window.innerWidth;
        if (currentWidth !== previousWidth) {
            previousWidth = currentWidth;
            resizeCanvas();
        }
    });

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
