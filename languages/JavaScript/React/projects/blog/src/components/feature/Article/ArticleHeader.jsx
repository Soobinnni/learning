// ArticleHeader.jsx
import { formatDateTime } from "../../../utils/helper";
import WaveDivider from "../../UI/WaveDivider.jsx";
import ArticleDetailIconMenu from "./ArticleDetailIconMenu.jsx";

const ArticleHeader = ({ title, createdAt, onDeleteClick }) => {
    const formattedCreatedAt = formatDateTime(createdAt);

    return (
        <>
            <div className="w-full p-10 text-center">
                <h1 className="m-auto w-fit text-4xl font-extrabold text-white/70">{title}</h1>
            </div>
            <div className="m-auto w-app text-primary-800 flex flex-col gap-4">
                <div className="text-center italic">{formattedCreatedAt}</div>
                <ArticleDetailIconMenu onDeleteClick={onDeleteClick} />
            </div>
            <div className="transform rotate-180">
                <WaveDivider color="rgba(255, 255, 255, 0.5)" height={65} />
            </div>
        </>
    );
}

export default ArticleHeader;