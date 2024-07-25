import { Outlet, useParams } from "react-router-dom";
import ArticleDetail from "../../components/feature/Article/Detail.jsx";

const ArticleDetailPage = () => {
    const { blogId } = useParams();
    return <>
        <ArticleDetail blogId={blogId} />
        <Outlet />
    </>;
}
export default ArticleDetailPage;