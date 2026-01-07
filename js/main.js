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
    notification.innerHTML = `<div class="notification-content">${type === 'success' ? '✅ ' : '❌ '}${message}</div>`;
    notification.className = `form-notification ${type}`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
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
