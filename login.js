function validateLogin() {
    let username = document.getElementById('login-username').value;
    let password = document.getElementById('login-password').value;

    // Elements for showing error messages
    let usernameError = document.getElementById('username-error');
    let passwordError = document.getElementById('password-error');

    // Clear previous error messages
    usernameError.textContent = '';
    passwordError.textContent = '';

    // Retrieve users from local storage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Debugging: Log the users to check data
    console.log("Users in localStorage:", users);

    // Check if user exists
    let user = users.find(user => user.username === username);
    if (!user) {
        usernameError.textContent = 'Username does not exist.';
        return false;
    }

    // Check if password matches
    if (user.password !== password) {
        passwordError.textContent = 'Incorrect password.';
        return false;
    }

    // Save the login state to localStorage
    localStorage.setItem('loggedInUsername', username);

    // Debugging: Log to confirm username is saved
    console.log("Logged in username set:", username);

    // If successful login, redirect to homepage
    window.location.href = 'homepage.html';
    return false;
}
