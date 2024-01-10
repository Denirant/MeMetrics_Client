import React from 'react';
import './style.css'
import ErrorIcon from '../../assets/img/Error.svg';

const ErrorAlert = ({ message, onClose, cover }) => {
  return (
    <div className={`error-alert ${cover ? 'cover' : ''}`}>
      <div className='error-alert-header'>
        <img onClick={onClose} src={ErrorIcon} alt="icon" />
        <p className='error-alert-title'>Error</p>
      </div>
      <p className='error-alert-message'>{message}</p>
      <button onClick={onClose}>Ok</button>
    </div>
  );
};

export default ErrorAlert;
