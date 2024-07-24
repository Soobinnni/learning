import { useQuery } from "@tanstack/react-query";
import { getArticleById } from "../../../utils/http/article";
import ErrorBlock from "../../ErrorBlock.jsx";
import LoadingIndicator from "../../LoadingIndicator.jsx";
import { formatDateTime } from "../../../utils/helper";
import WaveDivider from "../../UI/WaveDivider.jsx";
import EditIcon from '../../../assets/svg/edit.svg'
import DeleteIcon from '../../../assets/svg/delete.svg'


const ArticleDetail = ({ blogId }) => {
    const {
        data, isPending, isError, error
    } = useQuery({
        queryKey: ['article', blogId],
        queryFn: ({ signal }) => getArticleById({ signal, id: blogId })
    });

    let detailContent;
    if (isPending) {
        detailContent = <LoadingIndicator />;
    }

    if (isError) {
        detailContent = (
            <ErrorBlock
                title="오류가 발생하였습니다."
                message={error.info?.message || '블로그 글 로딩 실패.'}
            />
        );
    }

    if (data) {
        const { title, content, createdAt } = data;
        const formattedCreatedAt = formatDateTime(createdAt);
        const iconStyle = 'w-8 h-8 object-cover rounded-full bg-primary-500/80 m-auto shadow-md cursor-pointer hover:bg-primary-500/70';
        detailContent = (
            <>
                <div className="w-full p-10 text-center">
                    <h1 className="m-auto w-fit text-4xl font-extrabold text-white/70">{title}</h1>
                </div>
                <div className="m-auto w-app text-primary-800 flex flex-col gap-4">
                    <div className="text-center italic">{formattedCreatedAt}</div>
                    <menu className="w-fit m-auto flex flex-row gap-2">
                        <img src={EditIcon} alt='edit icon' className={iconStyle+' p-0.5'} />
                        <img src={DeleteIcon} alt='edit icon' className={iconStyle + ' p-1'} />
                    </menu>
                </div>
                <div className="transform rotate-180">
                    <WaveDivider color="rgba(255, 255, 255, 0.5)" height={65} />
                </div>
                <div className="bg-white/50 p-4 min-h-screen">
                    <div className="container w-app px-8 py-14">
                        <div>{title}</div>
                        <div>{content}</div>
                    </div>
                </div>
            </>
        );
    }

    return <>{detailContent}</>
}
export default ArticleDetail;