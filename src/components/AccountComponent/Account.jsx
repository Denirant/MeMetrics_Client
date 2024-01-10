import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import UserIconDefault from "../../assets/img/Account/User.svg";
import UserIconActive from "../../assets/img/Account/UserLight.svg";
import NotificationIconDefault from "../../assets/img/Account/Notification.svg";
import NotificationIconActive from "../../assets/img/Account/NotificationLight.svg";
import SecurityIconDefault from "../../assets/img/Account/Lock.svg";
import SecurityIconActive from "../../assets/img/Account/LockLight.svg";
import LogoutIcon from "../../assets/img/Account/Log-out.svg";

import { useOutsideClick } from "../../utils/useOutsideClick";

import { API_URL } from "../../config";

import {
  getUser,
  updateUserPassword,
  uploadProfilePhoto,
} from "../../actions/user";

import doneImage from "../../assets/img/Account/Done_.svg";

import SunIcon from "../../assets/img/Account/Sun.svg";
import MoonIcon from "../../assets/img/Account/Moon.svg";
import ThemeLight from "../../assets/img/Account/Theme_light.svg";
import ThemeDark from "../../assets/img/Account/Theme_dark.svg";
import ThemeSystem from "../../assets/img/Account/Theme_system.svg";

import WorkersIcon from "../../assets/img/Workers.svg";
import CloudIcon from "../../assets/img/Cloud.svg";
import MessengerIcon from "../../assets/img/Messenger.svg";

import interactiveTop from "../../assets/img/NotificationsSettings/NotificationsInteractive/interactive_top.svg";
import interactiveBottom from "../../assets/img/NotificationsSettings/NotificationsInteractive/interactive_bottom.svg";

import actionTop from "../../assets/img/NotificationsSettings/NotificationsAction/action_top.svg";
import actionBottom from "../../assets/img/NotificationsSettings/NotificationsAction/action_bottom.svg";

import showCustomConfirm from "../../utils/showCustomConfirm";

import axios from "axios";
import { useDispatch } from "react-redux";

function AccountComponent({ handleClose }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const [selectedOptionAction, setSelectedOptionAction] =
    useState("action_position_1");

  const handleChangeAction = (event) => {
    setSelectedOptionAction(event.target.id);
  };

  const [selectedOptionInteractive, setSelectedOptionInteractive] = useState(
    "interactive_position_1"
  );

  const handleChangeInteractive = (event) => {
    setSelectedOptionInteractive(event.target.id);
  };

  const UserProfileData = {
    name: "Daniil",
    surname: "Yastrebov",
    photo:
      "https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-the-white-wall_273609-20597.jpg?size=626&ext=jpg&ga=GA1.1.386372595.1697673600&semt=sph",
    balance: "12000",
    gender: "Male",
    birthday: "12.10.1993",
    company: "Sony",
    position: "Developer",
    phone: "+7(911) 222-33-44",
    email: "important@mail.ru",
  };

  function handleAccountClick(e) {
    const targetElement = e.target.closest(".account_control--element");

    if (targetElement) {
      const elements = document.querySelectorAll(".account_control--element");
      const targetIndex = Array.from(elements)
        .slice(0, 3)
        .indexOf(targetElement);

      if (targetIndex !== -1) {
        setActiveIndex(targetIndex);
      }
    }
  }

  const [expandedItems, setExpandedItems] = useState([]);

  const handleItemClick = (index) => {
    // Создаем новый массив, копируя текущий, чтобы не изменять его напрямую
    const newExpandedItems = [...expandedItems];

    if (newExpandedItems.includes(index)) {
      // Если элемент уже раскрыт, скрываем его
      newExpandedItems.splice(newExpandedItems.indexOf(index), 1);
    } else {
      // Иначе, раскрываем выбранный элемент
      newExpandedItems.push(index);
    }

    setExpandedItems(newExpandedItems);
  };

  const [placementOpen, setPlacementOpen] = useState(true);
  const [termsOpen, setTermsOpen] = useState(true);
  const [items, setItems] = useState([
    {
      title: "Actions",
      icon: WorkersIcon,
      color: "#4876F9",
      description: "Some description information",
      content: [
        {
          title: "Actions",
          description: "Some description information",
          status: false,
        },
        {
          title: "Actions",
          description: "Some description information",
          status: true,
        },
        {
          title: "Actions",
          description: "Some description information",
          status: false,
        },
        {
          title: "Actions",
          description: "Some description information",
          status: false,
        },
      ],
    },
    {
      title: "Cloud",
      icon: CloudIcon,
      color: "#8748F9",
      description: "Some description information",
      content: [
        {
          title: "Actions",
          description: "Some description information",
          status: true,
        },
        {
          title: "Actions",
          description: "Some description information",
          status: true,
        },
        {
          title: "Actions",
          description: "Some description information",
          status: true,
        },
      ],
    },
    {
      title: "Messenger",
      icon: MessengerIcon,
      color: "#363737",
      description: "Some description information",
      content: [
        {
          title: "Actions",
          description: "Some description information",
          status: false,
        },
        {
          title: "Actions",
          description: "Some description information",
          status: true,
        },
        {
          title: "Actions",
          description: "Some description information",
          status: false,
        },
        {
          title: "Actions",
          description: "Some description information",
          status: false,
        },
      ],
    },
  ]);

  const [user, setUser] = useState("");
  const dispatch = useDispatch();

  const handleCheckboxClick = (itemIndex, subItemIndex) => {
    // Создаем копию элемента, чтобы избежать изменения исходных данных
    const newItems = [...items];
    newItems[itemIndex].content[subItemIndex].status =
      !newItems[itemIndex].content[subItemIndex].status;

    // Обновляем состояние элементов
    setExpandedItems([...expandedItems]);
    setItems(newItems);
  };

  function handleCloseAccount(e) {
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      // Ваш код обработки закрытия элемента
      handleClose();
    }
  }

  const handleLogout = async (e) => {
    const confirmed = await showCustomConfirm(
      "Are you sure you want to logout?",
      "Ok",
      "Logout action"
    );

    if (confirmed) {
      e.preventDefault();
      localStorage.clear();
      window.location = "/";
    }
  };

  async function getUserData() {
    try {
      setUser(await getUser()());
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const [enterPasswordStatus, setEnterPasswordStatus] = useState(false);
  const [enterPassword, setEnterPassword] = useState("");

  const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (!isChangingPassword) {
      setConfirmPassword("");
      setEnterPassword("");

      setConfirmPasswordStatus(false);
      setEnterPasswordStatus(false);
    }

    setIsChangingPassword(!isChangingPassword);
  };

  const [changeError, setChangeError] = useState(null);

  async function updatePassword(passwordArg) {
    try {
      await updateUserPassword(passwordArg);
    } catch (error) {
      console.log(error);
    }
  }

  const validatePassword = async () => {
    // Получаем значения паролей
    const newPassword_val = enterPassword;
    const confirmPassword_val = confirmPassword;

    console.log(newPassword_val);
    console.log(confirmPassword_val);

    // Проверяем, что оба пароля заполнены
    if (!newPassword_val || !confirmPassword_val) {
      // Если одно из полей не заполнено, обводим его красным
      if (!newPassword_val) {
        // Обводим поле для нового пароля в красный
        // Это можно сделать, например, добавив класс CSS с красной обводкой
        // Можно также добавить логику для удаления класса, если поле заполнено
        setChangeError("New password is required");
        return;
      }
      if (!confirmPassword_val) {
        // Обводим поле для подтверждения пароля в красный
        setChangeError("Confirm password is required");
        return;
      }
    } else {
      // Оба пароля заполнены, проверяем, совпадают ли они
      if (newPassword_val !== confirmPassword_val) {
        setChangeError("Passwords do not match");
        return;
      } else {
        // Пароли совпадают, проверяем, соответствуют ли условиям
        const passwordPattern = /^(?=.*[0-9!“#$%‘()*])[\S]{8,}$/;

        if (!passwordPattern.test(newPassword_val)) {
          setChangeError("Invalid password");
          return;
        } else {
          try {
            await updatePassword(enterPassword);

            setChangeError(null);
            setConfirmPassword("");
            setEnterPassword("");

            setConfirmPasswordStatus(false);
            setEnterPasswordStatus(false);

            setIsChangingPassword(false);

            setIsChanged(true);
          } catch (error) {
            setChangeError(error.message);
          }
        }
      }
    }
  };

  const fileInput = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      await uploadProfilePhoto(selectedFile);
      await getUserData();
    }
  };

  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(useOutsideClick(dropdownRef, false));
  const [selectedOption, setSelectedOption] = useState('United States');
  


  return (
    <div className="account_container" onClick={handleCloseAccount}>
      <div className="account_content">
        <div className="close_btn_account" onClick={handleClose}></div>
        <ul className="account_control">
          <li
            className={`account_control--element ${
              activeIndex === 0 ? "active" : ""
            }`}
            onClick={handleAccountClick}
          >
            <img
              src={activeIndex === 0 ? UserIconActive : UserIconDefault}
              alt="accountElementIcon"
            />
            <p>General</p>
          </li>
          <li
            className={`account_control--element ${
              activeIndex === 1 ? "active" : ""
            }`}
            onClick={handleAccountClick}
          >
            <img
              src={
                activeIndex === 1
                  ? NotificationIconActive
                  : NotificationIconDefault
              }
              alt="accountElementIcon"
            />
            <p>Notifications</p>
          </li>
          <li
            className={`account_control--element ${
              activeIndex === 2 ? "active" : ""
            }`}
            onClick={handleAccountClick}
          >
            <img
              src={activeIndex === 2 ? SecurityIconActive : SecurityIconDefault}
              alt="accountElementIcon"
            />
            <p>Privacy and security</p>
          </li>

          <li
            className="account_control--element logout"
            onClick={handleLogout}
          >
            <img src={LogoutIcon} alt="accountElementIcon" />
            <p>Log out</p>
          </li>
        </ul>
        <div className="account_extern">
          {activeIndex === 0 && (
            <div className="general">
              <div className="general_header">
                <h1 className="general_title">
                  Profile details
                  <span>The last update: 12.09.2023</span>
                </h1>
                <div className="general_short">
                  <div className="general_short--data">
                    <img src={API_URL + user.photoUrl} alt="account info" />
                    <h2>
                      {user.firstName} {user.lastName}{" "}
                      <span>
                        <input
                          type="file"
                          accept="image/*"
                          name="photo" // Укажите имя поля как 'photo'
                          style={{ display: "none" }}
                          ref={fileInput}
                          onChange={handleFileChange}
                        />
                        <span onClick={() => fileInput.current.click()}>
                          Change profile photo
                        </span>
                      </span>
                    </h2>
                  </div>
                  <div className="general_short--balance">
                    Balance
                    <span>{user.balance ?? 0} $</span>
                    {console.log(user)}
                  </div>
                </div>
                <ul className="general_info">
                  <li className="general_info--element">
                    <h3 className="general_info--subtitle">Gender</h3>
                    <p className="general_info--content">{user.gender}</p>
                  </li>
                  <li className="general_info--element">
                    <h3 className="general_info--subtitle">Position</h3>
                    <p className="general_info--content">{user.position}</p>
                  </li>
                  <li className="general_info--element">
                    <h3 className="general_info--subtitle">Birthday</h3>
                    <p className="general_info--content">
                      {user.birthday ?? "None"}
                    </p>
                  </li>
                  <li className="general_info--element">
                    <h3 className="general_info--subtitle">Contact phone</h3>
                    <p className="general_info--content">{user.phone}</p>
                  </li>
                  <li className="general_info--element">
                    <h3 className="general_info--subtitle">Company</h3>
                    <p className="general_info--content">{['MeMetrics', 'ActionCompany', 'GeoTech'].join(', ')}</p>
                  </li>
                  <li className="general_info--element">
                    <h3 className="general_info--subtitle">Email</h3>
                    <p className="general_info--content">{user.email}</p>
                  </li>
                </ul>
              </div>
              <div>
                <h1 className="general_title">General</h1>
                <ul className="dropdown_list">
                  <li className="dropdown_container">
                    <div className="dropdown_body">
                      <h2>Country</h2>
                      <p>United States</p>
                    </div>
                    <div className="dropdown_icon"></div>
                  </li>

                  <li className="dropdown_container">
                    <div className="dropdown_body">
                      <h2>Country</h2>
                      <p>United States</p>
                    </div>
                    <div className="dropdown_icon"></div>
                  </li>
                </ul>
              </div>
              <div>
                <h1 className="general_title">Themes</h1>
                <ul className="theme_container">
                  <li className="theme_container--item">
                    <h2 className="theme_container--title">
                      <img src={SunIcon} alt="theme_select_icon" />
                      Light theme
                    </h2>
                    <p className="theme_container--description">
                      This theme will be active when your system is set to
                      “light mode”
                    </p>
                    <img
                      src={ThemeLight}
                      className="theme_container--image"
                      alt="select_image"
                    />
                    <div className="radio_select">
                      <input
                        type="radio"
                        checked
                        name="radio_select_theme"
                        id="theme_light"
                      />
                      <label htmlFor="theme_light">Active light theme</label>
                    </div>
                  </li>
                  <li className="theme_container--item">
                    <h2 className="theme_container--title">
                      <img src={MoonIcon} alt="theme_select_icon" />
                      Dark theme
                    </h2>
                    <p className="theme_container--description">
                      This theme will be active when your system is set to
                      “light mode”
                    </p>
                    <img
                      src={ThemeDark}
                      className="theme_container--image"
                      alt="select_image"
                    />
                    <div className="radio_select">
                      <input
                        type="radio"
                        name="radio_select_theme"
                        id="theme_dark"
                      />
                      <label htmlFor="theme_dark">Active dark theme</label>
                    </div>
                  </li>
                  <li className="theme_container--item">
                    <h2 className="theme_container--title">
                      <img src={SunIcon} alt="theme_select_icon" />
                      System theme
                    </h2>
                    <p className="theme_container--description">
                      This theme will be active when your system is set to
                      “light mode”
                    </p>
                    <img
                      src={ThemeSystem}
                      className="theme_container--image"
                      alt="select_image"
                    />
                    <div className="radio_select">
                      <input
                        type="radio"
                        checked
                        name="radio_select_theme"
                        id="theme_system"
                      />
                      <label htmlFor="theme_system">Active system theme</label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {activeIndex === 1 && (
            <div className="notifications">
              <div className="notifications_section main">
                <h2 className="general_title">General</h2>
                <div className="notification_switch-container">
                  <p>
                    Actions
                    <span className="notification_date">
                      Password was modified 2 years ago
                    </span>
                  </p>
                  <div className="notification_toggle">
                    <input type="checkbox" id="actions" />
                    <label for="actions">Toggle</label>
                  </div>
                </div>
                <div className="notification_switch-container">
                  <p>
                    Informative
                    <span className="notification_date">Email</span>
                  </p>
                  <div className="notification_toggle">
                    <input type="checkbox" id="actions_2" />
                    <label for="actions_2">Toggle</label>
                  </div>
                </div>
              </div>
              <div className="notifications_section placement">
                <div
                  onClick={(e) => setPlacementOpen(!placementOpen)}
                  className="placement-header"
                >
                  <h2 className="general_title">
                    Location
                    <span>Select the appearance of notifications</span>
                  </h2>
                  <div
                    className={`placement-header-arrow ${
                      placementOpen ? "open" : ""
                    }`}
                  ></div>
                </div>
                <div
                  className={`placement-body ${placementOpen ? "open" : ""}`}
                >
                  <div className="placement-body-element">
                    <h3 className="placement-body-element-title">
                      Action notifications
                    </h3>
                    <img
                      src={
                        selectedOptionAction === "action_position_1"
                          ? actionTop
                          : actionBottom
                      }
                      alt="interactiveImage"
                    />
                    <ul className="placement-body-element-list">
                      <li className="placement-body-element-list-element">
                        <input
                          type="radio"
                          id="action_position_1"
                          name="action_position_select"
                          checked={selectedOptionAction === "action_position_1"}
                          onChange={handleChangeAction}
                        />
                        <label htmlFor="action_position_1">Top center</label>
                      </li>
                      <li className="placement-body-element-list-element">
                        <input
                          type="radio"
                          id="action_position_2"
                          name="action_position_select"
                          onChange={handleChangeAction}
                          checked={selectedOptionAction === "action_position_2"}
                        />
                        <label htmlFor="action_position_2">Bottom center</label>
                      </li>
                    </ul>
                  </div>
                  <div className="placement-body-element">
                    <h3 className="placement-body-element-title">
                      Action notifications
                    </h3>
                    <img
                      src={
                        selectedOptionInteractive === "interactive_position_1"
                          ? interactiveTop
                          : interactiveBottom
                      }
                      alt="interactiveImage"
                    />
                    <ul className="placement-body-element-list">
                      <li className="placement-body-element-list-element">
                        <input
                          type="radio"
                          id="interactive_position_1"
                          name="interactive_position_select"
                          onChange={handleChangeInteractive}
                          checked={
                            selectedOptionInteractive ===
                            "interactive_position_1"
                          }
                        />
                        <label htmlFor="interactive_position_1">
                          Top center
                        </label>
                      </li>
                      <li className="placement-body-element-list-element">
                        <input
                          type="radio"
                          id="interactive_position_2"
                          name="interactive_position_select"
                          onChange={handleChangeInteractive}
                          checked={
                            selectedOptionInteractive ===
                            "interactive_position_2"
                          }
                        />
                        <label htmlFor="interactive_position_2">
                          Bottom center
                        </label>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="notifications_section options">
                <h2 className="general_title">Notifications</h2>
                <ul className="notifications_list">
                  {items.map((item, index) => (
                    <li className="notifications_list-item" key={index}>
                      <div
                        className="notifications_list-item-header"
                        onClick={() => handleItemClick(index)}
                      >
                        <img
                          className="notifications_list-item-header-image"
                          style={{ backgroundColor: item.color }}
                          src={item.icon}
                          alt="list_notification_icon"
                        />
                        <p className="notifications_list-item-header-text">
                          {item.title}
                          <span>{item.description}</span>
                        </p>
                        <div
                          className={`notifications_list-item-header-arrow ${
                            expandedItems.includes(index) ? "open" : ""
                          }`}
                        ></div>
                      </div>
                      <div
                        className={`notifications_list-item-drop ${
                          expandedItems.includes(index) ? "open" : ""
                        }`}
                      >
                        {item.content.map((subItem, subIndex) => (
                          <div
                            key={subIndex}
                            className="notifications_list-item-drop-item"
                          >
                            <div className="notifications_list-item-drop-item-markup"></div>
                            <p className="notifications_list-item-drop-item-text">
                              {subItem.title}
                              <span>{subItem.description}</span>
                            </p>
                            <input
                              type="checkbox"
                              id={`actions_${index}_${subIndex}`}
                              checked={subItem.status}
                              onChange={() =>
                                handleCheckboxClick(index, subIndex)
                              }
                            />
                            <label htmlFor={`actions_${index}_${subIndex}`}>
                              Toggle
                            </label>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activeIndex === 2 && (
            <div className="security">
              <div className="security_section account">
                <h2 className="general_title">Account security</h2>
                <ul className="account-list">
                  <li className="account-list-item">
                    <div className="account-list-item-header">
                      <p className="account-list-item-text">
                        Password
                        <span>
                          {isChanged && !isChangingPassword ? (
                            <img
                              alt="dome image"
                              src={doneImage}
                              width={15}
                              height={15}
                            />
                          ) : (
                            ""
                          )}{" "}
                          {!isChangingPassword
                            ? "Password was modified 2 years ago"
                            : "The password must be at least 8 characters long and contain numbers and special characters (! “ # $ % ‘ () *)"}
                        </span>
                      </p>
                      <div className="account-list-item">
                        {!isChangingPassword && (
                          <p
                            className="account-list-item-link"
                            onClick={handleChangePassword}
                          >
                            Change password
                          </p>
                        )}
                      </div>
                    </div>
                    {isChangingPassword && (
                      <div className="account-list-item-change">
                        <div className="account-list-item-inputs">
                          <div className="account-list-item-input">
                            <input
                              className={`${
                                changeError === "New password is required" ||
                                changeError === "Passwords do not match" ||
                                changeError === "Invalid password"
                                  ? "border"
                                  : ""
                              }`}
                              type={enterPasswordStatus ? "text" : "password"}
                              placeholder="New password"
                              value={enterPassword}
                              onInput={(e) => setEnterPassword(e.target.value)}
                            />
                            <div
                              onClick={() =>
                                setEnterPasswordStatus(!enterPasswordStatus)
                              }
                              className={`eye-controller ${
                                enterPasswordStatus ? "show" : ""
                              }`}
                            ></div>
                          </div>
                          <div className="account-list-item-input">
                            <input
                              className={`${
                                changeError ===
                                  "Confirm password is required" ||
                                changeError === "Passwords do not match" ||
                                changeError === "Invalid password"
                                  ? "border"
                                  : ""
                              }`}
                              type={confirmPasswordStatus ? "text" : "password"}
                              placeholder="Confirm password"
                              value={confirmPassword}
                              onInput={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                            <div
                              onClick={() =>
                                setConfirmPasswordStatus(!confirmPasswordStatus)
                              }
                              className={`eye-controller ${
                                confirmPasswordStatus ? "show" : ""
                              }`}
                            ></div>
                          </div>
                        </div>
                        {changeError && (
                          <p className="change_error">{changeError}</p>
                        )}
                        <div className="account-list-item-control">
                          <button
                            className="btn_save"
                            onClick={validatePassword}
                          >
                            Save password
                          </button>
                          <button
                            className="btn_cancel"
                            onClick={handleChangePassword}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                  <li className="account-list-item">
                    <div className="notification_switch-container">
                      <p>
                        2-step verification
                        <span className="notification_date">Email</span>
                      </p>
                      <div className="notification_toggle">
                        <input type="checkbox" id="actions" />
                        <label for="actions">Toggle</label>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="security_section terms">
                <div
                  onClick={(e) => setTermsOpen(!termsOpen)}
                  className="terms-header"
                >
                  <h2 className="general_title">Terms of use</h2>
                  <div
                    className={`terms-header-arrow ${termsOpen ? "open" : ""}`}
                  ></div>
                </div>
                <ul className={`terms-list ${termsOpen ? "open" : ""}`}>
                  <li className="terms-list-item">
                    <p className="terms-list-item-text">
                      System user agreement
                    </p>
                    <a href="www.google.com" className="terms-list-item-link">
                      https://www.memetrics.com/file/1tLDFTZnBN6xNrcPwsP4p3/Intercom-id=
                    </a>
                  </li>
                  <li className="terms-list-item">
                    <p className="terms-list-item-text">
                      System user agreement
                    </p>
                    <a href="www.google.com" className="terms-list-item-link">
                      https://www.memetrics.com/file/1tLDFTZnBN6xNrcPwsP4p3/Intercom-id=
                    </a>
                  </li>
                </ul>
              </div>
              <div className="security_section support">
                <h2 className="general_title">Support</h2>
                <div className="faq_container">
                  <ul className="support-list">
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-1"
                      />
                      <label
                        htmlFor="answer-1"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          When was Memetrics officially launched?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-2"
                      />
                      <label
                        htmlFor="answer-2"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          When was Memetrics officially launched?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-3"
                      />
                      <label
                        htmlFor="answer-3"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          When was Memetrics officially launched?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-4"
                      />
                      <label
                        htmlFor="answer-4"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          When was Memetrics officially launched?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-11"
                      />
                      <label
                        htmlFor="answer-11"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          What is your favorite template from BRIX Templates?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-12"
                      />
                      <label
                        htmlFor="answer-12"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          When was Memetrics officially launched?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                  </ul>
                  <ul className="support-list">
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-5"
                      />
                      <label
                        htmlFor="answer-5"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          When was Memetrics officially launched?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-6"
                      />
                      <label
                        htmlFor="answer-6"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          When was Memetrics officially launched?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-7"
                      />
                      <label
                        htmlFor="answer-7"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          Why is Memetrics and why is it the best product for
                          the companies?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-8"
                      />
                      <label
                        htmlFor="answer-8"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          When was Memetrics officially launched?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-9"
                      />
                      <label
                        htmlFor="answer-9"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          Why is Memetrics and why is it the best product for
                          the companies?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                    <li className="support-list-item">
                      <input
                        type="checkbox"
                        className="support-list-item-input"
                        id="answer-10"
                      />
                      <label
                        htmlFor="answer-10"
                        className="support-list-item-label"
                      >
                        <h2 className="support-list-item-label-title">
                          When was Memetrics officially launched?
                        </h2>
                        <div className="support-list-item-label-arrow"></div>
                      </label>
                      <p className="support-list-item-label-text">
                        Vitae congue eu consequat ac felis placerat vestibulum
                        lectus mauris ultrices. Cursus amet dictum sit amet
                        justo donec enim diam porttitor lacus.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountComponent;
