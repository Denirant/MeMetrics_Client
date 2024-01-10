import moment from 'moment'
import React from 'react'

import './style.css'

function formatMessageDate(date) {
    const currentDate = moment();
    const messageDate = moment(date);
  
    const daysDifference = currentDate.diff(messageDate, 'days');
  
    if (daysDifference === 0) {
      return `Today at ${messageDate.format('h:mm A')}`;
    } else if (daysDifference === 1) {
      return `Yesterday at ${messageDate.format('h:mm A')}`;
    } else {
      return `${messageDate.format('DD.MM.YYYY')} at ${messageDate.format('h:mm A')}`;
    }
}

function Informative({image, title, time, message = null, onAccept = null, onReject = null, isImportant = false, isUnread = true}) {

    console.log(onAccept)

    return (
        <div className={`notification-container ${isImportant ? 'important' : ''}`}>
            <img width={32} height={32} src={image} alt="notification icon" className={`notification-container__sender ${isUnread ? 'unread' : ''}`}/>
            <div className='notification-body'>
                <h2 className='notification-body__title'>{title}</h2>
                {message && <p className='notification-body_message'>{message}</p>}
                {(onAccept || onReject) && <div className='notification-body_control'>
                    {onAccept && <button className='notification-body_btn blue' onClick={onAccept.action}>{onAccept.text}</button>}    
                    {onReject && <button className='notification-body_btn' onClick={onReject.action}>{onReject.text}</button>} 
                </div>}
                <p className='notification-body_time'>{formatMessageDate(time)}</p>
            </div>
            <button className='close_btn'></button>
        </div>
    )
}

export default Informative
