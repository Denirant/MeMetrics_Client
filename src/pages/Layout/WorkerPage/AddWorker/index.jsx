import React, { useState, useRef, useEffect } from "react";
import "./style.css";

import WorkerPreview from "../../../../assets/img/UploadWorker.svg";
import DropdownInput from "../../../../components/InputDropdown";
import DayPickerInput from "../../../../components/InputDayPicker";

import moment from "moment";
import {
  createWorker,
  getDepartmentsBytCompany,
  getListOfCompanies,
} from "../../../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import { addWorker } from "../../../../reducers/workerReducer";
import showErrorAlert from "../../../../utils/showCustomError";

import { onPhoneInput, onPhoneKeyDown, onPhonePaste } from "../../../../utils/PhoneInput";
import generateNotification from "../../../../utils/generateNotification";

function AddWorker({ handleClose, handleTree, manager = null, department = null }) {
  const [userInfo, setUserInfo] = useState({
    worker_name: "",
    worker_surname: "",
    worker_gender: "",
    worker_birthday: "",
    worker_company: "",
    worker_department:  "",
    worker_menager: "",
    worker_position: "",
    worker_phone: "",
    worker_email: "",
    image: null,
  });

  function handleDataChang1e(e) {
    setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
  }

  const fileInput = useRef(null);
  const [imagePreview, setImagePreview] = useState(WorkerPreview);

  const [departmentName, setDepartmentName] = useState("");
  const [isActive, setIsActive] = useState(false);

  const dispatch = useDispatch();

  function handleDepartment() {
    setIsActive(!isActive);
    setDepartmentName("");
  }


  useEffect(() => {
    const setDepartment = async () => {
      try {
        setUserInfo(prevUserInfo => ({ ...prevUserInfo, worker_department: department }));

      } catch (error) {
        console.log(error);
      }
    };

    if(department){
      setDepartment();
    }
  }, [department, setUserInfo]);

  useEffect(() => {
    const setManager = async () => {
      try {
        setUserInfo(prevUserInfo => ({ ...prevUserInfo, worker_menager: manager }));

      } catch (error) {
        console.log(error);
      }
    };

    if(manager){
      setManager();
    }
  }, [manager, setUserInfo]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setUserInfo({ ...userInfo, image: selectedFile});
      };

      reader.readAsDataURL(selectedFile);

      // await uploadCompanyPhoto(selectedFile);
    } else {
      setImagePreview(WorkerPreview);
    }
  };

  function handleFormClick(e) {
    if (e.target.classList.contains("add_worker__container")) {
      handleClose();
    }
  }

  const [optionsCompany, setOptionsCompany] = useState([]);
  const [optionsDepartment, setOptionsDepartment] = useState([]);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const data = await getListOfCompanies();

        setOptionsCompany(data);
      } catch (error) {
        console.log(error);
      }
    };

    getCompanies();
  }, []);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const data = await getDepartmentsBytCompany(
          optionsCompany.filter((el) => el.name === userInfo.worker_company)[0]
            ?.id
        );

        // console.log(data)
        setOptionsDepartment(data ?? []);
      } catch (error) {
        console.log(error);
      }
    };

    getDepartments();
  }, [userInfo.worker_company]);


  function convertDateFromString(dateString) {
    const parts = dateString.split('.');
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    const convertedDate = new Date(year, month, day);
  
    return convertedDate;
  }

  
  async function handleWorkerCreate() {
    try{

      const company_id = optionsCompany.filter(el => el.name === userInfo.worker_company)[0]?.id,
          department_obj = optionsDepartment.filter(el => el.name === userInfo.worker_department)[0],
          department_id = department_obj?.id,
          menager_id = department_obj?.headId;

      const data = await createWorker(
        userInfo.worker_name,
        userInfo.worker_surname,
        userInfo.worker_gender,
        convertDateFromString(userInfo.worker_birthday),
        company_id,
        department_id,
        menager_id,
        userInfo.worker_position,
        userInfo.worker_phone,
        userInfo.worker_email,
        userInfo.image,
        departmentName
      );

      dispatch(addWorker(data))
      handleClose()

    }catch(error){
      if(error.message === 'Request failed with status code 409'){
        showErrorAlert('Worker with given email already exist!', true);
        handleClose()
      }else if(error.name === 'DataCheckError'){
        console.log('Data check error')
        dispatch(generateNotification('Action', 'top center', error.message, 'Error'))
      }
    }
  }
  
  const optionsGender = ["Male", "Female"];

  return (
    <div className="add_worker__container" onClick={handleFormClick}>
      <div className="add_worker__container-form">
        <div className="add_worker__container-form_title">
          <h1 className="add_worker__container-form_title-text">Add worker</h1>
          <div
            className="add_worker__container-form_title-close"
            onClick={handleClose}
          ></div>
        </div>
        <div className="add_worker__container-form_body">
          <div className="inputs_row">
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
                  width={24}
                  height={24}
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100px" }}
                  className={`${
                    imagePreview !== WorkerPreview ? "active" : ""
                  }`}
                />
              </div>
            </div>
            <h1>
              Profile photo{" "}
              <span  onClick={() => fileInput.current.click()}  style={{cursor: 'pointer'}}>
                Click upload profile photo. Allowed file types: png, jpg, jpeg
              </span>
            </h1>
          </div>
          <div className="inputs_row">
            <div className="company_add_search__input">
              <label
                htmlFor="worker_name"
                className="company_add_search__label"
              >
                First name
                <input
                  type="text"
                  id="worker_name"
                  className="company_add_search__input"
                  onChange={handleDataChang1e}
                  value={userInfo?.worker_name}
                  placeholder="Enter first name"
                />
              </label>
            </div>
            <div className="company_add_search__input">
              <label
                htmlFor="worker_surname"
                className="company_add_search__label"
              >
                Last name
                <input
                  type="text"
                  id="worker_surname"
                  className="company_add_search__input"
                  onChange={handleDataChang1e}
                  value={userInfo?.worker_surname}
                  placeholder="Enter last name"
                />
              </label>
            </div>
          </div>
          <div className="inputs_row">
            <div className="company_add_search__input">
              <label
                htmlFor="worker_gender"
                className="company_add_search__label"
              >
                Gender
                <DropdownInput
                  selectedValue={userInfo?.worker_gender}
                  options={optionsGender}
                  onOptionSelect={(key, value) =>
                    setUserInfo({ ...userInfo, [key]: value })
                  }
                  key={"worker_gender"}
                  placeholder={"Choose gender"}
                  id={"worker_gender"}
                />
              </label>
            </div>
            <div className="company_add_search__input">
              <label
                htmlFor="worker_birthday"
                className="company_add_search__label"
              >
                Birthday
                <DayPickerInput
                  onDaySelect={(key, value) => {
                    setUserInfo({ ...userInfo, [key]: value });
                  }}
                  placeholder={"Choose date"}
                  key={"worker_birthday"}
                  id={"worker_birthday"}
                  value={userInfo?.worker_birthday}
                />
              </label>
            </div>
          </div>
          <div className="inputs_row">
            <div className="company_add_search__input">
              <label
                htmlFor="worker_company"
                className="company_add_search__label"
              >
                Company
                <DropdownInput
                  selectedValue={userInfo?.worker_company}
                  options={optionsCompany.map((el) => el.name)}
                  onOptionSelect={(key, value) => {
                    setUserInfo({ ...userInfo, [key]: value });
                  }}
                  key={"worker_company"}
                  placeholder={"Choose company"}
                  id={"worker_company"}
                />
              </label>
            </div>
            <div className="company_add_search__input">
              <label
                htmlFor="worker_department"
                className="company_add_search__label"
              >
                Department
                <DropdownInput
                  selectedValue={userInfo?.worker_department}
                  options={optionsDepartment.map((el) => el.name)}
                  onOptionSelect={(key, value) => {
                    setUserInfo({
                      ...userInfo,
                      [key]: value,
                      worker_menager: optionsDepartment.filter(
                        (el) => el.name === value
                      )[0].head_name,
                    });
                  }}
                  key={"worker_department"}
                  placeholder={"Choose department"}
                  id={"worker_department"}
                  handleClickSearchTree={() => handleTree(optionsCompany.filter(el => el.name === userInfo.worker_company)[0].id, userInfo.worker_name, userInfo.worker_surname)}
                  readOnly={(optionsDepartment.length ? false : true)}
                />
                {console.log(optionsCompany.filter(el => el.name === userInfo.worker_company))}
              </label>
            </div>
          </div>
          <div className="inputs_row">
            <div className="company_add_search__input">
              <label
                htmlFor="worker_menager"
                className="company_add_search__label"
              >
                Menager
                <DropdownInput
                  selectedValue={userInfo?.worker_menager}
                  options={[]}
                  onOptionSelect={(key, value) =>
                    setUserInfo({ ...userInfo, [key]: value })
                  }
                  key={"worker_menager"}
                  placeholder={"Choose manager"}
                  id={"worker_menager"}
                  readOnly={true}
                />
              </label>
            </div>
            <div className="company_add_search__input">
              <label
                htmlFor="worker_position"
                className="company_add_search__label"
              >
                Position
                <input
                  type="text"
                  id="worker_position"
                  className="company_add_search__input"
                  onChange={handleDataChang1e}
                  value={userInfo?.worker_position}
                  placeholder="Enter position"
                />
              </label>
            </div>
          </div>
          <div className="inputs_row">
            <div className="company_add_search__input">
              <label
                htmlFor="worker_phone"
                className="company_add_search__label"
              >
                Contact phone
                <input
                  // type="text"
                  // id="worker_phone"
                  // className="company_add_search__input"
                  // onChange={handleDataChang1e}
                  // value={userInfo?.worker_phone}
                  // placeholder="Enter phone number"
                  type='text' 
                  placeholder="Enter phone number"
                            id="worker_phone"
                            name="phone"
                            onChange={handleDataChang1e} 
                            required 
                            value={userInfo?.worker_phone} 
                            className="company_add_search__input"
                            onInput={onPhoneInput}
                            onKeyDown={onPhoneKeyDown}
                            onPaste={onPhonePaste}
                />
              </label>
            </div>
            <div className="company_add_search__input">
              <label
                htmlFor="worker_email"
                className="company_add_search__label"
              >
                Email
                <input
                  type="text"
                  id="worker_email"
                  className="company_add_search__input"
                  onChange={handleDataChang1e}
                  value={userInfo?.worker_email}
                  placeholder="Enter email"
                />
              </label>
            </div>
          </div>
          <div className="custom-dropselect-option department_select">
            <input
              type="checkbox"
              name="type"
              id={`dropselect_department`}
              checked={isActive}
              onChange={handleDepartment}
            />
            <label
              className="dropdownselect_check"
              htmlFor={`dropselect_department`}
            >
              Make an employee the head of a new department
            </label>
          </div>
          {isActive && (
            <div className="inputs_row">
              <div className="company_add_search__input">
                <label
                  htmlFor="worker_phone"
                  className="company_add_search__label"
                >
                  Department name
                  <input
                    type="text"
                    id="worker_department"
                    className="company_add_search__input"
                    onChange={(e) => {
                      setDepartmentName(e.target.value);
                    }}
                    value={departmentName}
                    placeholder="Enter department name"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="add_worker__container-form_controls">
          <button
            className="company_add__controls--btn btn_blue"
            onClick={handleWorkerCreate}
            
          >
            Create
          </button>
          <button
            className="company_add__controls--btn"
            type="button"
            onClick={(e) => {
              setUserInfo(null);
              handleClose(e);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddWorker;
