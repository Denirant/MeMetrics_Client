import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useDispatch } from "react-redux";
import { addCompany } from "../../../../reducers/companyReducer";

import { HexColorPicker } from "react-colorful";
import { API_URL } from "../../../../config";

import showErrorAlert from "../../../../utils/showCustomError";

import "./style.css";

const AddCompany = ({ handleClose }) => {
  const [data, setData] = useState(null);
  const [name, setName] = useState("");

  const [isAddition, setIsAddition] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const INN_info = async (event) => {
    event.preventDefault();
    try {
      const url =
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
      const INN = {
        query: document.getElementById("inn_value").value,
      };
      const config = {
        headers: {
          Authorization: "Token 0fd4241f84ee1198d7b07c0a6cd9e84f1f5d3821",
        },
      };
      const { data: res } = await axios.post(url, INN, config);
      setData(res.suggestions[0].data);
      setName(res.suggestions[0].data?.name?.full_with_opf);
    } catch (e) {
      console.log(e);
      alert("Invalid INN");
    }
  };

  const addCompanyHandle = async (event) => {
    if (event.target) {
      try {
        const url = "http://localhost:8080/api/companies/add";
        const info = new FormData();
        info.append("name", name);
        info.append("legalForm", data?.name?.full_with_opf);
        info.append("INN", data?.inn);
        info.append("KPP", data?.kpp);
        info.append("OGRN", data?.ogrn);
        info.append("OKATO", data?.okato || "Нет");
        info.append("OKPO", data?.okpo || "Нет");
        info.append("OKTMO", data?.oktmo || "Нет");
        info.append("adress", data?.address?.unrestricted_value);
        info.append("managment", data?.management?.name || "Нет");
        info.append("status", data?.state?.status);
        info.append("description", description);
        info.append("mainColor", "#" + color);
        info.append("file", fileImage);

        console.log(fileImage ?? imagePreview);

        const { data: res } = await axios.post(url, info, {
          params: {
            id: localStorage.getItem("id"),
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        dispatch(addCompany(res));
        handleClose();
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
          // alert(error.response.data.message);
          handleClose();

          console.log(error);

          if (error.message === "Request failed with status code 500") {
            showErrorAlert("Company info validation error!", false);
          } else {
            showErrorAlert("This company was already pinned to you", false);
          }
        }
      }
    }
  };

  function handleName(event) {
    setName(event.target.value);
  }

  function handleFormClick(e) {
    if (e.target.classList.contains("company_add")) {
      handleClose();
    }
  }

  // async function uploadCompanyPhoto(file) {
  //   try {
  //     const token = localStorage.getItem("token"),
  //       id = localStorage.getItem("id");

  //     const formData = new FormData();
  //     formData.append("photo", file);

  //     await axios.post(`${API_URL}api/users/updateAvatar?id=${id}`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     return;
  //   } catch (e) {
  //     throw new Error(e.message);
  //   }
  // }

  const fileInput = useRef(null);
  const [imagePreview, setImagePreview] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAT4AAACfCAMAAABX0UX9AAAAP1BMVEXm5+jp6uuTlZjAwMHX2NnKysuMjpKQkpXr7O3j5OWtr7Hg4eK0tbfBw8Wlp6mfoaSXmZzR0tS5u72vsbOoqan5fWL2AAAClElEQVR4nO3Wy27iQBBAUXfHdDdvk8z/f+vYvKMJEHEXrpHuXcECqXRU2NUtUmfv1nfygeRDyYeSDyUfSj6UfCj5UPKh5EPJh5IPJR9KPpR8KPlQ8qHkQ8mHkg8lH0o+lHwo+VDyoeRDyYeSDyUfSj6UfCj5UPKh5EPJh5IPJR9KPpR8KPlQ8qHkQ8mHkg8lH0o+lHwo+VDyoeRDyYeSDyUfSj6UfCj5UPKh5EPJh5IPJR9KPpR8KPlQ8qHkQ8XlS4d1u32ZcZBnheVb51I2F79+G3PIsHzpq+Zc+tOXtqvzTvOwqHyj2Mh3OM6WDqV+tle/mKWofGlbcj3vXNrnXNfzzvOgqHxd2+5X/Wn5FuMi1lXI9QvL16V2ActTl+dgrMLyXadqn3Xiq7uI6xeVb3nVWpd8Wr9DwEGD8rVVOb9r21c98eUh4PrF5EuLMj7sjoP15+Ub/74Bb+eYfOtp44bp0/H+u/jNPda/heRr+8lsulXGiznf+Dbh/r4R+c7v2lwWKQ35rni3c0C+dH3c1eW2fuMLdzsH5OuuG1d335YvX14ncYrHd7tUfmgfbP3C8U03y+NKsGnD8S2f7N7YEGvaaHz3d95PBbudg/G1j+d609t47hnvi8WX+ld6wW7nWHzd8Eov2O0cii+tyi+KdLyE4ut+9VyL9PCLxfffJR9KPpR8KPlQ8qHkQ8mHkg8lH0o+lHwo+VDyoeRDyYeSDyUfSj6UfCj5UPKh5EPJh5IPJR9KPpR8KPlQ8qHkQ8mHkg8lH0o+lHwo+VDyoeRDyYeSDyUfSj6UfCj5UPKh5EPJh5IPJR9KPpR8KPlQ8qHkQ8mHkg8lH0o+lHwo+VDyoeRDyYeSDzXytWRv1vruz/bD3m3zF/b9FIMyRG2iAAAAAElFTkSuQmCC"
  );

  const [fileImage, setFileImage] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFileImage(selectedFile)
      };

      reader.readAsDataURL(selectedFile);

      // await uploadCompanyPhoto(selectedFile);
    } else {
      setImagePreview(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAT4AAACfCAMAAABX0UX9AAAAP1BMVEXm5+jp6uuTlZjAwMHX2NnKysuMjpKQkpXr7O3j5OWtr7Hg4eK0tbfBw8Wlp6mfoaSXmZzR0tS5u72vsbOoqan5fWL2AAAClElEQVR4nO3Wy27iQBBAUXfHdDdvk8z/f+vYvKMJEHEXrpHuXcECqXRU2NUtUmfv1nfygeRDyYeSDyUfSj6UfCj5UPKh5EPJh5IPJR9KPpR8KPlQ8qHkQ8mHkg8lH0o+lHwo+VDyoeRDyYeSDyUfSj6UfCj5UPKh5EPJh5IPJR9KPpR8KPlQ8qHkQ8mHkg8lH0o+lHwo+VDyoeRDyYeSDyUfSj6UfCj5UPKh5EPJh5IPJR9KPpR8KPlQ8qHkQ8XlS4d1u32ZcZBnheVb51I2F79+G3PIsHzpq+Zc+tOXtqvzTvOwqHyj2Mh3OM6WDqV+tle/mKWofGlbcj3vXNrnXNfzzvOgqHxd2+5X/Wn5FuMi1lXI9QvL16V2ActTl+dgrMLyXadqn3Xiq7uI6xeVb3nVWpd8Wr9DwEGD8rVVOb9r21c98eUh4PrF5EuLMj7sjoP15+Ub/74Bb+eYfOtp44bp0/H+u/jNPda/heRr+8lsulXGiznf+Dbh/r4R+c7v2lwWKQ35rni3c0C+dH3c1eW2fuMLdzsH5OuuG1d335YvX14ncYrHd7tUfmgfbP3C8U03y+NKsGnD8S2f7N7YEGvaaHz3d95PBbudg/G1j+d609t47hnvi8WX+ld6wW7nWHzd8Eov2O0cii+tyi+KdLyE4ut+9VyL9PCLxfffJR9KPpR8KPlQ8qHkQ8mHkg8lH0o+lHwo+VDyoeRDyYeSDyUfSj6UfCj5UPKh5EPJh5IPJR9KPpR8KPlQ8qHkQ8mHkg8lH0o+lHwo+VDyoeRDyYeSDyUfSj6UfCj5UPKh5EPJh5IPJR9KPpR8KPlQ8qHkQ8mHkg8lH0o+lHwo+VDyoeRDyYeSDzXytWRv1vruz/bD3m3zF/b9FIMyRG2iAAAAAElFTkSuQmCC"
      );
    }
  };

  const [description, setDescription] = useState("");
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const [color, setColor] = useState("aabbcc");

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

  console.log(colors);

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

  return (
    <div className="company_add" onClick={(e) => handleFormClick(e)}>
      {!data && (
        <form method="POST" className="company_add_search" onSubmit={INN_info}>
          <h1 className="company_add_search__title">Add company</h1>
          <div className="company_add__close" onClick={handleClose}></div>
          <div className="company_add_search__input">
            <label htmlFor="inn_value" className="company_add_search__label">
              ИНН
              <input
                type="text"
                id="inn_value"
                className="company_add_search__input"
              />
            </label>
          </div>
          <div className="company_add__controls">
            <button
              className="company_add__controls--btn"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button className="company_add__controls--btn btn_blue">
              Get information
            </button>
          </div>
        </form>
      )}
      {data && (
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
                <label
                  htmlFor="inn_value"
                  className="company_add_search__label"
                >
                  Наименование
                  <input
                    type="text"
                    id="inn_value"
                    className="company_add_search__input"
                    value={name}
                    onChange={handleName}
                  />
                </label>
              </div>

              <label
                htmlFor="description"
                className="company_add_search__label"
              >
                Описание
                <textarea
                  id="description"
                  className="company_add_search__input"
                  style={{ height: "200px", resize: "none" }}
                  value={description}
                  onChange={handleDescriptionChange}
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
                    color={"#" + color}
                    onChange={(e) => setColor(e.slice(1))}
                  />
                </div>
                <label
                  htmlFor="colorpicker_id"
                  className="colorPickerComponents_label"
                >
                  <div
                    className="color_icon"
                    style={{ backgroundColor: "#" + color }}
                  ></div>
                  <p>#</p>
                  <input
                    type="text"
                    id="colorpicker_id"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </label>
                <ul className="color_offers">
                  {/* {[1, 2, 3, 4, 5].map((index) => (
                    <li
                      key={'color_offer' + index}
                      className="color_offers--item"
                      style={{ backgroundColor: getRandomHexColor() }}
                      onClick={(e) => {
                        e.preventDefault()
                        setColor(rgbToHex(e.target.style.backgroundColor).slice(1))
                      }}
                    ></li>
                  ))} */}
                  {colors.map((color, index) => (
                    <li
                      key={"color_offer" + index}
                      className="color_offers--item"
                      style={{ backgroundColor: color }}
                      onClick={(e) => {
                        e.preventDefault();
                        setColor(
                          rgbToHex(e.target.style.backgroundColor).slice(1)
                        );
                      }}
                    ></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="company_add_info__toggle">
            <h2 className="company_add_info__toggle--title">Company info</h2>
          </div>
          <div className={`info_adition ${isAddition ? "open" : ""} `}>
            <div className="company_add_search__input">
              <label htmlFor="inn_value" className="company_add_search__label">
                Полное наименование
                <input
                  type="text"
                  id="inn_value"
                  className="company_add_search__input"
                  readOnly
                  value={data?.name?.full_with_opf}
                />
              </label>
            </div>
            <div className="inputs_row">
              <div className="company_add_search__input">
                <label
                  htmlFor="inn_value"
                  className="company_add_search__label"
                >
                  ИНН
                  <input
                    type="text"
                    id="inn_value"
                    className="company_add_search__input"
                    readOnly
                    value={data?.inn}
                  />
                </label>
              </div>
              <div className="company_add_search__input">
                <label
                  htmlFor="inn_value"
                  className="company_add_search__label"
                >
                  КПП
                  <input
                    type="text"
                    id="inn_value"
                    className="company_add_search__input"
                    readOnly
                    value={data?.kpp}
                  />
                </label>
              </div>
            </div>
            <div className="inputs_row">
              <div className="company_add_search__input">
                <label
                  htmlFor="inn_value"
                  className="company_add_search__label"
                >
                  ОГРН
                  <input
                    type="text"
                    id="inn_value"
                    className="company_add_search__input"
                    readOnly
                    value={data?.ogrn}
                  />
                </label>
              </div>
              <div className="company_add_search__input">
                <label
                  htmlFor="inn_value"
                  className="company_add_search__label"
                >
                  ОКАТО
                  <input
                    type="text"
                    id="inn_value"
                    className="company_add_search__input"
                    readOnly
                    value={data?.okato || "Нет"}
                  />
                </label>
              </div>
            </div>
            <div className="inputs_row">
              <div className="company_add_search__input">
                <label
                  htmlFor="inn_value"
                  className="company_add_search__label"
                >
                  ОКПО
                  <input
                    type="text"
                    id="inn_value"
                    className="company_add_search__input"
                    readOnly
                    value={data?.okpo || "Нет"}
                  />
                </label>
              </div>
              <div className="company_add_search__input">
                <label
                  htmlFor="inn_value"
                  className="company_add_search__label"
                >
                  ОКТМО
                  <input
                    type="text"
                    id="inn_value"
                    className="company_add_search__input"
                    readOnly
                    value={data?.oktmo || "Нет"}
                  />
                </label>
              </div>
            </div>
            <div className="company_add_search__input">
              <label htmlFor="inn_value" className="company_add_search__label">
                Юридический адрес
                <input
                  type="text"
                  id="inn_value"
                  className="company_add_search__input"
                  readOnly
                  value={data?.address?.unrestricted_value}
                />
              </label>
            </div>
            <div className="company_add_search__input">
              <label htmlFor="inn_value" className="company_add_search__label">
                Генеральный директор
                <input
                  type="text"
                  id="inn_value"
                  className="company_add_search__input"
                  readOnly
                  value={data?.management?.name || "Нет"}
                />
              </label>
            </div>
            <div className="company_add_search__input">
              <label htmlFor="inn_value" className="company_add_search__label">
                Статус
                <input
                  type="text"
                  id="inn_value"
                  className="company_add_search__input"
                  readOnly
                  value={
                    data?.state?.status[0] +
                    data?.state?.status.toLowerCase().slice(1)
                  }
                />
              </label>
            </div>
          </div>
          <div className="company_add__controls">
            <button
              className="company_add__controls--btn"
              type="button"
              onClick={() => setData(null)}
            >
              Cancel
            </button>
            <button
              className="company_add__controls--btn btn_blue"
              onClick={addCompanyHandle}
            >
              Add company
            </button>
          </div>
        </div>
      )}
      {/* {data && 
                <div>
                    <label htmlFor="name">Наименование: </label>
                    <input type="text" id="name" value={name} onChange={handleName}/>
                </div>}
            {data && <p>Полное название: {data?.name?.full_with_opf}</p>}
            {data && <p>ИНН: {data?.inn}</p>}
            {data && <p>КПП: {data?.kpp}</p>}
            {data && <p>ОГРН: {data?.ogrn}</p>}
            {data && <p>ОКАТО: {data?.okato || 'None'}</p>}
            {data && <p>ОКПО: {data?.okpo || 'None'}</p>}
            {data && <p>ОКТМО: {data?.oktmo || 'None'}</p>}
            {data && <p>Юридический адрес: {data?.address?.unrestricted_value}</p>}
            {data && <p>Генеральный директор: {data?.management?.name}</p>}
            {data && <p>Статус: {data?.state?.status}</p>}
            
            {data && <button type='button' className='' onClick={addCompany}>Add company</button>} */}
    </div>
  );
};

export default AddCompany;
