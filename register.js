// Simple client-side validation
function validateRegister() {
    let email = document.getElementById('email').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;

    // Get error display elements
    let emailError = document.getElementById('email-error');
    let usernameError = document.getElementById('username-error');
    let passwordError = document.getElementById('password-error');
    let confirmPasswordError = document.getElementById('confirm-password-error');

    // Clear previous error messages
    emailError.textContent = '';
    usernameError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';

    // Validate password length
    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters!';
        return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match!';
        return false;
    }

    // Simple email validation
    let emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
    if (!email.match(emailPattern)) {
        emailError.textContent = 'Invalid email format!';
        return false;
    }

    // Load users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email or username is already taken
    let emailExists = users.some(user => user.email === email);
    let usernameExists = users.some(user => user.username === username);

    // Check if email exists in the deleted list
    let deletedAccounts = JSON.parse(localStorage.getItem('deletedAccounts')) || [];
    let emailInDeleted = deletedAccounts.some(account => account.email === email);

    if (emailExists && !emailInDeleted) {
        emailError.textContent = 'Email is already in use!';
        return false;
    }

    if (usernameExists) {
        usernameError.textContent = 'Username is already taken!';
        return false;
    }

    // If email was deleted, allow reuse
    if (emailInDeleted) {
        deletedAccounts = deletedAccounts.filter(account => account.email !== email);
        localStorage.setItem('deletedAccounts', JSON.stringify(deletedAccounts));
    }

    // Save new user with an empty bio
    users.push({ email, username, password, bio: '' });
    localStorage.setItem('users', JSON.stringify(users));

    // Save new account details
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    let newAccount = {
        username: username,
        email: email,
        profileImage: 'default-profile.jpg',
        backgroundImage: 'default-background.jpg'
    };
    accounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(accounts));

    // Redirect to the login page after successful registration
    alert('Registration successful!');
    window.location.href = 'login.html';  // Redirect to login page
    return false;
}
