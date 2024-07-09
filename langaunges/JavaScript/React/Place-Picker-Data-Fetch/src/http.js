export async function fetchAvailablePlaces() {
    const response = await fetch('http://localhost:3000/places');
    const resData = await response.json();

    // 에러 다루기
    if (!response.ok) { // !(200, 300) == 400, 500
      throw new Error('Failed to fetch places');
    }

    return resData.places;
}