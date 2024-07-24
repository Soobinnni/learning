import { useQuery } from "@tanstack/react-query";
import { getArticleList } from "../../../utils/http/article.js"
import ArticleItem from "./Item.jsx";

import LoadingIndicator from '../../LoadingIndicator.jsx';
import ErrorBlock from '../../ErrorBlock.jsx';

const ArticleList = () => {
    const {
        data,
        isPending,
        isError,
        error
    } = useQuery({
        queryKey: ['articles'],
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
        content = (
            <ul className="article-list grid grid-cols-4 gap-4">
                {data.map((article, idx) => (
                    <li key={idx}>
                        <ArticleItem article={article} />
                    </li>
                ))}
            </ul>
        );
    }

    return <div>{content}</div>
}
export default ArticleList;