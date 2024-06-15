export default function TabButton({children, onSelect, isSelected}) {
    return (<li>
        {/* onClick prop 전달 */}
        <button className={isSelected?"active":undefined} onClick={onSelect}>
            {children}
        </button>
    </li>)
}