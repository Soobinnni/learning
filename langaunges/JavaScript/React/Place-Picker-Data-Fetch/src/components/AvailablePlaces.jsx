import { useState } from 'react';
import Places from './Places.jsx';
import { useEffect } from 'react';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const response = await fetch('http://localhost:3000/places');
        const resData = await response.json();

        // 에러 다루기
        if (!response.ok) { // !(200, 300) == 400, 500
          throw new Error('Failed to fetch places');
        }

        navigator.geolocation.getCurrentPosition((position)=>{
          const sortedPlaces = sortPlacesByDistance(
            resData.places, 
            position.coords.latitude,
            position.coords.longitude
          )
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        // error 객체를 state에 저장한다. setError(error);
        // message가 대체로 있지만, 없을 경우 대체 텍스트를 지정하여 저장한다.
        setError({
          message : error.message || "Could not fetch places, please try again later."
        });
        setIsFetching(false);
        
      }
    }
    fetchPlaces();
  }, []);

  if(error){
    return <Error 
              title="An error occurred!"
              message={error.message}
          />
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
