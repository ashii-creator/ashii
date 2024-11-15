document.addEventListener("DOMContentLoaded", function () {
    loadAccountInfo();
});

// Load user's account info
function loadAccountInfo() {
    const loggedInUsername = localStorage.getItem("loggedInUsername"); // Get logged-in username from localStorage
    console.log("Logged in username: ", loggedInUsername); // Debugging: Check if username is correctly stored

    if (!loggedInUsername) {
        // If no username is found in localStorage, redirect to login page
        alert("You must be logged in to access this page.");
        window.location.href = "login.html";
        return;
    }

    const accounts = JSON.parse(localStorage.getItem("users")) || [];
    console.log("Accounts in localStorage: ", accounts); // Debugging: Check if accounts array is correctly populated

    // Ensure accounts array is populated and contains objects with usernames
    if (accounts.length === 0) {
        alert("No accounts found. Please log in.");
        window.location.href = "login.html";
        return;
    }

    // Find the current user by the logged-in username
    const currentUser = accounts.find(acc => acc.username === loggedInUsername);

    console.log("Current user: ", currentUser); // Debugging: Check if the current user is found correctly

    // If the user is found, display their account info
    if (currentUser) {
        document.getElementById("username-input").value = currentUser.username;
        document.getElementById("email-display").textContent = currentUser.email;

        // Display profile and background images if they exist
        if (currentUser.profileImage) {
            document.getElementById("profile-img").src = currentUser.profileImage;
        }
        if (currentUser.backgroundImage) {
            document.getElementById("background-img").src = currentUser.backgroundImage;
        }
    } else {
        alert("Account not found. Please log in again.");
        window.location.href = "login.html"; // If no account found, redirect to login page
    }
}

// Save updated account information (username only when explicitly saved)
function saveAccountInfo() {
    const newUsername = document.getElementById("username-input").value.trim();
    if (!newUsername) {
        alert("Username cannot be empty.");
        return;
    }

    const loggedInUsername = localStorage.getItem("loggedInUsername");
    let accounts = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = accounts.find(acc => acc.username === loggedInUsername);

    console.log("Saving account info for: ", currentUser); // Debugging: Log the current user to check if the object is found

    if (currentUser) {
        const oldUsername = currentUser.username;

        // Only update the username if it has changed
        if (newUsername !== oldUsername) {
            currentUser.username = newUsername;

            // Update posts, comments, and replies with the new username
            let posts = JSON.parse(localStorage.getItem("posts")) || [];
            posts = posts.map(post => {
                if (post.username === oldUsername) post.username = newUsername;
                post.comments = post.comments.map(comment => {
                    if (comment.username === oldUsername) comment.username = newUsername;
                    comment.replies = comment.replies.map(reply => {
                        if (reply.username === oldUsername) reply.username = newUsername;
                        return reply;
                    });
                    return comment;
                });
                return post;
            });

            localStorage.setItem("posts", JSON.stringify(posts));

            // Update accounts and localStorage
            localStorage.setItem("users", JSON.stringify(accounts));
            localStorage.setItem("loggedInUsername", newUsername);
            alert("Account information updated successfully!");
        } else {
            alert("No changes made to the username.");
        }
    } else {
        alert("Unable to find your account.");
    }
}

// Save profile image
function saveProfileImage() {
    const profileInput = document.getElementById("profile-img-input");
    const reader = new FileReader();

    reader.onload = function () {
        const loggedInUsername = localStorage.getItem("loggedInUsername");
        let accounts = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = accounts.find(acc => acc.username === loggedInUsername);

        if (currentUser) {
            currentUser.profileImage = reader.result;
            localStorage.setItem("users", JSON.stringify(accounts));
            alert("Profile image updated successfully!");
        }
    };

    if (profileInput.files[0]) reader.readAsDataURL(profileInput.files[0]);
}

// Save background image
function saveBackgroundImage() {
    const backgroundInput = document.getElementById("background-img-input");
    const reader = new FileReader();

    reader.onload = function () {
        const loggedInUsername = localStorage.getItem("loggedInUsername");
        let accounts = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = accounts.find(acc => acc.username === loggedInUsername);

        if (currentUser) {
            currentUser.backgroundImage = reader.result;
            localStorage.setItem("users", JSON.stringify(accounts));
            alert("Background image updated successfully!");
        }
    };

    if (backgroundInput.files[0]) reader.readAsDataURL(backgroundInput.files[0]);
}
