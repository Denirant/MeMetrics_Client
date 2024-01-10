import React, { useRef, useState } from "react";
import "./style.css";
import { useOutsideClick } from "../../utils/useOutsideClick";

import DayPickerIcon from '../../assets/img/calendarPicker.svg'
import DayPickerSimple from "../DayPicker";

import moment from "moment";

function DayPickerInput({
    onDaySelect,
    selectedDay = '',
  placeholder,
  key,
  id,
}) {
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useOutsideClick(dropdownRef, false);
  const [day, setDay] = useState(selectedDay ? moment(selectedDay).format('DD.MM.YYYY') : '');

  const handleToggleMenu = (e) => {
    setIsActive(!isActive);
  };

  const handleDaySelect = (selected) => {
    selected = moment(selected).format('DD.MM.YYYY');

    onDaySelect(id, selected);
    setDay(selected);

    setIsActive(false);
  };

  return (
    <div className="dropdown__container daypicker" ref={dropdownRef}>
      {/* Dropdown Input */}
      <div className="dropdown__input" onClick={handleToggleMenu}>
        <img src={DayPickerIcon} alt="daypickerIcon" />
        <input
          type="text"
          id={id}
          value={day}
          readOnly
          placeholder={placeholder}
        />
      </div>

      {/* Dropdown Content */}
      <div className={`dropdown__picker ${isActive ? "active" : "inactive"}`}>
        <DayPickerSimple selectedArg={day} handleDaySelect={handleDaySelect}/>
      </div>
    </div>
  );
}

export default DayPickerInput;
