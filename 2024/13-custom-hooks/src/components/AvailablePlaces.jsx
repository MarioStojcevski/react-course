
import Places from './Places.jsx';
import Error from './Error.jsx';
import { fetchAvailablePlaces } from '../http.js';
import usePlaces from '../hooks/usePlaces.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const { places: availablePlaces, error, isFetching } = usePlaces(fetchAvailablePlaces);

  if (error) {
    return <Error title="An error occurred!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
