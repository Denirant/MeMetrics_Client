import React from 'react';
import { useDispatch } from 'react-redux';
import { removeNotificationsByPosition } from '../../reducers/notificationsReducer';

import Success from '../../assets/img/NotificationActionIcons/Success.svg'
import Warning from '../../assets/img/NotificationActionIcons/Warning.svg'
import Error from '../../assets/img/NotificationActionIcons/Alert.svg'

import './style.css'

function NotificationAction({ notification }) {
    const dispatch = useDispatch();

    const handleRemove = (e) => {
        // dispatch(removeNotification(notification.id));
        dispatch(removeNotificationsByPosition(notification.position));
    };

    const getBackgroundColor = () => {
        switch (notification.status) {
        case 'Success':
            return '#2EBDAB';
        case 'Error':
            return '#DB371F';
        case 'Warning':
            return '#EDA80D';
        default:
            return 'white';
        }
    };


    const getIcon = () => {
        switch (notification.status) {
        case 'Success':
            return Success;
        case 'Error':
            return Error;
        case 'Warning':
            return Warning;
        default:
            return Success;
        }
    };


    return (
        <div className="notification" style={{ backgroundColor: getBackgroundColor() }}>
            <img src={getIcon()} alt="notification icon" />    
            <span>{notification.text}</span>
            <button className='notification_clr' onClick={handleRemove}></button>
        </div>
    );
}

export default NotificationAction;
