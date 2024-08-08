const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const signupLink = document.getElementById('signup-link');
const loginSubmitButton = document.getElementById('login-submit');
const signupSubmitButton = document.getElementById('signup-submit');
const emailInput = document.getElementById('email');
const emailSignupInput = document.getElementById('email-signup');

// Function to check email validity
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Enable/disable login submit button based on email validity
emailInput.addEventListener('input', () => {
    loginSubmitButton.disabled = !validateEmail(emailInput.value);
});

// Enable/disable signup submit button based on email validity
emailSignupInput.addEventListener('input', () => {
    signupSubmitButton.disabled = !validateEmail(emailSignupInput.value);
});

signupLink.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = emailInput.value;
    const password = document.getElementById('password').value;

    // API call
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        // Handle the API response
        window.location.href = 'http://localhost:6678/profile';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = emailSignupInput.value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // API call
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        // Handle the API response
        window.location.href = 'http://localhost:6678/profile';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

const logoutLink = document.getElementById('logout-link');
logoutLink.addEventListener('click', () => {
    // Call logout API here
    console.log('Logout link clicked');
});
