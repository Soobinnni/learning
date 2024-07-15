import { defer, json, redirect, useRouteLoaderData, Await } from "react-router-dom";

import EventItem from '../components/EventItem.js'
import EventsList from "../components/EventsList.js";
import { Suspense } from "react";
import { getAuthToken } from "../util/auth.js";

const EventDetailPage = () => {
    const { event, events } = useRouteLoaderData('event-detail');

    return <>
        <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
            <Await resolve={event}>
                {(loadedEvent) => <EventItem event={loadedEvent} />}
            </Await>
        </Suspense>
        <Suspense fallback={<p style={{ textAlign: 'center' }}>Loading...</p>}>
            <Await resolve={events}>
                {(loadedEvents) => <EventsList events={loadedEvents} />}
            </Await>
        </Suspense>
    </>;
};

export default EventDetailPage;

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
        const resData = await response.json();
        return resData.events;
    }
}

async function loadEvent(id) {
    const response = await fetch(`http://localhost:8080/events/${id}`);
    if (!response.ok) {
        throw json(
            { message: 'Could not fetch details for selected event' },
            { status: response.status }
        )
    } else {
        const resData = await response.json();
        return resData.event;
    }
}

export const loader = async ({ params }) => {
    return defer({
        event: await loadEvent(params.eventId),
        events: loadEvents(),
    })
}


export const action = async ({ request, params }) => {
    const token = getAuthToken();
    const response = await fetch(`http://localhost:8080/events/${params.eventId}`, {
        // method: 'DELETE'
        //       submit(null, {method:'delete'}) 에서 가져옴
        method: request.method,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (!response.ok) {
        throw json({ message: 'Could not delete event.' }, { status: 500 })
    }

    return redirect('/events');
}