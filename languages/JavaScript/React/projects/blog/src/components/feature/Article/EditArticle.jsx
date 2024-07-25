import { Link, useLoaderData, useNavigate, useParams } from "react-router-dom";
import { getArticleById, updateArticle } from "../../../utils/http/article";
import Form from "./Form.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../utils/http";
import Modal from "../../UI/Modal.jsx";
import ErrorBlock from '../../ErrorBlock.jsx'

const EditArticle = () => {
    const navigate = useNavigate();
    const { blogId } = useParams();
    const initialData = useLoaderData(); // 로더에서 가져온 초기 데이터
    const queryKey = ['article', blogId];

    const {
        data, isError, error
    } = useQuery({
        queryKey,
        queryFn: ({ signal }) => getArticleById({ signal, id: blogId }),
        initialData, // 로더에서 가져온 데이터를 초기 데이터로 사용
        staleTime: 10000
    });

    const {
        mutate, isPending
    } = useMutation({
        mutationFn: updateArticle,
        onMutate: async (data) => {
            const newArticle = data.editArticleFormData;
            await queryClient.cancelQueries({ queryKey });
            const prevArticle = queryClient.getQueryData(queryKey);
            queryClient.setQueryData(queryKey, newArticle);
            return prevArticle;
        },
        onError: (error, data, context) => {
            queryClient.setQueryData(queryKey, context.prevArticle);
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey, refetchType: 'none' });
        }
    });

    function handleClose() {
        navigate('../');
    }

    function handleSubmit(formData) {
        mutate({ id: blogId, editArticleFormData: formData });
        navigate('../');
    }

    let content;

    if (isError) {
        content = (
            <>
                <ErrorBlock
                    title="Failed to load event"
                    message={
                        error.info?.message ||
                        'Failed to load event. Please check your inputs and try again later.'
                    }
                />
                <div className="form-actions">
                    <Link to="../" className="button">
                        Okay
                    </Link>
                </div>
            </>
        );
    }

    if (data) {
        content = (
            <Form inputData={data} onSubmit={handleSubmit}>
                {isPending ? (
                    <p>Sending data...</p>
                ) : (
                    <>
                        <Link to="../" className="button-text">
                            Cancel
                        </Link>
                        <button type="submit" className="button">
                            Update
                        </button>
                    </>
                )}
            </Form>
        );
    }

    return <Modal onClose={handleClose}>{content}</Modal>;
}

export function loader({ params }) {
    const { blogId } = params;
    return queryClient.fetchQuery({
        queryKey: ['article', blogId],
        queryFn: ({ signal }) => getArticleById({ signal, id: blogId }),
        staleTime: 10000
    });
}

export default EditArticle;