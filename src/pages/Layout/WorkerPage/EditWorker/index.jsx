import React, { useState, useRef, useEffect } from "react";
import "./style.css";

import WorkerPreview from "../../../../assets/img/UploadWorker.svg";
import DropdownInput from "../../../../components/InputDropdown";
import DayPickerInput from "../../../../components/InputDayPicker";

import { convertDateFromString } from "../../../../utils/date";

import moment from "moment";
import {
  getDepartmentsBytCompany,
  getListOfCompanies,
  EditWorkerFunc,
} from "../../../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import { addWorker, removeWorker } from "../../../../reducers/workerReducer";
import showErrorAlert from "../../../../utils/showCustomError";

function EditWorker({ handleClose, handleTree, data, department, manager }) {
  const [userInfo, setUserInfo] = useState({
    worker_name: data.name,
    worker_surname: data.surname,
    worker_gender: data.gender,
    worker_birthday: data.birthday,
    worker_company: data.company,
    worker_department: data.department,
    worker_menager: data.manager,
    worker_position: data.position,
    worker_phone: data.phone,
    worker_email: data.email,
    image: data.image,
  });

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

  function handleDataChang1e(e) {
    setUserInfo({ ...userInfo, [e.target.id]: e.target.value });
  }

  const fileInput = useRef(null);
  const [imagePreview, setImagePreview] = useState(
    "http://localhost:8080/" + data.image
  );

  const [departmentName, setDepartmentName] = useState("");
  const [isActive, setIsActive] = useState(false);

  const dispatch = useDispatch();

  function handleDepartment() {
    setIsActive(!isActive);
    setDepartmentName("");
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setUserInfo({ ...userInfo, image: selectedFile });
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
    const getDepartment = async (id) => {
      try {
        const dataDeps = await getDepartmentsBytCompany(id);

        setOptionsDepartment(dataDeps);
      } catch (error) {
        console.log(error);
      }
    };

    const getCompanies = async () => {
      try {
        const dataCompanies = await getListOfCompanies();

        setOptionsCompany(dataCompanies);

        if (dataCompanies.some((el) => el.name === data.company)) {
          getDepartment(
            dataCompanies.filter((el) => el.name === data.company)[0].id
          );
        }
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
            .id
        );

        // console.log(data)
        setOptionsDepartment(data);
      } catch (error) {
        console.log(error);
      }
    };

    getDepartments();
  }, [userInfo.worker_company]);

  function isValidDate(dateString) {
    const isValid = !isNaN(Date.parse(dateString));

    return isValid;
  }

  async function handleUpdateWorker() {
    const company_id = optionsCompany.filter(
        (el) => el.name === userInfo.worker_company
      )[0].id,
      department_obj = optionsDepartment.filter(
        (el) => el.name === userInfo.worker_department
      )[0],
      department_id = department_obj.id,
      menager_id = department_obj.headId,
      date = isValidDate(userInfo.worker_birthday)
        ? userInfo.worker_birthday
        : convertDateFromString(userInfo.worker_birthday),
      worker_id = data.id;

    console.log(data)

    const updatedData = await EditWorkerFunc(
      userInfo.worker_name,
      userInfo.worker_surname,
      userInfo.worker_gender,
      date,
      company_id,
      department_id,
      menager_id,
      userInfo.worker_position,
      userInfo.worker_phone,
      userInfo.worker_email,
      userInfo.image,
      departmentName,
      worker_id
    );


    dispatch(removeWorker(worker_id));
    dispatch(addWorker(updatedData))

    handleClose();

    // console.log(userInfo.worker_birthday)
    // console.log(isValidDate(userInfo.worker_birthday))

    // if(isValidDate(userInfo.worker_birthday))
  }

  const optionsGender = ["Male", "Female"];

  return (
    <div className="add_worker__container" onClick={handleFormClick}>
      <div className="add_worker__container-form">
        <div className="add_worker__container-form_title">
          <h1 className="add_worker__container-form_title-text">Edit worker</h1>
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
              Profile photo <span  onClick={() => fileInput.current.click()} style={{cursor: 'pointer'}}>Change profile photo</span>
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
                  selectedDay={userInfo?.worker_birthday}
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
                  handleClickSearchTree={() =>
                    handleTree(
                      optionsCompany.filter(
                        (el) => el.name === userInfo.worker_company
                      )[0].id,
                      userInfo.worker_name, 
                      userInfo.worker_surname
                    )
                  }
                />
                {console.log(
                  optionsCompany.filter(
                    (el) => el.name === userInfo.worker_company
                  )
                )}
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
                  type="text"
                  id="worker_phone"
                  className="company_add_search__input"
                  onChange={handleDataChang1e}
                  value={userInfo?.worker_phone}
                  placeholder="Enter phone number"
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
                  readOnly
                />
              </label>
            </div>
          </div>
        </div>
        <div className="add_worker__container-form_controls">
          <button
            className="company_add__controls--btn btn_blue"
            onClick={handleUpdateWorker}
            style={{
              pointerEvents: !Object.values(userInfo).some(
                (el) => el === "" || el === null
              )
                ? "auto"
                : "none",
              opacity: !Object.values(userInfo).some(
                (el) => el === "" || el === null
              )
                ? "1"
                : ".65",
            }}
          >
            Save
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

export default EditWorker;
