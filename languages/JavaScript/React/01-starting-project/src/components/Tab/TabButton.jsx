export default function TabButton({children, isSelected, ...props}) {
    return (<li>
        {/* 
            onClick prop 전달 
            스프레드 연산자 사용하기 위해 onClick으로 props 명 변경
        */}

        <button className={isSelected?"active":undefined} {...props}>
            {children}
        </button>
    </li>)
}