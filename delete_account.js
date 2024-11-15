document.addEventListener("DOMContentLoaded", function () {
    loadAccountInfo();
    document.getElementById("delete-account-btn").addEventListener("click", confirmDeleteAccount);
});

// Load user's account info
function loadAccountInfo() {
    const loggedInUsername = localStorage.getItem("loggedInUsername");

    if (!loggedInUsername) {
        alert("You must be logged in to access this page.");
        window.location.href = "login.html";
        return;
    }

    const accounts = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = accounts.find(acc => acc.username === loggedInUsername);

    if (currentUser) {
        document.getElementById("username-display").textContent = currentUser.username;
        document.getElementById("email-display").textContent = currentUser.email;
    } else {
        alert("Account not found.");
        window.location.href = "login.html";
    }
}

// Confirm account deletion
function confirmDeleteAccount() {
    const loggedInUsername = localStorage.getItem("loggedInUsername");

    if (!loggedInUsername) {
        alert("You must be logged in to delete your account.");
        window.location.href = "login.html";
        return;
    }

    // Ask for confirmation before deleting the account
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        deleteAccount(loggedInUsername);
    }
}

// Delete account and associated posts, comments, and replies
function deleteAccount(username) {
    // Retrieve accounts and posts from localStorage
    let accounts = JSON.parse(localStorage.getItem("users")) || [];
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    // Find the current user
    const currentUser = accounts.find(acc => acc.username === username);

    if (currentUser) {
        // Remove user from accounts
        accounts = accounts.filter(acc => acc.username !== username);

        // Remove posts, comments, and replies made by the user
        posts = posts.filter(post => {
            return post.username !== username;
        }).map(post => {
            post.comments = post.comments.filter(comment => {
                return comment.username !== username;
            }).map(comment => {
                comment.replies = comment.replies.filter(reply => {
                    return reply.username !== username;
                });
                return comment;
            });
            return post;
        });

        // Save the updated accounts and posts back to localStorage
        localStorage.setItem("users", JSON.stringify(accounts));
        localStorage.setItem("posts", JSON.stringify(posts));

        // Clear logged-in username and redirect to the login page
        localStorage.removeItem("loggedInUsername");

        alert("Your account has been deleted successfully.");
        window.location.href = "login.html"; // Redirect to login page after deletion
    } else {
        alert("Account not found. Please log in again.");
        window.location.href = "login.html";
    }
}
