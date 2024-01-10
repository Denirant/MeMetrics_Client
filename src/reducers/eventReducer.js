const ADD_EVENT = 'ADD_EVENT';
const REMOVE_EVENT = 'REMOVE_EVENT';
const CLEAR_EVENT = 'CLEAR_EVENT';
const FINISH_TASK = 'FINISH_TASK'

// Функция для создания action для добавления уведомления
export const addEvent = (event) => ({
  type: ADD_EVENT,
  payload: event,
});

// Функция для создания action для удаления уведомления
export const removeEvent = (id) => ({
  type: REMOVE_EVENT,
  payload: id,
});

export const clearEvent = (array) => ({
  type: CLEAR_EVENT,
  payload: array,
});

export const finishTask = (id) => ({
  type: FINISH_TASK,
  payload: id,
});

// Начальное состояние (пустой массив уведомлений)
const initialState = [];

// Редюсер для управления уведомлениями
const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EVENT:
      return [...state, action.payload];
    case FINISH_TASK:
      return state.map((event) => {
        if (event.id === action.payload) {
          const updatedCheckes = event.checkes.map((obj) => ({
            ...obj,
            complete: true,
          }));
      
          return {
            ...event,
            checkes: updatedCheckes,
          };
        }

        console.log(event)

        return event;
      });
      
    case REMOVE_EVENT:
      return state.filter((event) => event.id !== action.payload);
    case CLEAR_EVENT:
      return action.payload;
    default:
      return state;
  }
};

export default eventReducer;
