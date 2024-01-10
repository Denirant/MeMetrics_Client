import React, {useRef} from "react";
import { useDetectOutsideClick } from "./useDetectOutsideClick";

import './style.css';

const DropDownMenu = ({isClickable, groups, handleInsert}) => {

    
    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);

    const onClick = (event) => {
        event.preventDefault();
        setIsActive(!isActive);
    }

    const changeValue = (event) => {
        event.preventDefault();

        setIsActive(!isActive);
        
        let currentId = event.target.getAttribute('groupid');
        let dropdown_text = document.getElementById('text_group');

        dropdown_text.innerText = event.target.innerText;
        dropdown_text.setAttribute('selectedgroupid', currentId);
    }

    return (
        <div className={`drop_wrapper ${isClickable ? 'drop_wrapper__available' : ''}`}>
            <div className="drop_conteiner" ref = {dropdownRef}>
                <button onClick={onClick} className={`drop_conteiner-trigger ${isActive ? 'drop_conteiner-trigger__active' : ''}`}>
                    {isClickable ? <span selectedgroupid='' id='text_group'>Select group</span> : <span>Nothing</span>}
                </button>
                <nav className={`drop_conteiner-menu ${isActive ? "drop_conteiner-menu__active" : ""}`}>
                    <ul className="drop_menu-groups">
                        {  
                            groups && groups.map((group, index) => {
                                return(
                                    // ключ должен быть уникальным
                                    <li key={`drop_group__${index}`} className="drop_menu-group" onClick={changeValue} groupid={group.ref_id}>{group.name}</li>
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
            <button className="drop_insert" onClick={handleInsert}>Insert</button>
        </div>
    )
}

export default DropDownMenu;