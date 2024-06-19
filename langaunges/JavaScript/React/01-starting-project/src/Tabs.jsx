export default function Tabs({ children, ButtonContainer, buttons }) {
    return (
        <>
            <ButtonContainer>
                {buttons}
            </ButtonContainer>
            {children}
        </>
    )
}