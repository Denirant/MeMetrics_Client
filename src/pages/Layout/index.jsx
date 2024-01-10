import { Link, Outlet } from "react-router-dom";
import "./style.css";
import { useLocation, useNavigate } from "react-router-dom";

import AccountComponent from "../../components/AccountComponent/Account";
// import { readFileSync } from "fs";
// import { Agent } from "https";

import { getRefreshToken } from "../../actions/user";

import { useRef, useEffect } from "react";
import showCustomConfirm from "../../utils/showCustomConfirm";

import CloudIcon from "../../assets/img/MenuIcons/Cloud/Off.svg";
import ActiveCloudIcon from "../../assets/img/MenuIcons/Cloud/On.svg";

import DashboardIcon from "../../assets/img/MenuIcons/Dashboard/Off.svg";
import ActiveDashboardIcon from "../../assets/img/MenuIcons/Dashboard/On.svg";

import WorkersIcon from "../../assets/img/MenuIcons/Workers/Off.svg";
import ActiveWorkersIcon from "../../assets/img/MenuIcons/Workers/On.svg";

import CompaniesIcon from "../../assets/img/MenuIcons/Companies/Off.svg";
import ActiveCompaniesIcon from "../../assets/img/MenuIcons/Companies/On.svg";

import TasksIcon from "../../assets/img/MenuIcons/Tasks/Off.svg";
import ActiveTasksIcon from "../../assets/img/MenuIcons/Tasks/On.svg";

import MessengerIcon from "../../assets/img/MenuIcons/Messenger/Off.svg";
import ActiveMessengerIcon from "../../assets/img/MenuIcons/Messenger/On.svg";

import WalletIcon from "../../assets/img/MenuIcons/Wallet/Off.svg";
import ActiveWalletIcon from "../../assets/img/MenuIcons/Wallet/On.svg";

import SandBoxIcon from "../../assets/img/MenuIcons/SandBox/sandboxDefault.svg";
import SandBoxActiveIcon from "../../assets/img/MenuIcons/SandBox/sandboxActive.svg";

import BankIcon from "../../assets/img/MenuIcons/Bank/Off.svg";
import BankActiveIcon from "../../assets/img/MenuIcons/Bank/On.svg";

import Profile from "../../assets/img/MenuIcons/Ellipse 701.svg";
import Notification from "../../assets/img/MenuIcons/Off.svg";
import Logout from "../../assets/img/MenuIcons/Log-out.svg";

import LogoShort from "../../assets/img/LogoShort.svg";
import LogoLong from "../../assets/img/LogoLong.svg";

import themeLightActive from "../../assets/img/Sun/On.svg";
import themeLightDefault from "../../assets/img/Sun/Off.svg";
import themeDarkActive from "../../assets/img/Moon/On.svg";
import themeDarkDefault from "../../assets/img/Moon/Off.svg";

import updateItemWidth from "../../utils/changeFileSize";

import { useOutsideClick } from "../../utils/useOutsideClick";

import NotificationOverlay from "../../components/NotificationOverlay";

import NotificationFrame from "../../components/NotificationFrame";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../../reducers/userReducer";
import axios from "axios"; // Импортируйте Axios

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeRef, setActiveRef] = useState(
    "/" +
      window.location.pathname
        .slice(1, window.location.pathname.length)
        .split("/")[0]
  );

  const savedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(savedTheme || getSystemTheme());

  const dispatch = useDispatch();

  const asideRef = useRef(null);

  const [isOpen, setIsOpen] = useOutsideClick(asideRef, () => {
    const savedState = localStorage.getItem("isOpen");
    return savedState ? JSON.parse(savedState) : false;
  });

  const toggleIsOpen = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    localStorage.setItem("isOpen", JSON.stringify(!isOpen));

    dispatch(setNotification(false));
  };

  const asideElements = [
    {
      icon: {
        default: DashboardIcon,
        active: ActiveDashboardIcon,
      },
      text: "Dashboard",
      link: "/",
    },
    {
      icon: {
        default: CloudIcon,
        active: ActiveCloudIcon,
      },
      text: "Cloud",
      link: "/cloud",
    },
    {
      icon: {
        default: WorkersIcon,
        active: ActiveWorkersIcon,
      },
      text: "Workers",
      link: "/workers",
    },
    {
      icon: {
        default: CompaniesIcon,
        active: ActiveCompaniesIcon,
      },
      text: "Companies",
      link: "/company",
    },
    // {
    //   icon: {
    //     default: TasksIcon,
    //     active: ActiveTasksIcon,
    //   },
    //   text: "Tasks",
    //   link: "/task",
    // },
    // {
    //   icon: {
    //     default: MessengerIcon,
    //     active: ActiveMessengerIcon,
    //   },
    //   text: "Messenger",
    //   link: "/messenger",
    // },
    // {
    //   icon: {
    //     default: WalletIcon,
    //     active: ActiveWalletIcon,
    //   },
    //   text: "Wallet",
    //   link: "/wallet",
    // },
    // {
    //   icon: {
    //     default: SandBoxIcon,
    //     active: SandBoxActiveIcon,
    //   },
    //   text: "Sandbox",
    //   link: "/sandbox",
    // },
    {
      icon: {
        default: BankIcon,
        active: BankActiveIcon,
      },
      text: "Bank mock",
      link: "/bank",
    },
  ];

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // Функция для установки текущей темы и сохранения ее в localStorage
  function handleThemeToggle() {
    const newTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  }

  function handleMenuClick(ref) {
    setActiveRef(ref);
    navigate(ref);

    dispatch(setNotification(false));

    setIsOpen(false);
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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (code && state) {
      console.log("code:", code);
      console.log("state:", state);

      dispatch(getRefreshToken(code, state))
    }
  }, [location.search, navigate, dispatch]);

  const notifications = useSelector((state) => state.notification);

  const isNotification = useSelector((state) => state.user.isNotification);

  function handleNotification(e) {
    dispatch(setNotification(!isNotification));

    setIsOpen(false);
    localStorage.setItem("isOpen", JSON.stringify(false));
  }

  const [isMenu, setIsMenu] = useState(false);

  function handleAccountClick(e){
    setIsMenu(!isMenu);
  }

  return (
    <div className="aside">
      <div className="aside_container">
        <nav
          id="webNav"
          ref={asideRef}
          className={`aside_menu ${!isOpen ? "close" : ""}`}
        >
          <div className="menu_logo__container">
            <img className="menu_logo" src={LogoLong} alt="logo" />
          </div>
          <ul className="menu_container">
            {asideElements.map((el, index) => (
              <li
                onClick={() => handleMenuClick(el.link)}
                className={`menu_container-element ${
                  activeRef === el.link ? "active" : ""
                }`}
              >
                <img
                  style={{ objectFit: "cover" }}
                  width={48}
                  height={48}
                  src={activeRef === el.link ? el.icon.active : el.icon.default}
                  alt="menu icon"
                />
                <p>{el.text}</p>
              </li>
            ))}
          </ul>
          <ul className="menu_container">
            <li className={`menu_container-element`} onClick={handleAccountClick}>
              <img
                className="menu_container_image"
                src={Profile}
                alt="menu icon"
                
              />
              <p>Profile</p>
            </li>
            <li
              id="notification_btn"
              onClick={handleNotification}
              className={`menu_container-element`}
            >
              <img
                className={`menu_container_image`}
                src={Notification}
                alt="menu icon"
              />
              <p>Notification</p>
              {notifications.filter((notification) =>
                ["top right", "bottom right"].includes(notification.position)
              ).length > 0 && <div className="status"></div>}
            </li>
            <li onClick={handleLogout} className={`menu_container-element`}>
              <img
                className="menu_container_image"
                src={Logout}
                alt="menu icon"
              />
              <p>Log out</p>
            </li>
          </ul>
          {/* <div className="toggle_container">Toggle theme</div> */}
          <button
            onClick={handleThemeToggle}
            className={`toggle_container ${theme}`}
          >
            <div className="theme_toggle">
              <img
                className="theme_toggle__icon"
                src={theme !== "dark" ? themeLightActive : themeLightDefault}
                alt="theme_icon"
              />
              <p className="theme_toggle__text">Light</p>
            </div>
            <div className="theme_toggle">
              <img
                className="theme_toggle__icon"
                src={theme === "dark" ? themeDarkActive : themeDarkDefault}
                alt="theme_icon"
              />
              <p className="theme_toggle__text">Dark</p>
            </div>
          </button>

          <button onClick={toggleIsOpen} className="minimalize_menu"></button>
        </nav>
      </div>
      <div className="content">
        {isNotification && <NotificationFrame />}
        {isMenu && <AccountComponent handleClose={handleAccountClick}/>}
        <NotificationOverlay />
        {/* <Userdropdown/> */}
        <fieldset className="content_field">
          <Outlet />
        </fieldset>
      </div>
    </div>
  );
};

export default Layout;
