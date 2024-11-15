function submitPost() {
    let postContent = document.getElementById('post-content').value;
    let username = localStorage.getItem('loggedInUsername');

    if (!username) {
        alert('You must be logged in to create a post.');
        window.location.href = 'login.html';  // Redirect to login page
        return false;
    }

    // Create a post object with likes, dislikes, and comments initialized
    let post = {
        username: username,
        content: postContent,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        dislikes: 0,
        comments: []  // Initialize an empty array for comments
    };

    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));

    // Debugging: Log the post data
    console.log('Post created and saved:', post);

    window.location.href = 'homepage.html';  // Redirect to homepage
    return false;
}
