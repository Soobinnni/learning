export default function Tabs({ children, buttonsContainer, buttons }) {
    const ButtonContainer = buttonsContainer;
    return (
        <>
            {/* <menu>
                {buttons}
            </menu>
            {children} 

            버튼을 감싸는 요소를 동적으로 선택하기!
            */}
            <ButtonContainer>
                {buttons}
            </ButtonContainer>
            {children}
        </>
    )
}