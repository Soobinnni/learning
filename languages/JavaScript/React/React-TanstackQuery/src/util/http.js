export async function fetchEvents({ signal, searchTerm }) {
    let url = 'http://localhost:3000/events'
    if (searchTerm) url += '?search=' + searchTerm
    const response = await fetch(url, { signal });

    // console.log(searchTerm) 쿼리 스트링에 전달된 게 없다면(select all) undefined

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the events');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { events } = await response.json();

    return events;
}