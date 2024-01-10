import React, { useState } from "react";
import "./style.css";
import Dropdown from "../../dropdownComponent/dropdown";

import dottedMenu from "../../../assets/img/Navigation.svg"; 
import DeleteIcon from "../../../assets/img/NavigationIcons/Delete.svg";
import CreateTagScreen from "../TagAdding";
import { useDispatch } from "react-redux";
import { AddTag } from "../../../actions/user";
import generateNotification from "../../../utils/generateNotification";


function getContrastColor(hexColor) {
  // Преобразование цвета в RGB формат
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Расчет контрастности по формуле
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? 'black' : 'white';
}

function TagScreen({ tags = [], onClose, onDelete, onSave }) {
  const [selectedTags, setSelectedTags] = useState(localStorage.getItem('selected_tags')?.split(',').filter(el => el !== '') || []);
  const [isAdding, setIsAdding] = useState(false);

  // const selectedTagsId = localStorage.getItem('selected_tags')?.split(',') || []; 
  // const isTagSelected = (id) => selectedTagsId.includes(id);
  

  const dispatch = useDispatch(null);

  const handleCheckboxChange = async (tag) => {
    const isSelected = selectedTags.includes(tag._id);

    const selectedList = isSelected
    ? selectedTags.filter((selectedTag) => selectedTag !== tag._id)
    : [...selectedTags, tag._id]

    await setSelectedTags(selectedList);

    localStorage.setItem('selected_tags',(selectedList))
  };


  async function handleToggleAddTag(){
    await setIsAdding(!isAdding)
  }

  async function handleTagAdding(nameArg, colorArg){
    try{
      await dispatch(AddTag(nameArg, colorArg))
      await handleToggleAddTag();
      // onClose();
    }catch(error){
      console.log(error)
      await dispatch(generateNotification('Action', 'top center', error.message, 'Error'))
    }
  }

  return (
    <div className="tag_wrapper">
      {!isAdding ? ( <div className="tag_container">
        <div className="tag_header">
          <h1 className="tag_header-title">
            Tags
            <span>Choose tag or create new</span>
          </h1>
          <div className="tag_header-close" onClick={onClose}></div>
        </div>
        <div className="tag_body">
            {selectedTags.length > 0 && <div className="selected_container_tags">
                <h2>Selected tags</h2>
                {selectedTags.map((id) => {
                  const el = tags.find(el => el._id === id)
                  return (
                <div key={el?.title+'selected'} style={{backgroundColor: el?.color}} className="tag_element selected">
                
                <p style={{color: getContrastColor(el.color)}}>{el?.title}</p>
                </div>
            )})}    
            </div>}
          {tags.length > 0 ? tags.map((el) => (
            <div key={el?.title} className="tag_element">
              <input
                type="checkbox"
                id={el?.title}
                checked={selectedTags.includes(el?._id)}
                onChange={() => handleCheckboxChange(el)}
              />
              <span className="checkmark" onClick={() => {
                handleCheckboxChange(el)
              }}></span>
              <label style={{backgroundColor: el?.color, color: getContrastColor(el.color)}} htmlFor={el?.title}>{el?.title}</label>
              <Dropdown
                        imageUrl={dottedMenu}
                        dropContent={[
                          {
                            icon: DeleteIcon,
                            text: "Delete",
                            handler: (e) => onDelete(el?.title),
                          },
                        ]}
                        width={"24px"}
                        height={"24px"}
                        dropClass={"file-menu"}
                      />
            </div>
          )) : (
            <p className="empty_tags">
              There is no data, please add some item
            </p>
          )}
        <p className="add_tag_btn" onClick={handleToggleAddTag}>Add tag +</p>
        </div>
        <div className="tag_control">
          <button className="tag_btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="tag_btn blue"
            onClick={() => {
            // console.log(selectedTags)
            //   onSave(selectedTags);
              dispatch(generateNotification('Action', 'top center', 'Tag was successfully saved', 'Success'));
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>) : (
        <>
          <CreateTagScreen handleCancel={handleToggleAddTag} handleCreate={handleTagAdding}/>
        </>
      )}
    </div>
  );
}

export default TagScreen;
