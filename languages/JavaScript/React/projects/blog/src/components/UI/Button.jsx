const Button = ({ content, color, ...props }) => {
    return (
        <button
            className="w-full"
            {...props}
        >
            {content}
        </button>
    )
}

export default Button;