import React, {useState} from 'react';
import './navbar.css'
import Logo from '../../assets/img/navbar-logo.svg'
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../reducers/userReducer";
import {getFiles, searchFiles} from "../../actions/file";
import {showLoader} from "../../reducers/appReducer";
import avatarLogo from '../../assets/img/avatar.svg'
import {API_URL} from "../../config";
import { setCurrentDir, setCurrentPath } from '../../reducers/fileReducer';

const Navbar = () => {
    const isAuth = useSelector(state => state.user.isAuth)
    const currentDir = useSelector(state => state.files.currentDir)
    const currentUser = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()
    const [searchName, setSearchName] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(false)
    const avatar = currentUser.avatar ? `${API_URL + currentUser.avatar}` : avatarLogo

    function searchChangeHandler(e){
        setSearchName(e.target.value)
    }

    function searchDispatchHandler(e) {
        
        if(e.key === 'Enter' || e.target === document.getElementById('searchInput')){
            if (searchTimeout != false) {
                clearTimeout(searchTimeout)
            }
            dispatch(showLoader())
            if(searchName != '') {
                setSearchTimeout(setTimeout((value) => {
                    dispatch(searchFiles(value));
                    setSearchName('')
                }, 100, searchName))
            } else {
                dispatch(getFiles(currentDir))
            }
        }
    }


    function handleRoot(event){
        dispatch(setCurrentDir(null))
        dispatch(setCurrentPath(''))
    }

    return (
        <div className="navbar">
            <div className="container">
                <h1 onClick={handleRoot}>Home INDEX</h1>
                {isAuth && <input
                    value={searchName}
                    onChange={e => searchChangeHandler(e)}
                    onKeyDown={e => searchDispatchHandler(e)}
                    className='navbar__search'
                    type="text"
                    placeholder="Название файла..."/>}
                {isAuth && <button id='searchInput' onClick={e => searchDispatchHandler(e)}>Search</button>}
                {!isAuth && <div className="navbar__login"><NavLink to="/login">Войти</NavLink></div> }
                {!isAuth && <div className="navbar__registration"><NavLink to="/registration">Регистрация</NavLink></div> }
                {isAuth && <div className="navbar__login" onClick={() => dispatch(logout()) }>Выход</div> }
                {isAuth && <NavLink to='/profile'>
                    <img className="navbar__avatar" src={avatar} alt=""/>
                </NavLink>}
            </div>
        </div>
    );
};

export default Navbar;
