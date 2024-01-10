import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

const GoogleAuth = () => {
    const responseGoogle = async (response) => {
        let googleData = jwtDecode(response.credential),
            user = {
                firstName: googleData.given_name,
                lastName: googleData.family_name,
                email: googleData.email,
                password: googleData.email + '1I'
            };
        
        try{
            const {data:res} = await axios.post('https://memetricsserver.onrender.comapi/users/googleAuth', user);
            localStorage.setItem('token', res.data);
            localStorage.setItem('id', res.id);

            window.location = '/';
        }catch(error){
            console.log(error.message)
        }
    };

    return (
        <div>

            <GoogleLogin
                onSuccess={responseGoogle}
                onError={() => {
                    console.log('Login Failed');
                }}
                ux_mode='popup'
                theme='white'
                shape='pill'
                type="standard"
                size='medium'
                auto_select={false}
                text='continue_with'
                locale='ru'
            />
        </div>
    );
};

export default GoogleAuth;
