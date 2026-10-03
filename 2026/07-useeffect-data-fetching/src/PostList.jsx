//  Try easy 

import { useState, useEffect } from 'react';

function PostList() {
  // Stores all posts from the API.
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/posts'
      );

      const data = await response.json();

      setPosts(data);
    }

    fetchPosts();
  }, []);

  // posts.slice(0, 5) земи ги елементите од позиција 0 до 4
  // .map(post => (  - прави по еден <li> за секој од тие 5 posts.
  return (
    <div>
      <h2>First 5 Posts</h2>

      <ul>
        {posts.slice(0, 5).map(post => (
          <li key={post.id}>
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;