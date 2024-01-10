import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import axios from 'axios';

import style from './style.module.css';

export default function OTPpage({formData, userId, generate, toggleClose}) {

	const [otp, setOtp] = useState('');

	async function submitOTP(code){
		try{	
			const {data: res} = await axios.get('https://memetricsserver.onrender.comapi/users/OTP/verify', {params: {id: userId, code: otp}});

            await axios.post('https://memetricsserver.onrender.comapi/users/login', formData);


            // записываем jwt token  в локальное хранилище
            localStorage.setItem('token', res.data);
            localStorage.setItem('email', res.email);

            window.location = '/';
		}catch(error){
			if(error.response.status === 400){
				alert(error.response.data.message)
			}
		}
	}

	return (
		<div className={style.OTPcontainer}>
			<button type="button" onClick={toggleClose}>Close</button>
			<h1 className={style.OTPheader}>Enter verification code here</h1>
			<div>
				<OtpInput
					value={otp}
					onChange={setOtp}
					numInputs={4}
					inputType='number'
					shouldAutoFocus
					inputStyle="inputStyle"
                	renderInput={(props) => <input {...props} />}
				/>
			</div>

			<button onClick={(e) => generate(userId)} className={style.OTPbutton} type='button'>Resend</button>

			<button onClick={submitOTP} className={style.OTPbutton} type='button' disabled={!(otp.length === 4)}>Verify</button>
		</div>
  	)
}