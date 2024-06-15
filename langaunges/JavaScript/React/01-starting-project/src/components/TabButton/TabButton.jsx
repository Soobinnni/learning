export default function TabButton(props) {
    return (<li>
        {/* onClick prop 전달 */}
        <button onClick={props.onSelect}>
            {props.children}
        </button>
    </li>)
}