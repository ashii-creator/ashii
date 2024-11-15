// Retrieve the post index from the URL
const urlParams = new URLSearchParams(window.location.search);
const postIndex = urlParams.get('postIndex');

function loadPost() {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let post = posts[postIndex];
    let postContainer = document.getElementById('post-container');

    // Display the selected post at the top of the page
    let postDiv = document.createElement('div');
    postDiv.classList.add('post');

    let postUsername = document.createElement('h3');
    postUsername.textContent = post.username;

    let postContent = document.createElement('p');
    postContent.textContent = post.content;

    let postTimestamp = document.createElement('small');
    postTimestamp.textContent = post.timestamp;

    // Delete button for the post (only visible to the post creator)
    let postDeleteButton = document.createElement('button');
    postDeleteButton.textContent = '🗑️'; // Delete icon

    // Check if the logged-in user is the post creator
    let loggedInUsername = localStorage.getItem('loggedInUsername');
    if (loggedInUsername === post.username) {
        postDeleteButton.onclick = function() { deletePost(postIndex); };
    } else {
        postDeleteButton.disabled = true; // Disable button for others
    }

    postDiv.append(postUsername, postContent, postTimestamp, postDeleteButton);
    postContainer.appendChild(postDiv);

    loadComments(post);
}


function loadComments(post) {
    let commentContainer = document.getElementById('comment-container');
    commentContainer.innerHTML = '';  // Clear previous comments

    post.comments = post.comments || [];
    post.comments.forEach((comment, commentIndex) => {
        let commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        
        // Create comment content
        let commentContent = document.createElement('p');

        // Make the commenter's username clickable
        let commentUsername = document.createElement('a');
        commentUsername.href = `profile.html?username=${comment.username}`; // Link to profile page
        commentUsername.textContent = `${comment.username}: `;
        commentUsername.classList.add('username'); // Add class to style it
        commentContent.appendChild(commentUsername);

        // Add the rest of the comment content
        let commentText = document.createElement('span');
        commentText.textContent = comment.content;
        commentContent.appendChild(commentText);

        commentDiv.appendChild(commentContent);

        // Delete button for the comment
        let commentDeleteButton = document.createElement('button');
        commentDeleteButton.textContent = '🗑️'; // Delete icon
        commentDeleteButton.onclick = function() { deleteComment(postIndex, commentIndex); };

        // Append the comment and delete button
        commentDiv.appendChild(commentDeleteButton);
        commentContainer.appendChild(commentDiv);

        // Display replies for each comment
        let repliesDiv = document.createElement('div');
        repliesDiv.classList.add('replies');
        comment.replies = comment.replies || [];
        comment.replies.forEach((reply, replyIndex) => {
            let replyDiv = document.createElement('div');
            replyDiv.classList.add('reply');

            // Create reply content
            let replyContent = document.createElement('p');

            // Make the reply user's username clickable
            let replyUsername = document.createElement('a');
            replyUsername.href = `profile.html?username=${reply.username}`; // Link to profile page
            replyUsername.textContent = `${reply.username}: `;
            replyUsername.classList.add('username'); // Add class to style it
            replyContent.appendChild(replyUsername);

            // Add the rest of the reply content
            let replyText = document.createElement('span');
            replyText.textContent = reply.content;
            replyContent.appendChild(replyText);

            replyDiv.appendChild(replyContent);

            // Delete button for the reply
            let replyDeleteButton = document.createElement('button');
            replyDeleteButton.textContent = '🗑️'; // Delete icon
            replyDeleteButton.onclick = function() { deleteReply(postIndex, commentIndex, replyIndex); };

            // Append reply and delete button
            replyDiv.appendChild(replyDeleteButton);
            repliesDiv.appendChild(replyDiv);
        });
        commentContainer.appendChild(repliesDiv);

        // Reply input and button for each comment
        let replyInput = document.createElement('textarea');
        replyInput.placeholder = 'Write a reply...';
        replyInput.classList.add('reply-input');

        let replyButton = document.createElement('button');
        replyButton.textContent = 'Reply';
        replyButton.onclick = function() { postReply(commentIndex); };

        // Append reply input and button below each comment
        commentContainer.appendChild(replyInput);
        commentContainer.appendChild(replyButton);
    });
}


function postComment() {
    let commentInput = document.getElementById('comment-input');
    let commentContent = commentInput.value.trim();
    if (!commentContent) return;  // Prevent empty comments
    
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let username = localStorage.getItem('loggedInUsername');

    if (!username) {
        alert('You must be logged in to comment.');
        window.location.href = 'login.html';
        return;
    }

    let newComment = { username: username, content: commentContent, replies: [] };

    posts[postIndex].comments = posts[postIndex].comments || [];
    posts[postIndex].comments.push(newComment);

    // Save updated posts with new comment
    localStorage.setItem('posts', JSON.stringify(posts));

    // Clear the comment input field
    commentInput.value = '';

    // Refresh comments section
    loadComments(posts[postIndex]);
}

function postReply(commentIndex) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    let username = localStorage.getItem('loggedInUsername');

    if (!username) {
        alert('You must be logged in to reply.');
        window.location.href = 'login.html';
        return;
    }

    let replyInputs = document.getElementsByClassName('reply-input');
    let replyContent = replyInputs[commentIndex].value.trim();

    if (!replyContent) return; // Prevent empty replies

    let newReply = { username: username, content: replyContent };

    posts[postIndex].comments[commentIndex].replies = posts[postIndex].comments[commentIndex].replies || [];
    posts[postIndex].comments[commentIndex].replies.push(newReply);

    // Save updated posts with new reply
    localStorage.setItem('posts', JSON.stringify(posts));

    // Clear the reply input field
    replyInputs[commentIndex].value = '';

    // Refresh comments section to show new reply
    loadComments(posts[postIndex]);
}

// Function to delete a post
function deletePost(postIndex) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.splice(postIndex, 1);  // Remove the post
    localStorage.setItem('posts', JSON.stringify(posts));

    // Redirect after post is deleted
    window.location.href = 'homepage.html';
}


// Function to delete a comment
function deleteComment(postIndex, commentIndex) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[postIndex].comments.splice(commentIndex, 1);  // Remove the comment
    localStorage.setItem('posts', JSON.stringify(posts));

    // Refresh comments section to reflect the changes
    loadComments(posts[postIndex]);
}

// Function to delete a reply
function deleteReply(postIndex, commentIndex, replyIndex) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[postIndex].comments[commentIndex].replies.splice(replyIndex, 1);  // Remove the reply
    localStorage.setItem('posts', JSON.stringify(posts));

    // Refresh comments section to reflect the changes
    loadComments(posts[postIndex]);
}

// Load the post and comments when the page loads
window.onload = loadPost;
