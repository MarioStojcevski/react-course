//   TRY   Medium 

import { useState, useEffect } from 'react';

function UserPosts() {
  // Stores the selected user ID.
  const [userId, setUserId] = useState(1);

  // Stores posts for that user.
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchUserPosts() {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      );

      const data = await response.json();

      setPosts(data);
    }

    fetchUserPosts();
  }, [userId]);

  return (
    <div>
      <h2>User Posts</h2>

      <label>
        Choose user:
      </label>

      <select
      // Секогаш кога userId ќе се смени, пушти го effect-от повторно.
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      >
        <option value="1">User 1</option>
        <option value="2">User 2</option>
        <option value="3">User 3</option>
        <option value="4">User 4</option>
        <option value="5">User 5</option>
      </select>

      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPosts;