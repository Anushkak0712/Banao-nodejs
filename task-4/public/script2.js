// Function to fetch user data
async function fetchUserData() {
    try {
      const response = await fetch('/getuser');
      if (!response.ok) {
        throw new Error('Failed to load user data');
      }
  
      const user = await response.json(); // Store the user data in a variable
      return user;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null; // Handle errors appropriately
    }
  }
  
  // Main function to handle socket connection and user room joining
  async function main() {
    const socket = io('http://localhost:6678');
  
    socket.on('connect', async () => {
      console.log('Connected to server');
  
      // Fetch user data and join the room
      const user = await fetchUserData();
      if (user) {
        console.log("User:", user);
        socket.emit('joinRoom', user); // Use the username to join the room
      }
    });
  
    // Set up the alert listener
    socket.on('alert', (message) => {
      console.log('Received alert:', message);
      displayNotification(message);
    });
  }
  function displayNotification(message) {
    const notificationsDiv = document.getElementById('notifications');
    const notificationElement = document.createElement('div');
    notificationElement.className = 'notification';
    notificationElement.innerText = message;
    notificationsDiv.appendChild(notificationElement);
}
document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');
    
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            
            // Call the logout API
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to log out');
                }
                return response.json();
            })
            .then(() => {
                // Redirect to the index page after successful logout
                window.location.href = '/';
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            });
        });
    }
});

const createAlert = document.getElementById('create-alert');
createAlert.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Get the input values
    const cryptoInput = document.getElementById('crypto');
    const targetPriceInput = document.getElementById('targetPrice');
    const directionInput = document.getElementById('direction');
    
    const crypto = cryptoInput.value;
    const targetPrice = targetPriceInput.value;
    const direction = directionInput.value;

    // Make the API call
    console.log('fetching');
    fetch('/api/alerts/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ crypto, targetPrice, direction })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create alert');
        }
        return response.json();
    })
    .then(() => {
        // Handle the API response
        console.log("Added alert");

        // Clear the input fields
        cryptoInput.value = '';
        targetPriceInput.value = '';
        directionInput.value = '';
        
        // Optionally redirect or provide user feedback
        // window.location.href = 'http://localhost:6678/profile';
    })
    .catch(error => {
        // Handle any errors
        console.error('Error:', error);
    });
});

  
  // Call the main function to execute the logic
  main();
  