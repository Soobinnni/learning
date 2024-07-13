import { Link } from "react-router-dom";

const DUMMY = [
    { id: 'a1', title: 'event 1', description: 'event 1 description' },
    { id: 'b2', title: 'event 2', description: 'event 2 description' },
    { id: 'c3', title: 'event 3', description: 'event 3 description' },
]

const EventsPage = () => {
    return <>
        <h1>EventsPage</h1>
        {
            DUMMY.map(event => (
                <li>
                    <Link key={event.id} to={event.id}>{event.title}: {event.description}</Link>
                </li>
            ))
        }
    </>
};

export default EventsPage;