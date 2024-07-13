import { json, useLoaderData, defer, Await, } from 'react-router-dom';

import EventsList from '../components/EventsList';
import { Suspense } from 'react';

function EventsPage() {
    // const data = useLoaderData();
    // const events = data.events;
    const { events } = useLoaderData();

    // return <EventsList events={events} />

    //  Suspense 컴포넌트는 다른 데이터가 도착하길 기다리는 동안에 폴백을 보여주는
    // 특정한 상황에서 사용한다.
    return (
        <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
            <Await resolve={events}>
                {
                    (loadedEvents) => <EventsList events={loadedEvents} />
                }
            </Await>
        </Suspense>

    )
}

export default EventsPage;

async function loadEvents() {
    const response = await fetch('http://localhost:8080/events');

    if (!response.ok) {
        throw json(
            { message: 'Could not fetch events.' },
            {
                status: 500,
            }
        );
    } else {
        // return response; loader함수 내에서는 자동으로 해결했지만 defer를 거치므로, 직접 parse해야 함
        const resData = await response.json();
        return resData.events;
    }
}
export async function loader() {
    // defer함수에 해당 페이지에서 오갈 수 있는 http요청을 담는다.
    // defer함수에는 미래에 리졸빙될 값이 있는 Promise객체들을 인자로 전달한다.
    // 이 defer함수를 loader의 리턴값으로 리턴한다.
    return defer({
        events: loadEvents() // loadEvents()의 리턴값을 events 키에 저장.
        // lodEvents()의 리턴값은 Promise객체
    })
    // 연기된 데이터를 사용하려는 컴포넌트로 ...
}