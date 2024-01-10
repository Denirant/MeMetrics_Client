import React, {forwardRef, useState, useImperativeHandle, useRef} from "react";
import { useDetectOutsideClick } from "../DropDownComp/useDetectOutsideClick";

import './style.css';

const DropdownSelector = forwardRef(({array, text}, _ref) => {

    
    const dropdownRef = useRef(null);
    
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
    const [state, setState] = useState(text);

    useImperativeHandle(_ref, () => ({
        getDropValue: () => {
            return state;
        }
    }))

    const onClick = (event) => {
        event.preventDefault();
        setIsActive(!isActive);

        console.log(_ref.current)

    }

    const changeValue = async(event) => {
        event.preventDefault();

        setIsActive(!isActive);
        
        await setState(event.target.innerText)
    }

    return (
        <div className={`drop_wrapper_common`}>
            <div className="drop_conteiner_common" ref = {dropdownRef}>
                <button onClick={onClick} className={`drop_conteiner-trigger_common ${isActive ? 'drop_conteiner-trigger__active_common' : ''}`}>
                    <span selectedgroupid='' id='text_group_'>{state}</span>
                </button>
                <nav className={`drop_conteiner-menu_common ${isActive ? "drop_conteiner-menu__active_common" : ""}`}>
                    <ul className="drop_menu-groups_common">
                        {  
                            array && array.map((item, index) => {
                                return(
                                    // ключ должен быть уникальным
                                    <li key={`drop_group__${index}`} className="drop_menu-group_common" onClick={changeValue}>{item}</li>
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
        </div>
    )
})

export default React.memo(DropdownSelector);