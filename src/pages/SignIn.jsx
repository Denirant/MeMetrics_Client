import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import style from './style.module.css';
import GoogleAuth from '../components/GoogleAuth/googleAuth';
import { useDispatch } from 'react-redux';
import { setUser } from '../reducers/userReducer';

const Signin = ({handleClose, handleSwitch}) => {

    const [data, setData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [isOTP, setIsOTP] = useState(false);
    const [userId, setUserId] = useState(null);
    // указание по ключу currentTarget
    const handleChange = ({currentTarget: input}) => {
        setData({...data, [input.name]: input.value})
    }

    const dispatch = useDispatch();

    async function generateCode(id){
        try{	
            const {data: res} = await axios.get('http://localhost:8080/api/users/OTP', {params: {id: id}});

            alert(res.message);
        }catch(error){
            console.log(error);
        }
    }

    async function toggleOtp() {
        await setIsOTP(!isOTP);
        console.log(isOTP)
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        try{
            const url = 'http://localhost:8080/api/users/login';
            const {data: res} = await axios.post(url, data);

            localStorage.setItem('token', res.data);
            localStorage.setItem('id', res.id);
            localStorage.setItem('email', res.email);

            window.location = '/';

            return;
        }catch(error){
            if(error.response && error.response.status >= 400 && error.response.status <= 500){
                

                if(error.response.data.message === 'Invalid Email or Password!'){

                    try{
                        const url = 'http://localhost:8080/api/workers/login';
                        const {data: res} = await axios.post(url, data);
            
                        // записываем jwt token  в локальное хранилище
                        localStorage.setItem('token', res.data);
                        localStorage.setItem('id', res.id);

                        if(res.status === 'worker'){
                            localStorage.setItem('status', res.status);
                        }
            
                        window.location = '/';
            
                        return;
                    }catch(error){
                        if(error.response && error.response.status >= 400 && error.response.status <= 500){
                            setError(error.response.data.message);
                        }
            
                        return;
                    }
                }
            }

            return;
        }
    }

    const handleToggle = ({currentTarget: span}) => {
        // toggle --- если класс приписан, то мы его удаляем, иначе добавляем
        span.classList.toggle(style.toggle_eye_close);

        setShowPass(!showPass);
    }

    return (
        <div className={style.signin_container}>
            <div className={style.signin_form_container}>
                <div className={style.signin_left}>
                    <div onClick={handleClose} style={{alignSelf: 'flex-end'}}></div>
                    <form className={style.signin_form} onSubmit={handleSubmit}>
                        <h1>Login to your account</h1>
                        <input type='email' placeholder='Email...' name='email' onChange={handleChange} required value={data.email} className={style.signin_input}/>
                        <div className={style.password_field}>
                            <input type={(showPass) ? 'text' : 'password'} placeholder='Password...' name='password' onChange={handleChange} required value={data.password} className={style.signin_input}/>
                            <span className={style.toggle_eye} onClick={handleToggle}></span>
                        </div>

                        <Link to='/password-reset' style={{alignSelf: "flex-start"}}>
                            <p>Forgot password?</p>
                        </Link>


                        {error && <p className='error_msg'> {error}</p>}

                        <GoogleAuth/>

                        <button type='submit' className={style.black_btn}>
                            Sign In
                        </button>

                        <button onClick={handleSwitch} type="button">Создать аккаунт</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signin;