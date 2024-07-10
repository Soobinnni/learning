import { useFetch } from '../hooks/useFetch.js';

import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

async function fetchSortedPlaces() {

  /* fetchSortedPlaces 정의
   * 1. fetch한 데이터를 set할 뿐만 아니라 AvailablePlaces 컴포넌트는
        사용자 위치 기반의 거리순 정렬이 필요함
     2. 따라서, useFetch에 함수 인자를 전달할 때 함수에 정렬 로직도 포함하기 위해
        새 함수(fetchSortedPlaces)를 정의
     3. places를 비동기적으로 받아오고, Promise를 반환.
   */

  const places = await fetchAvailablePlaces();

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        position.coords.latitude,
        position.coords.longitude
      )

      resolve(sortedPlaces);
    });

  });
}


export default function AvailablePlaces({ onSelectPlace }) {
  const {
    error,
    fetchedData: availablePlaces,
    isFetching
  } = useFetch(fetchSortedPlaces, []);

  if (error) {
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
