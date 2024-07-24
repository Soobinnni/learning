import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Nav from "../components/layout/Nav.jsx";

const MainLayout = () => {
    return <>
        <Nav />
        <Header />
        <div id="content" className="container w-app min-h-screen py-9">
            <Outlet />
        </div>
    </>
}

export default MainLayout;