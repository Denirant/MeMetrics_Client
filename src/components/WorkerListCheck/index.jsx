import React, { useState, useEffect } from "react";
import './style.css'

const WorkerListCheck = ({ items }) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Обработчик изменения состояния чекбокса
  const handleCheckboxChange = (id) => {
    const updatedCheckedItems = [...checkedItems];

    if (updatedCheckedItems.includes(id)) {
      // Убрать из списка выбранных, если уже выбран
      updatedCheckedItems.splice(updatedCheckedItems.indexOf(id), 1);
    } else {
      // Добавить в список выбранных, если не выбран
      updatedCheckedItems.push(id);
    }

    setCheckedItems(updatedCheckedItems);
  };

  // Обработчик изменения строки поиска
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Обработчик выбора/снятия выбора всех элементов
  const handleSelectAll = () => {
    if (checkedItems.length === items.length) {
      // Если выбраны все, снимаем выделение со всех
      setCheckedItems([]);
    } else {
      // Если не все выбраны, выбираем все
      const allItems = items.map((item) => item.id);
      setCheckedItems(allItems);
    }
  };

  // Фильтрация элементов по строке поиска
  const filteredItems = items.filter((item) =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
  item.position.toLowerCase().includes(searchTerm.toLowerCase())
);

  useEffect(() => {
    // Сбросить выбранные элементы при изменении списка
    setCheckedItems([]);
  }, [items]);

  return (
    <div className="worker_checks">
      <div className="header">
        <h1 className="header_title">Workers</h1>
        <button onClick={handleSelectAll} className={`worker_checks-selectAll ${checkedItems.length === items.length ? 'blue' : ''}`}>
          {checkedItems.length !== items.length ? 'Select everybody' : 'Unselect everybody'}
        </button>
      </div>
      <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="worker_checks-search"
        />
      <ul className="worker_checks-list">
        {filteredItems.map((item) => (
          <li key={item.id} className="worker_checks-list_item">
            <label className="worker_checks-list_item-label">
              <input
                type="checkbox"
                value={item.id}
                checked={checkedItems.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
                className="worker_checks-list_item-checkbox"
              />
              <img
                className="worker_checks-list_item-image"
                src={"https://memetricsserver.onrender.com" + item.image}
                alt="person_image"
                width={32}
                height={32}
              />
              <div className="worker_checks-list_item-info">
                <h2 className="worker_checks-list_item-name">
                  {item.name} {item.surname}
                </h2>
                <p className="worker_checks-list_item-position">{item.position}</p>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkerListCheck;
