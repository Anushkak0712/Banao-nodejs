const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const signupLink = document.getElementById('signup-link');

signupLink.addEventListener('click', () => {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Here you would make your API call
  // For example, using fetch:
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
    // For example, if successful, you might redirect to a protected page
  })
  .catch(error => {
    // Handle any errors
    console.error('Error:', error);
  });
});

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Validation (optional, but recommended)
  if (password !== confirmPassword) {
    alert('Passwords do not match.');
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
    // Handle API response
    window.location.href = 'http://localhost:6678/profile'
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
/*
loginForm.addEventListener('submit', (e) => {
    // Call login API here
    console.log('Login form submitted');
});

signupForm.addEventListener('submit', (e) => {
    // Call signup API here
    console.log('Signup form submitted');
});
const logoutLink = document.getElementById('logout-link');

logoutLink.addEventListener('click', () => {
    // Call logout API here
    console.log('Logout link clicked');
});*/