import { useState } from 'react';
import Places from './Places.jsx';
import { useEffect } from 'react';

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // 비동기 업데이트에 시간이 걸리므로, 
  // 빈배열에 set하는 것으로 요청 데이터를 담아야 한다.
  // set함수는 무한 루프를 야기할 수 있으니 useEffect에 정의.
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      const response = await fetch('http://localhost:3000/places');
      const resData = await response.json();

      setAvailablePlaces(resData.places);
      setIsFetching(false);
    }

    fetchPlaces();
  }, []);

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
