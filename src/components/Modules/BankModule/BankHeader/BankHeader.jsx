import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from "react";
import AddIcon from "../../../../assets/img/plus-small.svg";
import ReloadIcon from "../../../../assets/img/reload_white.svg";
import SettingsIcon from "../../../../assets/img/settings.svg";
import CalendarIcon from "../../../../assets/img/calendar.svg";
import SelectAllIcon from "../../../../assets/img/selectAll.png";

import AlfaIcon from "../../../../assets/img/BankIcons/alfaBank.svg";
import TinkoffIcon from "../../../../assets/img/Banks/Tinkoff.png";
import VTBIcon from "../../../../assets/img/Banks/VTB.png";
import MTSIcon from "../../../../assets/img/Banks/MTS.jpeg";

import generateState from "../../../../utils/generateState";
import { deleteCookie } from "../../../../utils/cookies";

import arrowDown from '../../../../assets/img/Arrow-down.svg'

import { useDispatch } from "react-redux";
import {
  getInfoBank,
  paymentInfo,
  revokeRefreshToken,
  summeryInfo,
} from "../../../../actions/user";

import showCustomConfirm from "../../../../utils/showCustomConfirm";
import DropdownWithoutEnter from "../../../DropdownWithoutEnter";

import axios from "axios";
import { useOutsideClick } from "../../../../utils/useOutsideClick";

const BankHeader = forwardRef(
  ({ banksArray = [], onIsDashboardChange }, _ref) => {
    const [selectedOption, setSelectedOption] = useState("Year");
    const [isDashboard, setIsDeshboard] = useState(true);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const dispatch = useDispatch();

    const [isLoggin, setIsLoggin] = useState(
      localStorage.getItem("alfaAccess") ? true : false
    );

    const handleOptionChange = (value) => {
      setSelectedOption(value);
    };

    const handleDashboardToggle = (e) => {
      setIsDeshboard(!isDashboard);
      onIsDashboardChange(!isDashboard);
    };

    useEffect(() => {
      // Вы можете отслеживать изменения isDashboard здесь
      console.log("isDashboard changed:", isDashboard);
    }, [isDashboard]);

    const togglePopup = () => {
      setPopupVisible(!isPopupVisible);
    };

    const handleTabClick = (e, index) => {
      setSelectedTab(index);
    };

    async function handleTinkoffAction() {
      try {
        // const url = 'https://business.tinkoff.ru/openapi/sandbox/api/v1/bank-statement';
        // const params = {
        //   accountNumber: '99998888777766665555',
        //   from: '2021-11-03',
        //   till: '2021-11-03',
        // };

        const url = "https://id.tinkoff.ru/auth/authorize";
        const params = {
          client_id: "%client_id%",
          redirect_uri: "http://localhost:3000",
          state: generateState(10),
          response_type: "code",
        };

        const { data: res } = await axios.get(url, { params });

        console.log(res.code);
      } catch (error) {
        console.log(error);
      }
    }

    const bankInfo = [
      {
        name: "Alfa",
        icon: AlfaIcon,
        link: {
          text: "alfabank.ru",
          href: "alfabank.ru",
        },
        handle: () => handleLoginAlfa(),
      },
      {
        name: "Tinkoff",
        icon: TinkoffIcon,
        link: {
          text: "alfabank.ru",
          href: "alfabank.ru",
        },
        handle: () => handleTinkoffAction(),
      },
      {
        name: "VTB",
        icon: VTBIcon,
        link: {
          text: "alfabank.ru",
          href: "alfabank.ru",
        },
        handle: () => handleLoginAlfa(),
      },
      {
        name: "MTS",
        icon: MTSIcon,
        link: {
          text: "alfabank.ru",
          href: "alfabank.ru",
        },
        handle: () => handleLoginAlfa(),
      },
    ];

    const dropdownRef = useRef(null);

    const handleLoginAlfa = async () => {
      console.log(localStorage.getItem("alfaAccess"));
      if (!localStorage.getItem("alfaAccess")) {
        const client_id = "71b0076b-f0fa-4142-884a-0cafe5e16992",
          redirect_uri = "http://localhost:3000",
          scope = [
            "customer",
            "transactions",
            "openid",
            "profile",
            "email",
            "phone",
            "eio",
            "role",
            "inn",
          ],
          state = generateState(10),
          link = `https://id.alfabank.ru/oidc/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
            "%20"
          )}&state=${state}`;

        window.location.href = link;
      } else {
        const confirmed = await showCustomConfirm(
          "Are you sure you want to log out of the bank",
          "Logout",
          "Cancel"
        );

        if (confirmed) {
          deleteCookie("alfaRefresh");
          localStorage.removeItem("alfaAccess");
          setIsLoggin(false);
          console.log("End");

          dispatch(revokeRefreshToken());
        }
      }
    };

    function handleInfo() {
      try {
        dispatch(getInfoBank);
      } catch (error) {
        console.log(error);
      }
    }

    async function handlePayment() {
      try {
        await dispatch(paymentInfo());
      } catch (error) {
        console.log(error);
      }
    }

    async function handleSummery() {
      try {
        await dispatch(summeryInfo());
      } catch (error) {
        console.log(error);
      }
    }

    // const dropdownRef = useRef(null);

    const options = [
      "Select account number",
      "1234 5678 9012 3456",
      "9876 5432 1098 7654",
      "5432 1098 7654 3210",
      "2468 1357 9000 1111",
    ];

    // const handleGetSelectedValue = () => {
    //   const selectedValue = dropdownRef.current.getSelectedValue();
    //   alert(`Selected Value: ${selectedValue}`);
    // };

    const [checkboxState, setCheckboxState] = useState({
      checkbox1: true,
      checkbox2: true,
      checkbox3: true,
    });

    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      setCheckboxState((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    };

    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [isActive, setIsActive] = useOutsideClick(dropdownRef, false);

    console.log(isActive);

    const handleToggleAll = () => {
      setIsAllSelected(!isAllSelected);
      setSelectedCompanies(isAllSelected ? [] : banksArray.map((el) => el.id));
    };

    console.log(banksArray)

    const handleToggleCompany = (companyId) => {
      setSelectedCompanies((prevSelected) => {
        if (prevSelected.includes(companyId)) {
          return prevSelected.filter((id) => id !== companyId);
        } else {
          return [...prevSelected, companyId];
        }
      });
    };

    return (
      <div className="bank_header-container">
        {isPopupVisible && (
          <div className="popup">
            <div className="popup-content">
              <ul className="popup-content__select">
                {bankInfo.map((el, index) => (
                  <li
                    onClick={(e) => handleTabClick(e, index)}
                    className={`popup-content__select-item ${
                      selectedTab === index ? "active" : ""
                    }`}
                  >
                    {el.name}
                  </li>
                ))}
              </ul>
              <div className="popup-content__info">
                <div className="popup-content__info-header">
                  <button
                    className="popup-close"
                    onClick={togglePopup}
                  ></button>
                  <div className="popup-content__info-about">
                    <img src={bankInfo[selectedTab].icon} alt="bank logo" />
                    <h1>
                      {bankInfo[selectedTab].name}{" "}
                      <span>
                        <a
                          target="_blank"
                          href={"http://" + bankInfo[selectedTab].link.href}
                          rel="noreferrer"
                        >
                          {bankInfo[selectedTab].link.text}
                        </a>
                      </span>
                    </h1>
                  </div>
                  <button
                    onClick={(e) => bankInfo[selectedTab].handle()}
                    className={`popup-content__info-login ${
                      isLoggin ? "logout" : ""
                    }`}
                  >
                    {isLoggin ? "Logout" : "Login"}
                  </button>
                </div>
                <div>
                  <DropdownWithoutEnter options={options} />
                  {/* <button onClick={handleGetSelectedValue}> */}
                  Get Selected Value
                  {/* </button> */}
                </div>
                {isLoggin && (
                  <div className="popup-content__info-body">
                    <button onClick={handleInfo}>Get info</button> <br /> <br />
                    <button onClick={handlePayment}>
                      Get payment
                    </button> <br /> <br />
                    <button onClick={handleSummery}>
                      Get summery
                    </button> <br /> <br />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <ul className="bank_header-list">
          <li
            className={`bank_header-element ${isActive ? "active" : ""}`}
            ref={dropdownRef}
          >
            <span className="bank_header-element-text">All companies</span>
            <img src={arrowDown} width={16} height={16} alt="" style={{marginLeft: '8px'}}/>
            {isActive && (
              <div className="dropdown-content">
                <div className="dropdown-item" onClick={handleToggleAll}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleAll}
                  />
                  <span>All companies</span>
                </div>
                {banksArray.map((el) => (
                  <div
                    className="dropdown-item"
                    key={el.id}
                    onClick={() => handleToggleCompany(el.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(el.id)}
                      onChange={() => handleToggleCompany(el.id)}
                    />
                    <span>{el.name}</span>
                  </div>
                ))}
              </div>
            )}
          </li>

          <li
            className={`bank_header-element ${isAllSelected ? "active" : ""}`}
            onClick={handleToggleAll}
          >
            <span className="bank_header-element-text">All companies</span>
          </li>

          {banksArray.map((el, index) => (
            <li
              className={`bank_header-element ${
                selectedCompanies.includes(el.id) ? "selected" : ""
              }`}
              
              key={index}
              onClick={() => handleToggleCompany(el.id)}
            >
               <input
      type="checkbox"
      id={`checkbox-${index}`}
      checked={selectedCompanies.includes(el.id)}
      onChange={() => handleToggleCompany(el.id)}
    />
    <label htmlFor={`checkbox-${el.id}`}>
    </label>
              <img src={el.icon} alt="bank_logo" />
            </li>
          ))}

          {/* Кнопка "Add" */}
          <li
            className="bank_header-element bank_header-element__empty"
            onClick={togglePopup}
          >
            <img style={{filter: 'invert(100%)'}} src={AddIcon} alt="logo" />
            <span className="bank_header-element-text">Add bank</span>
          </li>

          {/* Кнопка с иконкой обновления */}
          <li className="bank_header-element bank_header-element__icon">
            <img width={16} height={16} src={ReloadIcon} alt="logo" />
          </li>
        </ul>

        <div className="header-tools">
          <div className="bank_header-control">
            <div className="bank_header-toggle">
              <input
                type="checkbox"
                id="radio_toggle"
                checked={!isDashboard}
                onChange={handleDashboardToggle}
              />
              <label htmlFor="radio_toggle">
                <span className="bank_header-element bank_header-element__left">
                  Dashboard
                </span>
                <span className="bank_header-element bank_header-element__right">
                  History
                </span>
              </label>
            </div>
            <div className="blank_header-selector">
              <ul className="blank_header-selector--list">
                <li className="blank_header-selector--element">
                  <input
                    type="radio"
                    name="select_date"
                    id="select_date_1"
                    checked={selectedOption === "Year"}
                    onChange={() => handleOptionChange("Year")}
                  />
                  <label htmlFor="select_date_1">Year</label>
                </li>
                <li className="blank_header-selector--element">
                  <input
                    type="radio"
                    name="select_date"
                    id="select_date_2"
                    checked={selectedOption === "Month"}
                    onChange={() => handleOptionChange("Month")}
                  />
                  <label htmlFor="select_date_2">Month</label>
                </li>
                <li className="blank_header-selector--element">
                  <input
                    type="radio"
                    name="select_date"
                    id="select_date_3"
                    checked={selectedOption === "Week"}
                    onChange={() => handleOptionChange("Week")}
                  />
                  <label htmlFor="select_date_3">Week</label>
                </li>
                <li className="blank_header-selector--element">
                  <input
                    type="radio"
                    name="select_date"
                    id="select_date_4"
                    checked={selectedOption === "Day"}
                    onChange={() => handleOptionChange("Day")}
                  />
                  <label htmlFor="select_date_4">Day</label>
                </li>
                <li className="blank_header-selector--element">
                  <input
                    type="radio"
                    name="select_date"
                    id="select_date_5"
                    checked={selectedOption === "Period"}
                    onChange={() => handleOptionChange("Period")}
                  />
                  <label htmlFor="select_date_5">Period</label>
                </li>
              </ul>

              {/* <button className="blank_header-selector--button">
                <img src={CalendarIcon} alt="Calendar icon" />
                <span>Выбрать дату</span>
              </button> */}
            </div>
          </div>
          <div className={`header-currency ${!isDashboard ? "hide" : ""}`}>
            <h1>Rates</h1>
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  name="checkbox1"
                  checked={checkboxState.checkbox1}
                  onChange={handleCheckboxChange}
                />
                Exchange
              </label>
              <label>
                <input
                  type="checkbox"
                  name="checkbox2"
                  checked={checkboxState.checkbox2}
                  onChange={handleCheckboxChange}
                />
                Stock
              </label>
              <label>
                <input
                  type="checkbox"
                  name="checkbox3"
                  checked={checkboxState.checkbox3}
                  onChange={handleCheckboxChange}
                />
                Crypto
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default BankHeader;

// Параметры графика, с линейного на гистограму

// openssl pkcs12 -export -out MeMetrics.pfx -inkey /Users/daniil/MeMetrics.key -in /Users/daniil/Downloads/AktioM/MeMetrics_2023.cer -certfile keys/root_apica_2022.cer -certfile keys/sub_root_apica_2022.cer

// openssl pkcs12 -export -out MeMetrics.pfx -inkey MeMetrics.key -in /Users/daniil/Downloads/MeMetrics_2023.cer -certfile /Users/daniil/Downloads/apica_2022_chain.cer
