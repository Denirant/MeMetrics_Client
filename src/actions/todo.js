import axios from "axios";
import { API_URL } from "../config";



export const createTodoApi = async (title, start, end) => {
    const data = {
        title,
        start,
        end
      };

      const token = localStorage.getItem('token');
    
      try {
        const response = await axios.post('https://memetricsserver.onrender.comapi/todos', data, {
            headers: {
              Authorization: `Bearer ${token}`, // Предполагается, что вы используете токен авторизации
            },
          });
        
        return response.data;

      } catch (error) {
        console.error('Ошибка при создании задачи:', error.response.data);
      }  
};

export const getAllTodoApi = async () => {
        const token = localStorage.getItem('token');
    
      try {
        const response = await axios.get('https://memetricsserver.onrender.comapi/todos', {
            headers: {
              Authorization: `Bearer ${token}`, // Предполагается, что вы используете токен авторизации
            },
          });
        
        return response.data;

      } catch (error) {
        console.error('Ошибка при создании задачи:', error.response.data);
      }  
};

export const markTodoAsComplateApi = async (id) => {
    const token = localStorage.getItem('token');
    
      try {
        const response = await axios.patch(`https://memetricsserver.onrender.comapi/todos/${id}/complete`, {}, {
            headers: {
              Authorization: `Bearer ${token}`, // Предполагается, что вы используете токен авторизации
            },
          });
        
        return response.data;

      } catch (error) {
        console.error('Ошибка при создании задачи:', error.response.data);
      }  
};

export const editTodoApi = async (id, title, start, end) => {
    const data = {
        title, 
        start,
        end
    };
    const token = localStorage.getItem('token');
    
    
      try {
        const response = await axios.put(`https://memetricsserver.onrender.comapi/todos/${id}`, data, {
            headers: {
              Authorization: `Bearer ${token}`, // Предполагается, что вы используете токен авторизации
            },
          });    
        
        return response.data;

      } catch (error) {
        console.error('Ошибка при создании задачи:', error.response.data);
      }  
};

export const deleteTodoApi = async (id) => {
    const token = localStorage.getItem('token');
    
    try {
        const response = await axios.delete(`https://memetricsserver.onrender.comapi/todos/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Предполагается, что вы используете токен авторизации
            },
          });
        console.log(response.data);
      } catch (error) {
        console.error('Ошибка при удалении задачи:', error.response.data);
      }
    
};

