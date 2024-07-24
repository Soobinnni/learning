import { Link } from "react-router-dom";

const ArticleItem = ({ article }) => {

    const { title, content } = article;
    return (
        <Link 
            to=''
            className="
                bg-white/30
                h-48
                overflow-hidden
                px-5 py-4 
                rounded-lg
                flex flex-col gap-2
                cursor-pointer
                hover:bg-primary-400/80
                hover:text-white"
        >
            <p className="text-lg font-semibold">{title}</p>
            <p>{content}</p>
        </Link>
    )
}

export default ArticleItem;