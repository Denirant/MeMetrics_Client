const ADD_TAG = 'ADD_TAG';
const REMOVE_TAG = 'REMOVE_TAG';

// Функция для создания action для добавления уведомления
export const addTag = (tag) => ({
  type: ADD_TAG,
  payload: tag,
});

// Функция для создания action для удаления уведомления
export const removeTag = (tagName) => ({
  type: REMOVE_TAG,
  payload: tagName,
});

// Начальное состояние (пустой массив уведомлений)
const initialState = [];

// Редюсер для управления уведомлениями
const tagReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TAG:
      return [...state, action.payload];
    case REMOVE_TAG:
      return state.filter((tag) => tag.title !== action.payload);
    default:
      return state;
  }
};

export default tagReducer;
