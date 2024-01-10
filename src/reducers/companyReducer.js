const ADD_COMPANY = 'ADD_COMPANY';
const REMOVE_COMPANY = 'REMOVE_COMPANY';
const CLEAR_COMPANY = 'CLEAR_COMPANY';

// Функция для создания action для добавления уведомления
export const addCompany = (company) => ({
  type: ADD_COMPANY,
  payload: company,
});

// Функция для создания action для удаления уведомления
export const removeCompany = (companyId) => ({
  type: REMOVE_COMPANY,
  payload: companyId,
});

export const clearCompanies = () => ({
  type: CLEAR_COMPANY,
  payload: [],
});


// Начальное состояние (пустой массив уведомлений)
const initialState = [];

// Редюсер для управления уведомлениями
const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COMPANY:
        console.log(action.payload)
      return [...state, action.payload];
    case REMOVE_COMPANY:
      return state.filter((company) => company.id !== action.payload);
    case CLEAR_COMPANY:
      return [];
    default:
      return state;
  }
};

export default companyReducer;
