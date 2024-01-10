import React from "react";
import './style.css'

const Clue = ({text}) => {
    return(
        <div className="clue_container">
            {text}
        </div>
    )
}

export default Clue;