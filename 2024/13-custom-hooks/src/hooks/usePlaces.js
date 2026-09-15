import { useState, useEffect } from 'react';

const usePlaces = (fetcher) => {
  const [places, setPlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetcher();
        setPlaces(places);
      } catch (error) {
        setError({ message: error.message || 'Failed to fetch user places.' });
      } finally {
        setIsFetching(false);
      }
    }

    fetchPlaces();
  }, []);

  return { places, isFetching, error, setPlaces, setIsFetching, setError };
};

export default usePlaces;