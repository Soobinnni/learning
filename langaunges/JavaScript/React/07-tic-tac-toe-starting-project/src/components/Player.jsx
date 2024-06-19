import { useState } from 'react';
export default function Player({ name, symbol }) {
    const [isEditing, setIsEditing] = useState(false);

    const defaultNameSpan = <span className="player-name">{name}</span>;
    const nameInput = <input type="text" required value={name}/>;

    return (
        <li>
            <span className="player">
                {!isEditing && defaultNameSpan}
                {isEditing && nameInput}
                <span className="player-symbol">{symbol}</span>
            </span>
            {/* <button onClick={() => { setIsEditing((editing)=>{ return !editing}) }}>{isEditing ? 'Save' : 'Edit'}</button> */}
            <button onClick={() => { setIsEditing(editing=>!editing) }}>{isEditing ? 'Save' : 'Edit'}</button>
        </li>
    )
}