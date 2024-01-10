const SHOW_DOWNLOADER = 'SHOW_DOWNLOADER'
const HIDE_DOWNLOADER = 'HIDE_DOWNLOADER'
const ADD_DOWNLOADER_FILE = 'ADD_DOWNLOADER_FILE'
const CHANGE_DOWNLOADER_FILE = 'CHANGE_DOWNLOADER_FILE'
const REMOVE_DOWNLOADER_FILE = 'REMOVE_DOWNLOADER_FILE'
const CLEAR_DOWNLOADER_FILES = 'CLEAR_DOWNLOADER_FILES';



const defaultState = {
    isVisible: false,
    files: []
}

export default function userReducer(state = defaultState, action) {
    switch (action.type) {
        case SHOW_DOWNLOADER: return {...state, isVisible: true}
        case HIDE_DOWNLOADER: return {...state, isVisible: false}
        case CLEAR_DOWNLOADER_FILES:
          return { ...state, files: [] };
        case ADD_DOWNLOADER_FILE:
            return {...state, files: [...state.files, action.payload]}
        case REMOVE_DOWNLOADER_FILE:
            return {...state, files: [...state.files.filter(file => file.id != action.payload)]}
        case CHANGE_DOWNLOADER_FILE:
            return {
                ...state,
                files: [...state.files.map(file => file.id == action.payload.id
                    ? {...file, progress: action.payload.progress}
                    : {...file}
                )]
            }
        default:
            return state
    }
}


export const showDownloader = () => ({type: SHOW_DOWNLOADER})
export const hideDownloader = () => ({type: HIDE_DOWNLOADER})
export const removeDownloadFile = (fileId) => ({type: REMOVE_DOWNLOADER_FILE, payload: fileId})
export const addDownloadFile = (file) => ({type: ADD_DOWNLOADER_FILE, payload: file})
export const changeDownloadFile = (payload) => ({type: CHANGE_DOWNLOADER_FILE, payload: payload})
export const clearDownloaderFiles = () => ({ type: CLEAR_DOWNLOADER_FILES });
