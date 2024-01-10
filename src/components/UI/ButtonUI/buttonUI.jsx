import React from "react";
import Clue from "../Clue/clue";

import './style.css';

const ButtonUI = ({isClickable = true, action, handleAction = undefined, clue_text}) => {
    return (
        <div className="ui_btn_wrapper">
            <button className={`ui_btn  ui_btn__${action} ${isClickable ? 'ui_btn__active' : ''}`} onClick={handleAction}></button>
            {clue_text && <Clue text={clue_text}/>}
        </div>

    )
}

export default ButtonUI;