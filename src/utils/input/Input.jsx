import React from 'react';
import './input.css'

const Input = (props) => {
    return (
        <div className='input_container'>
            <label htmlFor={props.id}>{props.label}</label>
            <input className='input' onChange={(event)=> props.setValue(event.target.value)}
               value={props.value}
               type={props.type}
               placeholder={props.placeholder}
               autoFocus
               onKeyDown={(event) => {
                    if(props.createFunc !== undefined && (event.key === 'Enter' || event.keyCode === 13)){
                        props.createFunc();
                    }
               }}
                id={props.id}
            />
        </div>
    );
};

export default Input;
