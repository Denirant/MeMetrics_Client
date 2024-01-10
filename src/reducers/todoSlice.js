import { v4 as uuidv4 } from "uuid";

// Action types
const SET_TASKS = "SET_TASKS";
const TOGGLE_COMPLETE = "TOGGLE_COMPLETE";
const SET_INPUT = "SET_INPUT";
const SET_NEW_TASK = "SET_NEW_TASK";
const DELETE_TASK = "DELETE_TASK";
const CLEAR_COMPLETED = "CLEAR_COMPLETED";
const EDIT_TASK = "EDIT_TASK";

// Reducer
const initialState = {
  tasks: [],
  newInput: "",
};

export default function todoReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TASKS:
      return { ...state, tasks: action.payload };
    case TOGGLE_COMPLETE:
      const index = state.tasks.findIndex((todo) => todo.id === action.payload);
      state.tasks[index].completed = !state.tasks[index].completed;
      return { ...state };
    case SET_INPUT:
      return { ...state, newInput: action.payload };
    case SET_NEW_TASK:
      const newTask = {
        id: action.payload.id,
        title: action.payload.title,
        completed: action.payload.completed,
        start: action.payload.start,
        end: action.payload.end,
      };

      return { ...state, tasks: [...state.tasks, newTask], newInput: "" };
    case DELETE_TASK:
      const newState = state.tasks.filter((task) => task.id !== action.payload);
      return { ...state, tasks: newState };
    case CLEAR_COMPLETED:
      const newTasks = state.tasks.filter((task) => !task.completed);
      return { ...state, tasks: newTasks };
    case EDIT_TASK:
      const editedIndex = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      const editedTask = {
        ...state.tasks[editedIndex],
        title: action.payload.title,
        start: action.payload.start,
        end: action.payload.end,
      };
      const editedTasks = [...state.tasks];
      editedTasks[editedIndex] = editedTask;
      return { ...state, tasks: editedTasks };
    default:
      return state;
  }
}

// Action creators
export const setTasks = (tasks) => ({ type: SET_TASKS, payload: tasks });
export const toggleComplete = (taskId) => ({
  type: TOGGLE_COMPLETE,
  payload: taskId,
});
export const setInput = (input) => ({ type: SET_INPUT, payload: input });
export const setNewTask = (obj) => ({ type: SET_NEW_TASK, payload: obj });
export const deleteTask = (taskId) => ({ type: DELETE_TASK, payload: taskId });
export const clearCompleted = () => ({ type: CLEAR_COMPLETED });

// Selectors
export const selectTodos = (state) => state.tasks;
export const selectTasksLeft = (state) =>
  state.tasks.filter((task) => !task.completed);
export const selectInput = (state) => state.newInput;

export const editTask = (id, title, start, end) => ({
  type: EDIT_TASK,
  payload: { id, title, start, end },
});
