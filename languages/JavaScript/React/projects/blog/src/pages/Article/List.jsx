import Header from '../../components/layout/Header.jsx'
import ArticleList from '../../components/feature/Article/List.jsx'
import ArticleNav from '../../components/feature/Article/Nav.jsx';

const ArticleListPage = () => {
    return <>
        <Header />
        <ArticleNav />
        <ArticleList />
    </>
}

export default ArticleListPage;