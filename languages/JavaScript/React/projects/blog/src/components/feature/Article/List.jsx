import { useQuery } from "@tanstack/react-query";
import { getArticleList } from "../../../utils/http/article.js"
import ArticleItem from "./Item.jsx";
import LoadingIndicator from '../../LoadingIndicator.jsx';
import ErrorBlock from '../../ErrorBlock.jsx';
import NewArticleButton from "./NewArticleButton.jsx";
import { Link } from "react-router-dom";

const ArticleList = ({}) => {
    const {
        data,
        isPending,
        isError,
        error
    } = useQuery({
        queryKey: ['article'],
        queryFn: ({ signal }) => getArticleList({ signal })
    });

    let content;
    if (isPending) {
        content = <LoadingIndicator />;
    }

    if (isError) {
        content = (
            <ErrorBlock
                title="오류가 발생하였습니다."
                message={error.info?.message || '블로그 글 로딩 실패.'}
            />
        );
    }

    if (data) {
        if (data.length > 0) {
            content = (
                <ul className="container w-app article-list grid grid-cols-4 gap-6">
                    <li><NewArticleButton /></li>
                    {data.map((article) => (
                        <li key={article.id}>
                            <ArticleItem article={article} />
                        </li>
                    ))}
                </ul>
            );
        } else {
            content = <div className="mt-20 text-center flex flex-col gap-2">
                        <p>등록된 게시물이 없습니다.</p>
                        <Link
                            className="font-extrabold hover:text-primary-900/30" 
                            to='/blog/new'
                        >새 게시물 등록하기</Link>
                </div>
        }
    }

    return <div>{content}</div>
}
export default ArticleList;