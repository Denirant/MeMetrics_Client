import React, { useEffect, useRef, useState } from "react";
import "./Dropdown.css";
import searchIcon from '../../assets/img/Search.svg'
import { useOutsideClick } from "../../utils/useOutsideClick";

function DropdownInput({ selectedValue, options, onOptionSelect, placeholder, key, id, handleClickSearchTree = null, readOnly = false }) {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useOutsideClick(dropdownRef, false);
  const [dropValue, setDropValue] = useState(selectedValue);
  

  useEffect(() => {
    setDropValue(selectedValue)
    setSelected(null);
  }, [selectedValue])

const [selected, setSelected] = useState(null);

  const handleToggleMenu = (e) => {
    if(readOnly){
      setIsActive(false);
    }else{
      setIsActive(!isActive);
    }
  };

  const handleOptionSelect = (option, index) => {
    onOptionSelect(id, option);
    setDropValue(option);
    setSelected(index);

    setTimeout(() => {
        setIsActive(false);
    }, 50)
  };

  return (
    <div className="dropdown__container" ref={dropdownRef}>
      {/* Dropdown Input */}
      <div className={`dropdown__input ${readOnly ? 'readOnly' : ''}`} onClick={handleToggleMenu}>
        <input type="text" id={id} value={dropValue} readOnly placeholder={placeholder}/>
      </div>

      {/* Dropdown Content */}
      <div className={`dropdown__content ${isActive ? "active" : "inactive"}`}>
        {handleClickSearchTree && <button onClick={handleClickSearchTree} className="dropdown_btn"><img src={searchIcon} alt="searchIcon" />Search in tree</button>}
        <ul>
          {options.map((option, index) => (
            <li
              key={`dropdown_${index}`}
              onClick={() => handleOptionSelect(option, index)}
              className={`${selected === index ? 'active' : ''}`}
            >
                <div className='dropdown_checkmark'></div>
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DropdownInput;
