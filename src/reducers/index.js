import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools } from 'redux-devtools-extension'
import thunk from "redux-thunk";
import userReducer from "./userReducer";
import fileReducer from "./fileReducer";
import uploadReducer from "./uploadReducer";
import downloadReducer from "./downloadReducer";
import appReducer from "./appReducer";
import notificationReducer from './notificationsReducer'
import companyReducer from "./companyReducer";
import workerReducer from "./workerReducer";
import eventReducer from "./eventReducer";
import todoReducer from "./todoSlice";
import tagReducer from "./tagReducer";



const rootReducer = combineReducers({
    user: userReducer,
    files: fileReducer,
    upload: uploadReducer,
    app: appReducer,
    download: downloadReducer,
    notification: notificationReducer,
    companies: companyReducer,
    workers: workerReducer,
    events: eventReducer,
    todo: todoReducer,
    tags: tagReducer
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
