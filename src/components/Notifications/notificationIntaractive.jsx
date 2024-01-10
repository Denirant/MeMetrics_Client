import React from 'react';
import { useDispatch } from 'react-redux';

import { removeNotification } from '../../reducers/notificationsReducer';

function NotificationInteractive({ notification, name }) {
  const dispatch = useDispatch();

  const handleRemove = (e) => {
    console.log(notification.id)
    dispatch(removeNotification(notification.id));
  };

  return (
    <div className="notification-interactive">
      <div className='notification-interactive--header'>
        <div className='notification-interactive--image' style={{backgroundImage: `url(${notification.image})`}}></div>
        <div className='notification-interactive--text'>
          <h3>{name}</h3>
          <p>{notification.text}</p>
        </div>
        <button className="remove-button" onClick={handleRemove}></button>
      </div>
      <div className='notification-interactive--control'>
        <button onClick={() => {
          notification.handleCancel()
          dispatch(removeNotification(notification.id));
        }}>Cancel</button>
        <button onClick={() => {
          notification.handleOpen()
          dispatch(removeNotification(notification.id));
        }}>Open</button>
      </div>
    </div>
  );
}

export default NotificationInteractive;
