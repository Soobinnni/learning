import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return <>
        <div id="content" className="w-full min-h-screen">
            <Outlet />
        </div>
    </>
}

export default AuthLayout;