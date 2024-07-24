import Header from '../../components/layout/Header.jsx'
import ArticleList from '../../components/feature/Article/List.jsx'
import ArticleNav from '../../components/feature/Article/Nav.jsx';
import { Outlet } from 'react-router-dom';

const ArticleListPage = () => {
    return <>
        <Header />
        <ArticleNav />
        <ArticleList />
        <Outlet/>
    </>
}

export default ArticleListPage;