const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
const REMOVE_NOTIFICATIONS_BY_POSITION = 'REMOVE_NOTIFICATIONS_BY_POSITION';

// Функция для создания action для добавления уведомления
export const addNotification = (notification) => ({
  type: ADD_NOTIFICATION,
  payload: notification,
});

// Функция для создания action для удаления уведомления
export const removeNotification = (notificationId) => ({
  type: REMOVE_NOTIFICATION,
  payload: notificationId,
});

export const removeNotificationsByPosition = (position) => ({
  type: REMOVE_NOTIFICATIONS_BY_POSITION,
  payload: position,
});


// Начальное состояние (пустой массив уведомлений)
const initialState = [];

// Редюсер для управления уведомлениями
const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return [...state, action.payload];
    case REMOVE_NOTIFICATION:
      return state.filter((notification) => notification.id !== action.payload);
    case REMOVE_NOTIFICATIONS_BY_POSITION:
      return state.filter((notification) => notification.position !== action.payload);
    default:
      return state;
  }
};

export default notificationsReducer;
