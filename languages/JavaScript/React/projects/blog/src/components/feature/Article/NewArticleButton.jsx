import { Link } from "react-router-dom";
const NewArticleButton = () => {
    return (
        <Link
            to='/blog/new'
            className="
            bg-zinc-500/30
            border-2
            border-white/30
                h-48
                overflow-hidden
                px-5 py-4 
                rounded-lg
                flex flex-col justify-center items-center
                cursor-pointer
                hover:bg-primary-900/90
                hover:text-white
            "
        >
            <div className="text-5xl font-extrabold"> +
            </div>
        </Link>
    )
}

export default NewArticleButton;

