import React, { useState, useCallback } from 'react';
import WarningIcon from '../../assets/img/Warning.svg'
import './style.css'

const CustomConfirm = ({ message, onConfirm, title, yesText }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleConfirm = useCallback(() => {
    setIsVisible(false);
    onConfirm(true);
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    setIsVisible(false);
    onConfirm(false);
  }, [onConfirm]);

  return isVisible ? (
    
    <div className="custom-confirm" id='custom-confirm' onClick={(e) => {
            if(e.target.id === 'custom-confirm'){
                handleCancel()
            }
        }} onKeyDown={(event) => {
            if(event.key === 'Escape' || event.keyCode === 27){
                handleCancel()
            }
        }}>
        <div className="confirm-header">
            <img className='confirm-image' src={WarningIcon} alt="icon" />
            <p className='confirm-title'>{title}</p>

            <div className='close_btn' onClick={handleCancel}></div>
        </div>
        <div className="confirm-message">{message}</div>
        <div className="confirm-buttons">
            <button className='confirm-button' onClick={handleCancel}>Cancel</button>
            <button className='confirm-button blue' onClick={handleConfirm}>{yesText}</button>
        </div>
    </div>
  ) : null;
};

export default CustomConfirm;
