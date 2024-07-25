// ArticleDetail.jsx
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteArticle, getArticleById } from "../../../utils/http/article";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { queryClient } from '../../../utils/http/index.js'

import ErrorBlock from "../../ErrorBlock.jsx";
import LoadingIndicator from "../../LoadingIndicator.jsx";

import ArticleHeader from "./ArticleHeader.jsx";
import ArticleContent from "./ArticleContent.jsx";
import DeleteConfirmationModal from "../../UI/DeleteConfirmationModal.jsx";

const ArticleDetail = ({ blogId }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const { data, isPending, isError, error } = useQuery({
        queryKey: ['article', blogId],
        queryFn: ({ signal }) => getArticleById({ signal, id: blogId }),
        staleTime: 10000
    });

    const { mutate, isPendingDeletion, isErrorDeleting, error: deleteError } = useMutation({
        mutationFn: deleteArticle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['article'], refetchType: 'none' });
            navigate('/blog')
        }
    });

    const handleStartDelete = () => setIsDeleting(true);
    const handleStopDelete = () => setIsDeleting(false);
    const handleDelete = () => mutate({ id: blogId });
    const handleEdit = () => { navigate('edit') };

    if (isPending) return <LoadingIndicator />;
    if (isError) return <ErrorBlock title="오류가 발생하였습니다." message={error.info?.message || '블로그 글 로딩 실패.'} />;
    if (!data) return null;

    return (
        <>
            {isDeleting && (
                <DeleteConfirmationModal 
                    onClose={handleStopDelete}
                    onConfirm={handleDelete}
                    title={data.title}
                    isPendingDeletion={isPendingDeletion}
                    isErrorDeleting={isErrorDeleting}
                    deleteError={deleteError}
                />
            )}
            <ArticleHeader 
                title={data.title} 
                createdAt={data.createdAt}
                onDeleteClick={handleStartDelete}
                onEditClick={handleEdit}
            />
            <ArticleContent content={data.content} />
        </>
    );
}

export default ArticleDetail;