export default function TabButton(props) {
    function handleClick(){
        console.log('Hello World!');
    }
    return (<li>
        {/* onClick prop 전달 */}
        <button onClick={handleClick}>
            {props.children}
        </button>
    </li>)
}