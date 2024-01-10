import { Route, Routes, Navigate } from "react-router-dom";
// import Main from './components/Main/index'
import Signup from "./pages/SignUp";
import Signin from "./pages/SignIn";
import EmailVerify from "./pages/EmailVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useEffect, useState } from "react";
// root Layout
import Layout from "./pages/Layout";
import HomePage from "./pages/Layout/HomePage";

// import RedirectPage from "./pages/Layout/RedirectPage";

import {
  AddCompany,
  CompanyPage,
  CompanyInfo,
  ShowCompanies,
} from "./pages/Layout/CompanyPage";

import OTPpage from "./pages/OTPpage";

import Welcome from "./pages/Welcome";

import "rsuite/dist/rsuite.min.css";
import { useDispatch, useSelector } from "react-redux";

import Kanban from "./pages/Layout/Kanban/Kanban";
import Demo from "./pages/Layout/Kanban/components/Demo";

import WorkerPage from "./pages/Layout/WorkerPage/Main";
// import AddWorker from './pages/Layout/WorkerPage/AddWorker/AddWorker';
import WorkerEmailVerify from "./pages/WorkerVerify";
import Worker from "./pages/Worker";
import Popup from "./components/disk/Popup";
//Company layout
import { auth, updateAccessToken } from "./actions/user";
import Disk from "./components/disk/Disk";
import { setClickedFile } from "./reducers/fileReducer";

import GridWithClick from "./components/NotificationGen";

import SandBoxComponent from "./pages/Layout/Sandbox";

import BankModuleContainer from "./components/Modules/BankModule/BankModuleContainer";
import { deleteCookie, getCookie } from "./utils/cookies";

function App() {
  const isAuth = useSelector((state) => state.user.isAuth);
  const dispatch = useDispatch();
  const popupDisplay = useSelector((state) => state.files.popupDisplay);

  useEffect(() => {
    dispatch(auth());

    if (!localStorage.getItem("alfaAccess") && getCookie('alfaRefresh')) {
      updateAccessToken();
    }else if(!getCookie('alfaRefresh')){
      localStorage.removeItem('alfaAccess');
      deleteCookie('alfaRefresh');
    }
  }, []);

  function handleAppClick(e) {
    if (localStorage.getItem("token") && !localStorage.getItem("status")) {
      const filePlate = e.target.closest(".file-plate");
      const suggetions = e.target.closest(".suggetions");

      if (!filePlate && !suggetions) {
        dispatch(setClickedFile(null));
      }
    }
  }

  return (
    <div className="app" onClick={handleAppClick}>
      {/* <OTPpage/> */}
      {popupDisplay && <Popup />}
      <Routes>
        {/* When user logged in, show root path */}
        {localStorage.getItem("token") && !localStorage.getItem("status") && (
          <Route path="/" exact element={<Layout />}>
            <Route index excet element={<HomePage />} />
            <Route path="company" excet element={<CompanyPage />}>
              <Route index excet element={<ShowCompanies />} />
              <Route path=":id" excet element={<CompanyInfo />} />
              <Route path="add" excet element={<AddCompany />} />
            </Route>
            <Route path="workers">
              <Route index excet element={<WorkerPage />} />
              {/* <Route path=':id' excet element={<CompanyInfo/>}/>*/}
              {/* <Route path='add' excet element={<AddWorker/>}/>  */}
            </Route>

            <Route path="kanban" excet element={<Kanban />} />
            <Route path="todo" excet element={<Demo />} />
            <Route path="cloud" excet element={<Disk />} />

            {/* Dev(release delete) routes */}

            <Route path="sandbox" excet element={<SandBoxComponent />} />
            <Route path="bank" excet element={<BankModuleContainer />} />
          </Route>
        )}

        {localStorage.getItem("token") && localStorage.getItem("status") && (
          <Route path="/" exact element={<Worker />}>
            <Route index excet element={<Worker />} />
          </Route>
        )}

        <Route path="/" exact element={<Welcome />} />

        {/* :id, :token - параметр для запроса GET с двоеточием  */}
        <Route path="/user/:id/verify/:token" element={<EmailVerify />} />
        <Route
          path="/worker/:id/verify/:token"
          element={<WorkerEmailVerify />}
        />
        <Route path="/user/:id/otp" element={<OTPpage />} />

        <Route path="/password-reset" element={<ForgotPassword />} />
        <Route path="/password-reset/:id/:token" element={<ResetPassword />} />
      </Routes>

      {/* Main, Dashboard, --Companies--, --Agents--, Matrix, ++settings++, wallet*/}
    </div>
  );
}

export default App;

// TODO: Интерфейс добавления событий
// TODO: Серверная логика добавления событий
// TODO: Собрать прототип экрана компании
// TODO: Добавить анимированные переходы между пользователем и списком пользователей
// TODO: Додумать страницу с отображением всех пользователей
// TODO: Продумать отслеживание выполненности задачи
// TODO: Додумать шорткаты по действиям с пользователями
// TODO: Перенести прогресс задач над пользователями
// TODO: Сделать задачу повыше
// TODO: Минимальное Ограничение на 4-5 строчек
// FIXME: Исправь добавление пользовательских фотографий
