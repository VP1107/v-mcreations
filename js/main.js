// ==========================================
// Full-page Background Particle Animation
// ==========================================
(function () {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let codeSymbols = [];
    let mouse = { x: null, y: null };

    // Configuration - reduced for mobile performance
    const isMobile = window.innerWidth < 768;
    const config = {
        particleCount: isMobile ? 30 : 80,
        symbolCount: isMobile ? 5 : 15,
        particleColor: 'rgba(56, 189, 248, 0.5)',
        lineColor: 'rgba(56, 189, 248, 0.1)',
        symbolColor: 'rgba(56, 189, 248, 0.2)',
        maxDistance: isMobile ? 100 : 150,
        particleSpeed: 0.4,
        symbols: ['</', '/>', '{}', '()', '[]', '=>', '/*', '*/']
    };

    // Resize canvas to full window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * config.particleSpeed;
            this.speedY = (Math.random() - 0.5) * config.particleSpeed;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    this.x -= dx * 0.02;
                    this.y -= dy * 0.02;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = config.particleColor;
            ctx.fill();
        }
    }

    // Code Symbol class
    class CodeSymbol {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.symbol = config.symbols[Math.floor(Math.random() * config.symbols.length)];
            this.size = Math.random() * 14 + 12;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.angle = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 0.5;
        }

        update() {
            this.y += this.speedY;
            this.angle += this.rotationSpeed;

            // Wrap around
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle * Math.PI / 180);
            ctx.font = `${this.size}px 'Courier New', monospace`;
            ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
            ctx.textAlign = 'center';
            ctx.fillText(this.symbol, 0, 0);
            ctx.restore();
        }
    }

    // Draw connecting lines between particles
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.maxDistance) {
                    const opacity = 1 - (distance / config.maxDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    // Initialize particles and symbols
    function init() {
        particles = [];
        codeSymbols = [];

        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }

        for (let i = 0; i < config.symbolCount; i++) {
            codeSymbols.push(new CodeSymbol());
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw code symbols (background)
        codeSymbols.forEach(symbol => {
            symbol.update();
            symbol.draw();
        });

        // Draw connecting lines
        drawLines();

        // Draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Mouse events
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });

    // Start animation
    resizeCanvas();
    init();
    animate();
})();

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Scroll Reveal Animation logic
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-reveal').forEach(el => {
    observer.observe(el);
});

// FAQ Interactivity
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('open');
    });
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// Form Submission Handler
// ==========================================

// IMPORTANT: Replace this URL with your deployed Google Apps Script URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7n582w1jbsR500OhdMSM1Smh5z_sCuxBHgE0zNAA0wFGJFTgV3K7OgE9Kqap2Pk4heQ/exec';

// Form elements
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const notification = document.getElementById('form-notification');

// Show notification message
function showNotification(message, type) {
    notification.innerHTML = `
        <div class="notification-content">
            ${type === 'success' ? '✅ ' : '❌ '}${message}
            <button onclick="this.closest('.form-notification').classList.add('hidden')" 
                    style="margin-top: 15px; padding: 8px 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: white; cursor: pointer; display: block; margin-left: auto; margin-right: auto;">
                Close
            </button>
        </div>`;
    notification.className = `form-notification ${type}`;

    // Auto-hide after 8 seconds (longer since user can now close manually)
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 8000);
}

// Set button loading state
function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Sending...';
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Send Message';
    }
}

// Validate form data
function validateForm(data) {
    if (!data.name.trim()) {
        return { valid: false, message: 'Please enter your name.' };
    }
    if (!data.email.trim() || !data.email.includes('@')) {
        return { valid: false, message: 'Please enter a valid email address.' };
    }
    if (!data.mobile.trim() || data.mobile.replace(/[\s\-\+]/g, '').length < 10) {
        return { valid: false, message: 'Please enter a valid mobile number.' };
    }
    return { valid: true };
}

// Format timestamp in ISO format
function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Handle form submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect form data
        const formData = {
            timestamp: getTimestamp(),
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value || 'No message provided'
        };

        // Validate
        const validation = validateForm(formData);
        if (!validation.valid) {
            showNotification(validation.message, 'error');
            return;
        }

        // Check if Google Script URL is configured
        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            showNotification('Form system not configured yet. Please contact via WhatsApp or email.', 'error');
            return;
        }

        // Set loading state
        setLoading(true);

        try {
            // Send to Google Apps Script using form-urlencoded for reliable delivery
            const formBody = new URLSearchParams();
            formBody.append('timestamp', formData.timestamp);
            formBody.append('name', formData.name);
            formBody.append('email', formData.email);
            formBody.append('mobile', formData.mobile);
            formBody.append('service', formData.service);
            formBody.append('message', formData.message);

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Required for Google Apps Script
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody.toString()
            });

            // With no-cors mode, we can't read the response, but if no error is thrown, assume success
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Failed to send message. Please try WhatsApp or email instead.', 'error');
        } finally {
            setLoading(false);
        }
    });
}
