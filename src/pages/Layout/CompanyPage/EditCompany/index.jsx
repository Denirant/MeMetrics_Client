import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { addCompany, removeCompany } from "../../../../reducers/companyReducer";

import { HexColorPicker } from "react-colorful";
import { API_URL } from "../../../../config";

import showErrorAlert from "../../../../utils/showCustomError";

import { EditCompanyFunc } from "../../../../actions/user";

import "./style.css";

const EditCompany = ({ handleClose, companyId, info }) => {
  // const [data, setData] = useState(null);
  // const [name, setName] = useState("");

  if(info){
    info = {
      name: info.name,
      description: info.description,
      color: info.mainColor,
      url: info.iconUrl
    }
  }

  const companies = useSelector((state) => state.companies),
    company = info ?? companies.filter((el) => el.id === companyId)[0];


    
  const [data, setData] = useState({
    name: company.name,
    description: company.description,
    color: company.color.slice(1),
  });

  function handleChangeData(key, value) {
    setData({ ...data, [key]: value });
  }

  function handleFormClick(e) {
    if (e.target.classList.contains("company_add")) {
      handleClose();
    }
  }

  const fileInput = useRef(null);
  const [imagePreview, setImagePreview] = useState(
    "https://memetricsserver.onrender.com" + company.url
  );

  const [fileImage, setFileImage] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFileImage(selectedFile);
      };

      reader.readAsDataURL(selectedFile);

      // await uploadCompanyPhoto(selectedFile);
    } else {
      setImagePreview("https://memetricsserver.onrender.com" + company.url);
    }
  };

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

  const [colors, setColors] = useState(() =>
    Array.from({ length: 5 }, (_, index) => getRandomHexColor())
  );

  function rgbToHex(rgb) {
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
    return null;
  }

  const areObjectsEqual = (obj1, obj2) => {

    if(!obj1 || !obj2){
      return false;
    }

    obj2 = {
      name: obj2.name,
      description: obj2.description,
      color: obj2.color.slice(1),
    }

    for(let value of Object.values(obj1)){
      if(!Object.values(obj2).includes(value)){
        return false;
      }
    }

    return true;
  }

  const dispatch = useDispatch();

  async function EditCompanyHandle() {
    if (
      !areObjectsEqual(data, {
        name: company.name,
        description: company.description,
        color: company.color,
      })
    ) {
      console.log('Change detected')
      const updatedCompany = await EditCompanyFunc(data.name, data.description, data.color, fileImage, companyId);
      
      dispatch(removeCompany(companyId));
      dispatch(addCompany(updatedCompany));

      handleClose()

    }else{
      console.log('No change')
    }
  }

  return (
    <div className="company_add" onClick={(e) => handleFormClick(e)}>
      <div className="company_add_info">
        <h1 className="company_add_search__title">Add company</h1>
        <div className="company_add__close" onClick={handleClose}></div>
        <div className="company_add__header">
          <div className="company_add__header-main">
            <div className="company_add_search__input">
              <div className="company_add_search__input_select">
                <input
                  type="file"
                  accept="image/*"
                  name="photo" // Укажите имя поля как 'photo'
                  style={{ display: "none" }}
                  ref={fileInput}
                  onChange={handleFileChange}
                />
                <div
                  onClick={() => fileInput.current.click()}
                  className="company_add_search__input_preview"
                >
                  <img
                    width={78}
                    height={78}
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "100px" }}
                  />
                </div>
              </div>
              <label htmlFor="inn_value" className="company_add_search__label">
                Наименование
                <input
                  type="text"
                  id="inn_value"
                  className="company_add_search__input"
                  value={data?.name}
                  onChange={(e) => handleChangeData("name", e.target.value)}
                />
              </label>
            </div>

            <label htmlFor="description" className="company_add_search__label">
              Описание
              <textarea
                id="description"
                className="company_add_search__input"
                style={{ height: "200px", resize: "none" }}
                value={data?.description}
                onChange={(e) =>
                  handleChangeData("description", e.target.value)
                }
              />
            </label>
            <p className="company_add_info__text">
              Вы можете изменить наименование компании для внутренней системы
            </p>
          </div>
          <div className="company_add__header-color">
            <div className="colorPickerComponents">
              <div className={`color_container`}>
                <HexColorPicker
                  color={"#" + data?.color}
                  onChange={(e) => handleChangeData("color", e.slice(1))}
                />
              </div>
              <label
                htmlFor="colorpicker_id"
                className="colorPickerComponents_label"
              >
                <div
                  className="color_icon"
                  style={{ backgroundColor: "#" + data?.color }}
                ></div>
                <p>#</p>
                <input
                  type="text"
                  id="colorpicker_id"
                  value={data?.color}
                  onChange={(e) => handleChangeData("color", e.target.value)}
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
                      handleChangeData(
                        "color",
                        rgbToHex(e.target.style.backgroundColor).slice(1)
                      );
                    }}
                  ></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="company_add__controls">
          <button
            className="company_add__controls--btn"
            type="button"
            onClick={() => {setData(null); handleClose()}}
          >
            Cancel
          </button>
          <button
            className="company_add__controls--btn btn_blue"
            onClick={EditCompanyHandle}
            style={{
              opacity: !areObjectsEqual(data, {
                name: company.name,
                description: company.description,
                color: company.color,
              }) ? '1' : '.75',
              pointerEvents: !areObjectsEqual(data, {
                name: company.name,
                description: company.description,
                color: company.color,
              }) ? 'auto' : 'none'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCompany;
