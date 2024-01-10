import React from "react";
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

function TagShortcut({ tags = [], onDelete, onSettings }) {

  const selectedTagsId = localStorage.getItem('selected_tags')?.split(',') || []; 
  const isTagSelected = (id) => selectedTagsId.includes(id);

  
  return (
    <div className="tag_control_wrapper">
      <div className="tag_control_header">
        <h1 className="tag_control_header-title">Tags</h1>
        <div onClick={onSettings} className="tag_control_header-settings"></div>
      </div>
      {tags.length > 0 ? (
        <div className="tag_control_body">
          {tags.filter((el) => isTagSelected(el._id)).map((el) => (
            <span className="tag_control_element" style={{backgroundColor: el?.color, color: getContrastColor(el?.color)}}>
              {el?.title}
              <div
                className="tag_control_delete"
                onClick={() => onDelete(el?.title)}
              ></div>
            </span>
          ))}
        </div>
      ) : (
        <p>To select or create a tag, click on the settings</p>
      )}
    </div>
  );
}

export default TagShortcut;
