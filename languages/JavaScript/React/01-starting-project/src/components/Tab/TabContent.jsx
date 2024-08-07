import { EXAMPLES } from '../../data.js';

export default function TabContent(props){
    let data = EXAMPLES[props.selectedTopic];
    let title=data.title;
    let description=data.description;
    let code=data.code;

    return(
        <div id="tab-content">
            <h3>{title}</h3>
            <p>{description}</p>
            <pre>
                <code>{code}</code>
            </pre>
        </div>
    )
}