// profile.js

let loggedInUsername = localStorage.getItem('loggedInUsername');

if (!loggedInUsername) {
    alert('You must be logged in to view your profile.');
    window.location.href = 'login.html';  // Redirect to login page if not logged in
}

function loadProfile() {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let userPosts = posts.filter(post => post.username === loggedInUsername);

    // Get the user's profile data from localStorage
    let profilePicture = localStorage.getItem('profilePicture') || 'default-profile-pic.jpg';
    let profileBackground = localStorage.getItem('profileBackground') || 'default-background.jpg';
    let userBio = localStorage.getItem('bio') || 'This is your bio. You can edit it below.';

    // Load profile picture
    let profileImg = document.getElementById('profile-img');
    profileImg.src = profilePicture;

    // Load background image
    let backgroundImg = document.getElementById('background-img');
    backgroundImg.src = profileBackground;

    // Load username
    let usernameElement = document.getElementById('username');
    usernameElement.textContent = loggedInUsername;

    // Load bio
    let bioElement = document.getElementById('bio');
    bioElement.textContent = userBio;

    // Show bio editing functionality
    let editBioBtn = document.getElementById('edit-bio-btn');
    let bioInput = document.getElementById('bio-input');
    let saveBioBtn = document.getElementById('save-bio-btn');

    editBioBtn.onclick = function () {
        bioInput.style.display = 'block';
        saveBioBtn.style.display = 'inline-block';
        bioInput.value = bioElement.textContent;
        bioElement.style.display = 'none';
        editBioBtn.style.display = 'none';
    };

    saveBioBtn.onclick = function () {
        let newBio = bioInput.value.trim();
        if (newBio) {
            localStorage.setItem('bio', newBio);  // Save the new bio in localStorage
            bioElement.textContent = newBio;  // Update the bio in the profile page
            bioInput.style.display = 'none';
            saveBioBtn.style.display = 'none';
            bioElement.style.display = 'block';
            editBioBtn.style.display = 'inline-block';
        }
    };

    // Display posts created by the current user
    let postsList = document.getElementById('posts-list');
    if (userPosts.length === 0) {
        postsList.innerHTML = '<p>You haven\'t posted anything yet.</p>';
    } else {
        userPosts.forEach(post => {
            let postDiv = document.createElement('div');
            postDiv.classList.add('post');
            postDiv.innerHTML = `
                <h4>${post.username}</h4>
                <p>${post.content}</p>
                <small>${post.timestamp}</small>
                <button class="delete-post-btn">Delete Post</button>
            `;
            
            // Delete Post Button
            let deletePostBtn = postDiv.querySelector('.delete-post-btn');
            deletePostBtn.onclick = function () {
                deletePost(post);
            };

            postsList.appendChild(postDiv);
        });
    }
}

// Function to delete a post
function deletePost(postToDelete) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let updatedPosts = posts.filter(post => post !== postToDelete);

    // Save the updated posts in localStorage
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    // Reload the profile to reflect the changes
    loadProfile();
}

// Handle profile image upload
document.getElementById('upload-profile-btn').onclick = function() {
    document.getElementById('profile-img-input').click();
};

document.getElementById('profile-img-input').onchange = function(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let imageUrl = e.target.result;
            localStorage.setItem('profilePicture', imageUrl); // Save image URL in localStorage
            document.getElementById('profile-img').src = imageUrl;  // Update profile image
        };
        reader.readAsDataURL(file);
    }
};

// Handle background image upload
document.getElementById('upload-background-btn').onclick = function() {
    document.getElementById('background-img-input').click();
};

document.getElementById('background-img-input').onchange = function(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let imageUrl = e.target.result;
            localStorage.setItem('profileBackground', imageUrl); // Save background image URL in localStorage
            document.getElementById('background-img').src = imageUrl;  // Update background image
        };
        reader.readAsDataURL(file);
    }
};

// Save the bio when the user updates it
function saveBio() {
    let loggedInUsername = localStorage.getItem('loggedInUsername');

    if (!loggedInUsername) {
        alert('You must be logged in to update your bio.');
        window.location.href = 'login.html';
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(user => user.username === loggedInUsername);

    if (user) {
        // Get the updated bio value
        let updatedBio = document.getElementById('bio').value.trim();

        // Update the bio of the logged-in user
        user.bio = updatedBio;

        // Save updated users array back to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        alert('Bio updated successfully!');
    } else {
        alert('User not found.');
    }
}

// Load profile data when the page loads
window.onload = loadProfile;
