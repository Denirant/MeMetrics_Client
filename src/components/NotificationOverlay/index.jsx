import React from 'react';
import { useSelector } from 'react-redux';
import './style.css'; // Подключите стили для оформления

import NotificationAction from '../Notifications/notificationAction';
import NotificationInteractive from '../Notifications/notificationIntaractive';

function NotificationOverlay() {
    const notifications = useSelector((state) => state.notification);

    const getNotificationsByPosition = (position, reverse = false) => {
        const filteredNotifications = notifications.filter((notification) => notification.position === position);
        const lastIndex = filteredNotifications.length - 1;
        const startIndex = Math.max(0, lastIndex - 4); // Получаем индекс начала для последних 5 элементов
        
    
        return filteredNotifications.slice(Math.max(0, startIndex), lastIndex + 1);
    };
      

    function getLastNotificationByPosition(position) {
        const filteredNotifications = getNotificationsByPosition(position);
        if (filteredNotifications.length > 0) {
            const lastNotification = filteredNotifications[filteredNotifications.length - 1];
            return (
                <div key={lastNotification.id} className="notification">
                <NotificationAction notification={lastNotification} />
                </div>
        );
        } else {
            return null;
        }
    }
      

    return (
        <div className="notification-overlay">
            <div className="notification-list top-center">
                {getLastNotificationByPosition('top center')}
            </div>
            <div className="notification-list top-right">
                {getNotificationsByPosition('top right').map((notification, index) => (
                <div key={notification.id} className="notification">
                    <NotificationInteractive notification={notification} name={notification.title + index}/>
                </div>
                ))}
            </div>
            <div className="notification-list center-right">
                {getNotificationsByPosition('center right').map((notification) => (
                <div key={notification.id} className="notification">
                    {notification.text}
                </div>
                ))}
            </div>
            <div className="notification-list bottom-center">
                {getLastNotificationByPosition('bottom center')}
            </div>
            <div className="notification-list bottom-right">
                {getNotificationsByPosition('bottom right').map((notification, index) => (
                <div>
                    <NotificationInteractive notification={notification} name={notification.title + index}/>
                </div>
                ))}
            </div>
        </div>
    );
}

export default NotificationOverlay;
