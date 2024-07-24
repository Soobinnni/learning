import { Outlet } from "react-router-dom";
import Nav from "../components/layout/Nav.jsx";

const MainLayout = () => {
    return <>
        <Nav />
        <div id="content" className="w-full min-h-screen py-9">
            <Outlet />
        </div>
    </>
}

export default MainLayout;