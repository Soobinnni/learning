const Form = ({ onSubmit, children }) => {

    function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        console.log({...data})
        onSubmit({ ...data });
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-7"
        >
            <div className="flex flex-col gap-5">
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="제목"
                // defaultValue={inputData?.title ?? ''}
                />
                <textarea
                    type="text"
                    id="content"
                    name="content"
                    placeholder="내용"
                // defaultValue={inputData?.title ?? ''}
                />
            </div>
            <div className="button-container flex flex-row justify-end items-center gap-8">
                {children}
            </div>
        </form>
    )
}
export default Form;