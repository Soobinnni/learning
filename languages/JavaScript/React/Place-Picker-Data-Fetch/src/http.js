const origin = 'http://localhost:3000';
export async function fetchAvailablePlaces() {
    const response = await fetch(`${origin}/places`);
    const resData = await response.json();

    if (!response.ok) { // !(200, 300) == 400, 500
      throw new Error('Failed to fetch places');
    }

    return resData.places;
}
export async function fetchUserPlaces() {
    const response = await fetch(`${origin}/user-places`);
    const resData = await response.json();

    if (!response.ok) { // !(200, 300) == 400, 500
      throw new Error('Failed to fetch places');
    }

    return resData.places;
}

export async function updateUserPlaces(places) {
    const response = await fetch(`${origin}/user-places`,{
        method: 'PUT',
        body: JSON.stringify({ places }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const resData = await response.json();

    if(!response.ok) {
        throw new Error('Failed to update user data.');
    }

    return resData.message;
}