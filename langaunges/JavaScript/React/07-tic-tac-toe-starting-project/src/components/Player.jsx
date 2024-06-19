import { useState } from 'react';
export default function Player({ name, symbol }) {
    const [isEditing, setIsEditing] = useState(false);
    let buttonContent = "Edit";
    let playerName = <span className="player-name">{name}</span>;

    // function handlingEditClick() {
    //     setIsEditing(!isEditing);
    // }

    if (isEditing) {
        buttonContent = "Save";
        playerName = <input type="text" required />;
    } else {
        buttonContent = "Edit";
        playerName = <span className="player-name">{name}</span>;
    }
    return (
        <li>
            <span className="player">
                {playerName}
                <span className="player-symbol">{symbol}</span>
            </span>
            <button onClick={()=>{setIsEditing(!isEditing)}}>{buttonContent}</button>
        </li>
    )
}