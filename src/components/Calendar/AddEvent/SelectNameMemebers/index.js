import React, { useState, useRef } from 'react';
import './style.css'

const SelectMembers = ({ data, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Флаг для контроля дропдауна
  const inputRef = useRef(null);

  const filterItems = (query) => {
    return data.filter(
      (item) =>
        !selectedItems.some((selectedItem) => selectedItem.id === item.id) &&
        (query.trim() === '' ||
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.surname.toLowerCase().includes(query.toLowerCase()) ||
          item.email.toLowerCase().includes(query.toLowerCase()))
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
    const updatedItems = selectedItems.filter((item) => item.id !== itemId);
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
          <div key={item.id} className="selected-item">
            {item.name} {item.surname}
            <span onClick={() => handleItemRemove(item.id)}></span>
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
        placeholder="Start typing name or email..."
      />
      {isOpen && filterItems(inputValue).length > 0 && (
        <ul className="dropdown-list">
          {filterItems(inputValue).map((item) => (
            <li key={item.id} onClick={() => handleItemClick(item)}>
                <img width={32} height={32} style={{objectFit: 'cover', borderRadius: '50%'}} src={`http://localhost:8080/${item.image}`} alt='icon user'/>
                <p>{item.name} {item.surname} <span>{item.position}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectMembers;
