import React, {useRef} from 'react'
import './dropdown.css'
import { useOutsideClick } from '../../utils/useOutsideClick';

function Dropdown({imageUrl, dropContent, width, height, dropClass}) {


    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useOutsideClick(dropdownRef, false);
    const handleToggleMenu = (e) => {
        console.log(e)
        setIsActive(!isActive)
    };
    
    return (
        <div className="dropdown__container" ref={dropdownRef}>
            {/* Dropdown Button */}
            <div className="dropdown__btn" onMouseDown={handleToggleMenu}>
              <img src={imageUrl} alt="..." />
            </div>
    
            {/* Dropdown Content */}
            <div
              className={`dropdown__content ${isActive ? "active" : "inactive"}`}
            >
                <div className="dropdown__info">
                    <ul>
                        {
                            dropContent.map((el, index) => {
                                return (
                                    <li onMouseDown={(e) => {
                                        setIsActive(false)
                                        el.handler(e)
                                    }} key={`dropdown_${index}`}>
                                        <span>
                                            <img className={dropClass} src={el.icon} alt="icon" />
                                            <p>{el.text}</p>
                                        </span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dropdown;
