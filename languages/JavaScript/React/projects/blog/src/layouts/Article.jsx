import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import ArticleNav from "../components/feature/Article/Nav.jsx";

const ArticleLayout = () => {
    return <>
        <Header />
        <ArticleNav />
        <Outlet />
    </>
}

export default ArticleLayout;