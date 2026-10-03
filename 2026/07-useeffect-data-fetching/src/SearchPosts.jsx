// try Hard 

import { useState, useEffect } from 'react';

function SearchPosts() {
  // What the user types.
  const [query, setQuery] = useState('');

  // Posts we get from the API.
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Wait 300ms before fetching.
    const timer = setTimeout(() => {
      async function fetchPosts() {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?title_like=${query}`
        );

        const data = await response.json();

        setPosts(data);
      }

      fetchPosts();
    }, 300);

    // Cleanup:
    // If query changes before 300ms,
    // cancel the old timer.
    return () => {
      clearTimeout(timer);
    };

  }, [query]);

  return (
    <div>
      <h2>Search Posts</h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
      />

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

export default SearchPosts;