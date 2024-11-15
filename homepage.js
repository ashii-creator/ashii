window.onload = function () {
    let loggedInUsername = localStorage.getItem('loggedInUsername');

    if (!loggedInUsername) {
        // Redirect to the login page if the user is not logged in
        window.location.href = 'login.html';
        return;
    }

    // Proceed to load posts or allow post creation since user is logged in
    displayPosts();
};

// Function to display posts on the homepage
function displayPosts() {
    let postsContainer = document.getElementById('posts-container');
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    postsContainer.innerHTML = '';

    // If no posts exist, show a message
    if (posts.length === 0) {
        let noPostsMessage = document.createElement('p');
        noPostsMessage.textContent = "No posts available.";
        postsContainer.appendChild(noPostsMessage);
        return;
    }

    posts.forEach((post, index) => {
        let postDiv = document.createElement('div');
        postDiv.classList.add('post');

        // Create a clickable link for the username
        let postUsername = document.createElement('a');
        postUsername.textContent = post.username;
        postUsername.href = '#'; // Prevent default behavior
        postUsername.classList.add('username-link');
        postUsername.dataset.username = post.username; // Store username in the data attribute

        postUsername.onclick = function (event) {
            event.preventDefault();
            navigateToProfile(post.username);
        };

        let postContent = document.createElement('p');
        postContent.textContent = post.content;

        let postTimestamp = document.createElement('small');
        postTimestamp.textContent = post.timestamp;

        let likeButton = document.createElement('button');
        likeButton.textContent = `Like (${post.likes || 0})`;
        likeButton.onclick = function () { updateLikes(index, 'like'); };

        let dislikeButton = document.createElement('button');
        dislikeButton.textContent = `Dislike (${post.dislikes || 0})`;
        dislikeButton.onclick = function () { updateLikes(index, 'dislike'); };

        let commentButton = document.createElement('button');
        commentButton.textContent = 'Comment';
        commentButton.onclick = function () {
            window.location.href = `comment_section.html?postIndex=${index}`;
        };

        postDiv.append(postUsername, postContent, postTimestamp, likeButton, dislikeButton, commentButton);
        postsContainer.appendChild(postDiv);
    });
}

// Function to navigate to the correct profile page
function navigateToProfile(username) {
    const loggedInUsername = localStorage.getItem('loggedInUsername');

    if (username === loggedInUsername) {
        // Redirect to the logged-in user's profile page
        window.location.href = 'my_profile.html';
    } else {
        // Save the username to localStorage and redirect to the public profile page
        localStorage.setItem('viewedUsername', username);
        window.location.href = 'profile.html';
    }
}

// Function to update likes and dislikes for a post
function updateLikes(postIndex, action) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let username = localStorage.getItem('loggedInUsername');

    if (!username) {
        alert('You must be logged in to like or dislike a post.');
        window.location.href = 'login.html';
        return;
    }

    let post = posts[postIndex];
    post.likedBy = post.likedBy || []; // Array to track users who liked
    post.dislikedBy = post.dislikedBy || []; // Array to track users who disliked

    if (action === 'like') {
        // Handle liking
        if (!post.likedBy.includes(username)) {
            post.likedBy.push(username);
            post.likes = (post.likes || 0) + 1;

            if (post.dislikedBy.includes(username)) {
                post.dislikedBy = post.dislikedBy.filter(user => user !== username);
                post.dislikes = Math.max((post.dislikes || 0) - 1, 0);
            }
        } else {
            alert('You have already liked this post.');
        }
    } else if (action === 'dislike') {
        // Handle disliking
        if (!post.dislikedBy.includes(username)) {
            post.dislikedBy.push(username);
            post.dislikes = (post.dislikes || 0) + 1;

            if (post.likedBy.includes(username)) {
                post.likedBy = post.likedBy.filter(user => user !== username);
                post.likes = Math.max((post.likes || 0) - 1, 0);
            }
        } else {
            alert('You have already disliked this post.');
        }
    }

    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts(); // Refresh the posts
}

// Function to create a post
function createPost() {
    let loggedInUsername = localStorage.getItem('loggedInUsername');

    if (!loggedInUsername) {
        alert('You must be logged in to create a post.');
        window.location.href = 'login.html';
        return;
    }

    let postContent = document.getElementById('post-content').value;

    if (!postContent.trim()) {
        alert('Post content cannot be empty.');
        return;
    }

    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let newPost = {
        username: loggedInUsername,
        content: postContent,
        timestamp: new Date().toISOString(),
        comments: [],
        likes: 0,
        dislikes: 0
    };

    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
    document.getElementById('post-content').value = ''; // Clear the input field
}
