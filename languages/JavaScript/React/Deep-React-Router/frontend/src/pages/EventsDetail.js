import { json, useRouteLoaderData } from "react-router-dom";

import EventItem from '../components/EventItem.js'

const EventDetailPage = () => {
    const data = useRouteLoaderData('event-detail');
  
    return <EventItem event={data.event} />;
};

export default EventDetailPage;

export const loader = async({request, params}) => {
    const id = params.eventId;
    const response = await fetch(`http://localhost:8080/events/${id}`);
    if(!response.ok){
        throw json(
            {message: 'Could not fetch details for selected event'}, 
            {status: response.status}
        )
    } else {
        return response;
    }
}