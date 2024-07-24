const ArticleContent = ({ title, content }) => {
    return (
        <div className="bg-white/50 p-4 min-h-screen">
            <div className="container w-app px-8 py-14">
                <div>{title}</div>
                <div>{content}</div>
            </div>
        </div>
    );
}


export default ArticleContent;