import React, {useState, useRef} from 'react';
import axios from 'axios';
import { InputPicker } from 'rsuite';
// import { forwardRef, useImperativeHandle } from 'react';

import './style.css'

const useBrands = (defaultUsers = []) => {
    const [brands, setBrands] = React.useState(defaultUsers);
    const [firstAttempt, setFirstAttempt] = useState(true);
    
    const featBrands = async (word, search) => {
        
        const {data: res} = await axios.post('http://localhost:8080/charts/lineChart/find', {text: word, search: search, email: localStorage.getItem('email')});

        console.log(res)

        await setBrands(res.brands);
        await setFirstAttempt(false);
    }

    const clear = () => {
        setBrands([]);
    }
  
    return [brands, firstAttempt, featBrands, clear];
  };


const InputPickerComp =({disabled, placeholder, inputWidth, search, handler}) => {

    const [brands, firstAttempt, featBrands, clear] = useBrands();

    // useImperativeHandle(() => ({
    //     getValue: {
    //         return 
    //     }
    // }))

    return (
        <div className='AddChart'>
            <InputPicker
                disabled={disabled}
                data={brands}
                labelKey='label'
                valueKey='value'
                style={{ width: inputWidth }}
                onSearch={(event) => featBrands(event, search)}
                onSelect={(event) => handler(event)}
                onClean={clear}
                placement='bottom'
                renderMenu={menu => {
                    // if (loading) {
                    //     return (
                    //         <p style={{ padding: 10, color: '#999', textAlign: 'center' }}>
                    //         <SpinnerIcon spin /> Loading...
                    //         </p>
                    //     );
                    // }
                    if(brands.length > 0) return menu;
                    if (brands.length === 0 && firstAttempt === false) {
                        return (
                            <p style={{ padding: 10, color: '#999', textAlign: 'center' }}>
                                Nothing matches...
                            </p>
                        );
                    }
                    if (firstAttempt) {
                        return (
                            <p style={{ padding: 10, color: '#999', textAlign: 'center' }}>
                                Start printing...
                            </p>
                        );
                    }
                }}
                placeholder={placeholder}
            />
        </div>
    );
}

export default InputPickerComp;