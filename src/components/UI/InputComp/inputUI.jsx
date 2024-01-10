import React, {useState} from "react";

import './style.css'

const InputUI = ({isClickable, placeholder, command, actionHandler}) => {

    const [group, setGroup] = useState('');

    const handleChange = (event) => {
        setGroup(event.target.value);
    }

    const handleClick = (event) => {
        event.preventDefault();
        (group.length > 0 && actionHandler());
    }

    return(
        <div className={`input_container ${isClickable ? 'input_container__active' : ''}`}>
            <input id="group_input" type="text" className="input_enter" placeholder={placeholder} value={group} onChange={handleChange}/>
            <button type="button" className="input_submit" onClick={handleClick}>{command}</button>   
        </div>
    )
}

export default InputUI;

