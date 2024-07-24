import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/helper";

const ArticleItem = ({ article }) => {
    const { id, title, content, createdAt } = article;
    const cutContentStyle = ' whitespace-nowrap overflow-hidden text-ellipsis';
    return (
        <Link
            to={'/blog/'+id}
            className="
            bg-white/30
                h-48
                overflow-hidden
                px-5 py-4 
                rounded-lg
                flex flex-col gap-4
                cursor-pointer
                hover:bg-primary-400/80
                hover:text-white
            "
        >
            <div className="flex flex-col">
                <p className={`text-lg font-semibold ${cutContentStyle}`}>{title}</p>
                <p className="text-xs text-zinc-500 text-right">{formatDate(createdAt)}</p>
            </div>
            <p className={`${cutContentStyle} text-zinc-800 font-thin`}>{content}</p>
        </Link>
    )
}

export default ArticleItem;