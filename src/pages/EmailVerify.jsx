import { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import style from './style.module.css';


const EmailVerify = () => {
    const [validUrl, setValidUrl] = useState(false);
    const param = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        const verifyEmailUrl = async() => {
            try{
                const config = {
                    params: {
                        id: param.id,
                        token: param.token
                    }
                }
                
                const url = `http://localhost:8080/api/users/verify`;

                const {data: res} = await axios.get(url, config);
                console.log(res);

                setValidUrl(true);
                setTimeout(() => {
                    navigate('/');
                }, 5000);
            }catch(error){
                setValidUrl(false);
            }
        };

        verifyEmailUrl();
    }, [param, navigate])

    return(
        <Fragment>
            {validUrl ? 
                (<div className={style.verify_container}>
                    <div className={style.success_checkmark}>
                        <div className={style.check_icon}>
                            <span className={`${style.icon_line} ${style.line_tip}`}></span>
                            <span className={`${style.icon_line} ${style.line_long}`}></span>
                            <div className={style.icon_circle}></div>
                            <div className={style.icon_fix}></div>
                        </div>
                    </div>

                    <p className={style.verify_info}>Your acccount was successfully created...</p>

                    <Link to='/'>
                        <button type='button' className={`${style.white_btn} ${style.white_btn__verify}`}>
                            Sign In    
                        </button> 
                    </Link>
                </div>) 
                    : 
                (<div className={style.verify_container}>
                    <h1>Not found <br /> Error 404</h1>
                </div>)
            }
        </Fragment>
    )
}

export default EmailVerify;