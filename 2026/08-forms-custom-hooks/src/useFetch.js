//   try  medium 

import { useState, useEffect } from 'react';

export default function useFetch(url) {
  // Store the data from the API.
  const [data, setData] = useState(null);

  // true while we are waiting for the API.
  const [loading, setLoading] = useState(true);

  // Store an error message if something goes wrong.
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Start loading.
        setLoading(true);

        // Fetch data from the URL.
        const response = await fetch(url);

        // If the request failed, create an error.
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }

        // Convert JSON response to JavaScript data.
        const json = await response.json();

        // Save the data.
        setData(json);

      } catch (err) {
        // Save the error message.
        setError(err.message);

      } finally {
        // Stop loading.
        setLoading(false);
      }
    }

    fetchData();

  }, [url]);

  // Return everything the component needs.
  return {
    data,
    loading,
    error
  };
}