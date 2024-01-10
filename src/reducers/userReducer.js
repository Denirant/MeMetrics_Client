const SET_USER = "SET_USER"
const LOGOUT = "LOGOUT"
const SET_X = "SET_X"
const SET_Y = "SET_Y"
const SET_NOTIFICATION = "SET_NOTIFICATION"

const defaultState = {
    currentUser: {},
    isAuth: false,
    x: 0,
    y: 0,
    isNotification: false
}

export default function userReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                currentUser: action.payload,
                isAuth: true
            }
        case LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state,
                currentUser: {},
                isAuth: false
            }
        case SET_X:
            return {
                ...state,
                x: action.payload,
            }
        case SET_Y:
            return {
                ...state,
                y: action.payload,
            }
        case SET_NOTIFICATION:
            return {
                ...state,
                isNotification: action.payload,
            }
        default:
            return state
    }
}


export const setUser = user => ({type: SET_USER, payload: user})
export const setX = value => ({type: SET_X, payload: value})
export const setY = value => ({type: SET_Y, payload: value})
export const setNotification = value => ({type: SET_NOTIFICATION, payload: value})
export const logout = () => ({type: LOGOUT})
