import { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import style from './style.module.css';
// import Timer from '../TImer';

const ResetPassword = () => {
    const [validURL, setValidURL] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPass, setShowPass] = useState(false);
    // const [timer, setTimer] = useState(false);
    const params = useParams();

    console.log(params.id);

    const config = {
        params: {
            id: params.id,
            token: params.token
        }
    }
    const url = `https://memetricsserver.onrender.comapi/users/reset`
    
    const navigate = useNavigate();

    useEffect(() => {
        const verifyURL = async() => {
            try{
                const {data: res} = await axios.get(url, config);
                console.log(res)
                setValidURL(true);
            }catch(error){
                setValidURL(false);
            }
        }

        verifyURL();


    }, [url])

    const handleSubmit = async(event) => {
        event.preventDefault();
        try{
            if(password === passwordConfirm){
                const {data} = await axios.post(url, {password}, config);
                // setTimer(true)
                setSuccess(data.message);
                setError('')
                setTimeout(() => {
                    navigate('/signin');
                }, 5000);
            }else{
                setError('Пароли не совпадают...');
                setPassword('');
                setPasswordConfirm('');
            }
            
        }catch(error){
            if(error.response && error.response.status >= 400 && error.response.status <= 500){
                setError(error.response.data.message)
                setSuccess('')
            }
        }
    }

    const handleToggle = ({currentTarget: span}) => {
        span.classList.toggle(style.toggle_eye_close);
        setShowPass(!showPass);
    }

    return(
        <Fragment>
            {validURL ? 
                (<div className={style.container}>
                    
                    {/* {timer && <Timer time_await="5"/>} */}
                    <form className={style.form_container} onSubmit={handleSubmit}>
                        <h1>Enter new password</h1>
                        <div className={style.password_field}>
                            <input
                                type={(showPass) ? 'text' : 'password'}
                                placeholder='Password'
                                name='password1'
                                onChange={(event) => setPassword(event.target.value)}
                                value={password}
                                required
                                className={style.reset_input}
                            />

                            
                            <span className={style.toggle_eye} onClick={handleToggle}></span>
                        </div>

                        <div className={style.password_field}>
                            <input
                                type={(showPass) ? 'text' : 'password'}
                                placeholder='Confirm password'
                                name='password2'
                                onChange={(event) => setPasswordConfirm(event.target.value)}
                                value={passwordConfirm}
                                required
                                className={style.reset_input}
                            />

                            
                            <span className={style.toggle_eye} onClick={handleToggle}></span>
                        </div>
                        
        
                        {error && <p className={style.error_msg}> {error}</p>}
                        {success && <p className={style.success_msg}>{success}</p>}
        
                        <button type='submit' className={style.black_btn}>
                            Reset password
                        </button>
                    
                    </form>
                </div>) 
                    : 
                (<div className={style.verify_container}>
                    <h1>Not found <br /> Error 404</h1>
                </div>)
            }
        </Fragment>
    )
}

export default ResetPassword