import { Outlet } from "react-router-dom";

const RootLayout = ({ children }) => {
    return <div id="wrap" className="text-primary-900 font-serif">
        <Outlet />
        {children && children}
    </div>
}
export default RootLayout;