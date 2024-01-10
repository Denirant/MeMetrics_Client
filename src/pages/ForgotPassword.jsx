import { useState } from 'react';
import axios from 'axios';
import style from './style.module.css';


const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try{
            const url = 'https://memetricsserver.onrender.comapi/users/reset_check';
            const {data} = await axios.post(url, {email});
            setSuccess(data.message);
            setError('')
            
        }catch(error){
            if(error.response && error.response.status >= 400 && error.response.status <= 500){
                setError(error.response.data.message)
                setSuccess('')
            }
        }
    }

    

    return (
        <div className={style.container}>
            <form className={style.form_container} onSubmit={handleSubmit}>
                <h1>Forgot password</h1>
                <input
                    type="email"
                    placeholder='Email'
                    name='email'
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                    required
                    className={style.reset_input}

                />
                
                {error && <p className={style.error_msg}> {error}</p>}
                {success && <p className={style.success_msg}>{success}</p>}

                <button type='submit' className={style.black_btn}>
                    Send link
                </button>
            
            </form>
        </div>
    )
}

export default ForgotPassword;