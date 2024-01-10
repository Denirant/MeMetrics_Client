const ADD_WORKER = 'ADD_WORKER';
const REMOVE_WORKER = 'REMOVE_WORKER';
const CLEAR_WORKER = 'CLEAR_WORKER';

// Функция для создания action для добавления уведомления
export const addWorker = (worker) => ({
  type: ADD_WORKER,
  payload: worker,
});

// Функция для создания action для удаления уведомления
export const removeWorker = (workerId) => ({
  type: REMOVE_WORKER,
  payload: workerId,
});

export const clearWorker = () => ({
  type: CLEAR_WORKER,
  payload: [],
});


// Начальное состояние (пустой массив уведомлений)
const initialState = [];

// Редюсер для управления уведомлениями
const workerReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WORKER:
        console.log(action.payload)
      return [...state, action.payload];
    case REMOVE_WORKER:
      return state.filter((worker) => worker.id !== action.payload);
    case CLEAR_WORKER:
      return [];
    default:
      return state;
  }
};

export default workerReducer;
