import React, { useState, useRef, useImperativeHandle } from "react";
import { useOutsideClick } from "../../utils/useOutsideClick";
import "./style.css";

const DropdownWithoutEnter = (({ options }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const dropdownRef_1 = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <div className="dropdownWithoutEnter" ref={dropdownRef_1}>
      <input
        className="dropdownWithoutEnter-input"
        readOnly
        onClick={() => setIsOpen(!isOpen)}
        value={selectedValue}
        placeholder="Select account number"
      />
      {isOpen && (
        <div className="dropdownWithoutEnter-list">
          {options.map((option, index) => (
            <div
              key={index}
              className={`dropdownWithoutEnter-list-item ${
                option === selectedValue ? "selected" : ""
              }`}
              onClick={() => handleOptionClick('**** **** **** ' + option.slice(-4))}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default DropdownWithoutEnter;
