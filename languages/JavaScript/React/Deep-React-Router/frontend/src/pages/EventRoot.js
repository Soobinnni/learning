import { Outlet } from "react-router-dom";

import EventsNavigation from '../components/EventsNavigation.js'

const EventRootLayout = () => {
    return (
        <>
            <EventsNavigation/>
            <Outlet/>
        </>
    )
}

export default EventRootLayout;