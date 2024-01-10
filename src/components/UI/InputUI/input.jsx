import './style.css';
import React, { useState, forwardRef, useImperativeHandle } from 'react';

const InputField = forwardRef(({type = 'text', placeholderText = 'Input', value = ''}, _ref) => {
    const [inputData, setInputData] = useState(value);

    const handleChange = (event) => {
        setInputData(event.target.value);
    }

    useImperativeHandle(_ref, () => ({
        getChildInputValue: () => {
            if(inputData.length !== 0) return inputData;
            else return 0;
        }
    }))

    return(
        <input className='InputComponent' type={type} placeholder={placeholderText} value={inputData} onChange={handleChange}></input>
    )
});

export default React.memo(InputField);