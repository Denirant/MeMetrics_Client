import  {useState, useEffect, useRef} from "react";

import { useDetectOutsideClick } from "../DropDownComp/useDetectOutsideClick";

import './style.css';

const InputDropdown = ({isDisabled = true, placeholder, onChange, data}) => {

    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);

    const [input, setInput] = useState('');

    const handleFocus = async (event) => {
        if(input.length >= 1 && data.length > 0){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

        await setInput('');
        onChange(event);
    }

    const handleDropSelect = (event) => {
        onChange(event);

        setInput(event.target.innerText);
        setIsActive(false);
    }

    const handleClearText = (event) => {
        event.target.previousSibling.focus();
    }

    const onChangeHandler = async(event) => {
        let input = event.target.value;

        onChange(event);
        setInput(input);

        if(event.target.value.length >= 1){
            setIsActive(true)
        }else{
            setIsActive(false)
        }
    }

    useEffect(() => {
        if(isDisabled){
            setInput('');
        }
    }, [isDisabled, data])

    return (
        <div className={`drop_wrapper_common`}>
            <div className={`drop_conteiner_common`} ref={dropdownRef}>
                <div className="drop_search">
                    <input disabled={isDisabled} className="drop_input_common" type="text" value={input} onChange={onChangeHandler} placeholder={placeholder} onFocus={handleFocus}/>
                    {input.length > 0 && <div className="drop_clear" onClick={handleClearText}></div>}
                </div>
                <nav className={`drop_conteiner-menu_common ${data.length > 0 && isActive ? "drop_conteiner-menu__active_common" : ""}`}>
                    <ul className="drop_menu-groups_common">
                        {  
                            data.map((item, index) => {
                                return(
                                    // ключ должен быть уникальным
                                    <li key={`drop_group__${index}`} className="drop_menu-group_common" onClick={handleDropSelect}>{item}</li>
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
        </div>
    )
};

export default InputDropdown;