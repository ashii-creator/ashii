window.onload = function () {
    let loggedInUsername = localStorage.getItem('loggedInUsername');

    if (!loggedInUsername) {
        // Redirect to the login page if the user is not logged in
        window.location.href = 'login.html';
        return;
    }

    displayFeed(); // Display the global feed
};

// Function to display the feed
function displayFeed() {
    let postsContainer = document.getElementById('posts-container');
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    postsContainer.innerHTML = ''; // Clear the container

    if (posts.length === 0) {
        let noPostsMessage = document.createElement('p');
        noPostsMessage.textContent = "No posts available.";
        postsContainer.appendChild(noPostsMessage);
        return;
    }

    // Display posts in reverse chronological order
    posts.reverse().forEach((post, index) => {
        let postDiv = document.createElement('div');
        postDiv.classList.add('post');

        let postUsername = document.createElement('a');
        postUsername.textContent = post.username;
        postUsername.href = `profile.html?username=${encodeURIComponent(post.username)}`;
        postUsername.classList.add('username-link');

        let postContent = document.createElement('p');
        postContent.textContent = post.content;

        let postTimestamp = document.createElement('small');
        postTimestamp.textContent = new Date(post.timestamp).toLocaleString();

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

        // Append elements
        postDiv.append(postUsername, postContent, postTimestamp, likeButton, dislikeButton, commentButton);
        postsContainer.appendChild(postDiv);
    });
}

// Function to update likes and dislikes
function updateLikes(postIndex, action) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let username = localStorage.getItem('loggedInUsername');

    if (!username) {
        alert('You must be logged in to like or dislike a post.');
        window.location.href = 'login.html';
        return;
    }

    let post = posts[postIndex];
    post.likedBy = post.likedBy || [];
    post.dislikedBy = post.dislikedBy || [];

    if (action === 'like') {
        if (!post.likedBy.includes(username)) {
            post.likedBy.push(username);
            post.likes = (post.likes || 0) + 1;

            // Remove dislike if it exists
            if (post.dislikedBy.includes(username)) {
                post.dislikedBy = post.dislikedBy.filter(user => user !== username);
                post.dislikes = Math.max((post.dislikes || 0) - 1, 0);
            }
        } else {
            alert('You have already liked this post.');
        }
    } else if (action === 'dislike') {
        if (!post.dislikedBy.includes(username)) {
            post.dislikedBy.push(username);
            post.dislikes = (post.dislikes || 0) + 1;

            // Remove like if it exists
            if (post.likedBy.includes(username)) {
                post.likedBy = post.likedBy.filter(user => user !== username);
                post.likes = Math.max((post.likes || 0) - 1, 0);
            }
        } else {
            alert('You have already disliked this post.');
        }
    }

    localStorage.setItem('posts', JSON.stringify(posts));
    displayFeed(); // Refresh the feed
}

// Function to create a post
function createPost() {
    let loggedInUsername = localStorage.getItem('loggedInUsername');

    if (!loggedInUsername) {
        alert('You must be logged in to create a post.');
        window.location.href = 'login.html';
        return;
    }

    let postContent = document.getElementById('post-content').value.trim();

    if (!postContent) {
        alert('Post content cannot be empty.');
        return;
    }

    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let newPost = {
        username: loggedInUsername,
        content: postContent,
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        comments: []
    };

    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));

    displayFeed(); // Refresh the feed
    document.getElementById('post-content').value = ''; // Clear input field
}
