import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

import "./style.css";

function CreateTagScreen({ handleCancel, handleCreate }) {

    function rgbToHex(rgb) {
        // Разбиваем строку "rgb(255, 0, 0)" на массив ["255", "0", "0"]
        const values = rgb.match(/\d+/g);
        if (values && values.length === 3) {
          const hexColor = `#${parseInt(values[0], 10)
            .toString(16)
            .padStart(2, "0")}${parseInt(values[1], 10)
            .toString(16)
            .padStart(2, "0")}${parseInt(values[2], 10)
            .toString(16)
            .padStart(2, "0")}`;
          return hexColor;
        }
        return null; // Возвращаем null в случае некорректного значения
      }
    
      const getRandomHexColor = () => {
        const randomValues = new Uint8Array(3);
        crypto.getRandomValues(randomValues);
    
        const toHex = (value) => {
          const hex = value.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        };
    
        const color = `#${toHex(randomValues[0])}${toHex(randomValues[1])}${toHex(
          randomValues[2]
        )}`;
        return color;
      };


  const [inputTagName, setInputTagName] = useState(""),
    [tagColor, setTagColor] = useState("fff"),
    [colors, setColors] = useState(() =>
      Array.from({ length: 8 }, (_, index) => getRandomHexColor())
    );

  function handleChangeInput(e) {
    setInputTagName(e.target.value);
  }

  return (
    <div className="create_tag_wrapper">
      <div className="create_tag_container">
        <div className="create_tag_header">
          <h1 className="create_tag_header-title">
            Tags
            <span>Enter new tag</span>
          </h1>
          <div className="create_tag_header-close" onClick={handleCancel}></div>
        </div>
        <div className="create_tag_body">
          <div className="inputs_row">
            <div className="company_add_search__input">
              <label
                htmlFor="worker_name"
                className="company_add_search__label"
              >
                Enter tag name
                <input
                  type="text"
                  id="worker_name"
                  className="company_add_search__input"
                  onChange={handleChangeInput}
                  value={inputTagName}
                  placeholder="Enter tag name"
                />
              </label>
            </div>
          </div>
          <div className="tag_color_container">
            <div className="colorPickerComponents">
              <div className={`color_container`}>
                <HexColorPicker
                  color={"#" + tagColor}
                  onChange={(e) => setTagColor(e.slice(1))}
                />
              </div>
              <label
                htmlFor="colorpicker_id"
                className="colorPickerComponents_label"
              >
                <div
                  className="color_icon"
                  style={{ backgroundColor: "#" + tagColor }}
                ></div>
                <p>#</p>
                <input
                  type="text"
                  id="colorpicker_id"
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                />
              </label>
              <ul className="color_offers">
                {colors.map((color, index) => (
                  <li
                    key={"color_offer" + index}
                    className="color_offers--item"
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.preventDefault();
                      setTagColor(
                        rgbToHex(e.target.style.backgroundColor).slice(1)
                      );
                    }}
                  ></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="tag_control">
          <button className="tag_btn" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="tag_btn blue"
            onClick={() => {
              handleCreate(inputTagName, tagColor);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTagScreen;
