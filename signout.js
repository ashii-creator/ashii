function signOut() {
    // Clear session data or authentication token if necessary
    localStorage.removeItem('loggedInUsername'); // Example: remove username from localStorage

    // Redirect to the login page
    window.location.href = 'login.html';
}
