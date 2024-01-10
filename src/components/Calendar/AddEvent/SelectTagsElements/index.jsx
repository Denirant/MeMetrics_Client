import React, { useState, useRef } from 'react';
import './style.css'

function getContrastColor(hexColor) {
    // Преобразование цвета в RGB формат
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
  
    // Расчет контрастности по формуле
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? 'black' : 'white';
  }


const SelectTags = ({ data, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Флаг для контроля дропдауна
  const inputRef = useRef(null);

  const filterItems = (query) => {
    return data.filter(
      (item) =>
        !selectedItems.some((selectedItem) => selectedItem._id === item._id) &&
        (query.trim() === '' ||
          item.title.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setIsOpen(true);
    setIsDropdownOpen(true); // Открываем дропдаун при изменении значения инпута
  };

  const handleItemClick = (item) => {
    setSelectedItems([...selectedItems, item]);
    setInputValue('');
    setIsOpen(false);
    inputRef.current.focus();
    onChange([...selectedItems, item])
    
  };

  const handleItemRemove = (itemId) => {
    const updatedItems = selectedItems.filter((item) => item._id !== itemId);
    setSelectedItems(updatedItems);
    onChange(updatedItems);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (isDropdownOpen) {
        setIsOpen(false);
        setIsDropdownOpen(false);
      }
    }, 200);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setIsDropdownOpen(true); // Открываем дропдаун при фокусе инпута
  };

  return (
    <div className="select_members_container">
        <p className='select_members_container_par'>Assign Members</p>
      <div className="selected-items">
        {selectedItems.map((item) => (
          <div key={item._id} className="selected-item" style={{backgroundColor: item.color, color: getContrastColor(item.color)}}>
            {item.title}
            <span onClick={() => handleItemRemove(item._id)}></span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        ref={inputRef}
        placeholder="Start typing tag..."
      />
      {isOpen && filterItems(inputValue).length > 0 && (
        <ul className="dropdown-list">
          {filterItems(inputValue).map((item) => (
            <li key={item._id} onClick={() => handleItemClick(item)}>
                <div className='tag_indicator_mark' style={{backgroundColor: item.color}}></div>
                <p>{item.title}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectTags;
