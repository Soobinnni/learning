import { useState } from 'react';
export default function Player({ initialName, symbol }) {
    const [isEditing, setIsEditing] = useState(false);
    const [playerName, setPlayerName] = useState(initialName);

    const defaultNameSpan = <span className="player-name">{playerName}</span>;
    const nameInput = <input type="text" required defaultValue={playerName} onChange={(event)=>{
        setPlayerName(name=>event.target.value);
    }}/>;

    return (
        <li>
            <span className="player">
                {!isEditing && defaultNameSpan}
                {isEditing && nameInput}
                <span className="player-symbol">{symbol}</span>
            </span>
            {/* <button onClick={() => { setIsEditing((editing)=>{ return !editing}) }}>{isEditing ? 'Save' : 'Edit'}</button> */}
            <button onClick={() => { 
                setIsEditing(editing=>!editing);
             }}>{isEditing ? 'Save' : 'Edit'}</button>
        </li>
    )
}