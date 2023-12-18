import React, { useState, useEffect } from 'react';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from the backend or your API endpoint
    // Example: fetch('your_backend_posts_api_endpoint')
    //   .then(response => response.json())
    //   .then(data => setPosts(data))
    //   .catch(error => console.error('Error fetching posts:', error));

    // For the sake of this example, let's assume some dummy data
    const dummyPosts = [
      { id: 1, content: 'This is a post!', author: 'User1', timestamp: '2023-01-01T12:00:00' },
      { id: 2, content: 'Another post here.', author: 'User2', timestamp: '2023-01-02T14:30:00' },
      // Add more posts as needed
    ];

    setPosts(dummyPosts);
  }, []);

  return (
    <div>
      <h2>Social Media Feed</h2>
      {posts.map(post => (
        <div key={post.id} className="post">
          <p>{post.content}</p>
          <p>Author: {post.author}</p>
          <p>Timestamp: {post.timestamp}</p>
          {/* Add more details as needed, e.g., like, comment, and share buttons */}
        </div>
      ))}
    </div>
  );
};

export default Feed;