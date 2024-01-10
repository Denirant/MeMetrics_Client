import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import GoogleAuth from '../components/GoogleAuth/googleAuth';



import style from './style.module.css';

const Signup = ({handleClose, handleSwitch}) => {

    const navigate = useNavigate()

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    // const maskPhone = (value) => {
    //     return value
    //       .replace(/\D/g, "")
    //       .replace(/(\d{3})(\d)/, "($1) $2")
    //       .replace(/(\d{3})(\d)/, "$1-$2")
    //       .replace(/(-\d{2})(\d+?)$/, "$1")
    //       .replace(/(-\d{2})(\d+?)$/, "$1");
    // };

    const [error, setError] = useState("");
    const [success, setSuccess] = useState('');
    const [showPass, setShowPass] = useState(false);
    // указание по ключу currentTarget
    const handleChange = async ({currentTarget: input}) => {
        await setData({...data, [input.name]: input.value})
        console.log(data);
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        setError('')
        try{
            const url = `https://memetricsserver.onrender.comapi/users/register`;
            const {data: res} = await axios.post(url, data);
            setSuccess(res.message);
            setTimeout(() => {
                window.location.reload();
            }, 10000);
        }catch(error){
            if(error.response && error.response.status >= 400 && error.response.status <= 500){
                setError(error.response.data.message);
            }
        }
    }

    const handleToggle = ({currentTarget: span}) => {
        // toggle --- если класс приписан, то мы его удаляем, иначе добавляем
        span.classList.toggle(style.toggle_eye_close);

        setShowPass(!showPass);
    }

    // const getInputNumbersValue = function (input) {
    //     // Return stripped input value — just numbers
    //     return input.value.replace(/\D/g, '');
    // }

    // const onPhoneInput = function (e) {
    //     var input = e.target,
    //         inputNumbersValue = getInputNumbersValue(input),
    //         selectionStart = input.selectionStart,
    //         formattedInputValue = "";

    //     if (!inputNumbersValue) {
    //         return input.value = "";
    //     }

    //     if (input.value.length !== selectionStart) {
    //         // Editing in the middle of input, not last symbol
    //         if (e.data && /\D/g.test(e.data)) {
    //             // Attempt to input non-numeric symbol
    //             input.value = inputNumbersValue;
    //         }
    //         return;
    //     }

    //     if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
    //         if (inputNumbersValue[0] === "9") inputNumbersValue = "7" + inputNumbersValue;
    //         var firstSymbols = (inputNumbersValue[0] === "8") ? "8" : "+7";
    //         formattedInputValue = input.value = firstSymbols + " ";
    //         if (inputNumbersValue.length > 1) {
    //             formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
    //         }
    //         if (inputNumbersValue.length >= 5) {
    //             formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
    //         }
    //         if (inputNumbersValue.length >= 8) {
    //             formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
    //         }
    //         if (inputNumbersValue.length >= 10) {
    //             formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
    //         }
    //     } else {
    //         formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
    //     }
    //     input.value = formattedInputValue;
    // }

    // const onPhoneKeyDown = function (e) {
    //     // Clear input after remove last symbol
    //     var inputValue = e.target.value.replace(/\D/g, '');
    //     if (e.keyCode === 8 && inputValue.length === 1) {
    //         e.target.value = "";
    //     }
    // }

    // const onPhonePaste = function (e) {
    //     var input = e.target,
    //         inputNumbersValue = getInputNumbersValue(input);
    //     var pasted = e.clipboardData || window.clipboardData;
    //     if (pasted) {
    //         var pastedText = pasted.getData('Text');
    //         if (/\D/g.test(pastedText)) {
    //             // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
    //             // formatting will be in onPhoneInput handler
    //             input.value = inputNumbersValue;
    //             return;
    //         }
    //     }
    // }

    return (
        <div className={style.signup_container}>
            <div className={style.signup_form_container}>
                <div className={style.signup_right}>
                    <div onClick={handleClose} style={{alignSelf: 'flex-end'}}></div>
                    <form className={style.signup_form} onSubmit={handleSubmit}>
                        <h1>Create account</h1>
                        {/* <input 
                            type='text' 
                            placeholder='Phone...' 
                            name='phone' 
                            onChange={handleChange} 
                            required 
                            value={data.phone} 
                            className={style.signup_input}
                            onInput={onPhoneInput}
                            onKeyDown={onPhoneKeyDown}
                            onPaste={onPhonePaste}
                        /> */}
                        <label htmlFor="firstName">First name</label>
                        <input type='text' placeholder='First name...' id='firstName' name='firstName' onChange={handleChange} required value={data.firstName} className={style.signup_input}/>
                        <label htmlFor="lastName">Last name</label>
                        <input type='text' placeholder='Last name...' id='lastName' name='lastName' onChange={handleChange} required value={data.lastName} className={style.signup_input}/>
                        <label htmlFor="email">Email</label>
                        <input type='email' placeholder='Email...' id='email' name='email' onChange={handleChange} required value={data.email} className={style.signup_input}/>
                        <div className={style.password_field}>
                            <label htmlFor="password">Password</label>
                            <input type={(showPass) ? 'text' : 'password'} placeholder='Password...' id='password' name='password' onChange={handleChange} required value={data.password} className={style.signup_input}/>
                            <span className={style.toggle_eye} onClick={handleToggle}></span>
                        </div>

                        {error && <p className={style.error_msg}> {error}</p>}
                        {success && <p className={style.success_msg}>{success}</p>}

                        <GoogleAuth/>

                        <button type='submit' className={style.black_btn}>
                            Sign Up
                        </button>

                        <button type='button' onClick={handleSwitch}>Авторизироваться</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;