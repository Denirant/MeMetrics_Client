const SET_FILES = "SET_FILES"
const SET_CURRENT_DIR = "SET_CURRENT_DIR"
const ADD_FILE = "ADD_FILE"
const SET_POPUP_DISPLAY = "SET_POPUP_DISPLAY"
const PUSH_TO_STACK = "PUSH_TO_STACK"
const DELETE_FILE = "DELETE_FILE"
const SET_VIEW = 'SET_VIEW'
const SET_STRUCTURE = "SET_STRUCTURE"
const SET_CURRENT_PATH = "SET_CURRENT_PATH"
const PUSH_TO_PATH = "PUSH_TO_PATH"
const REMOVE_OPEN_FOLDER = "REMOVE_OPEN_FOLDER"
const ADD_OPEN_FOLDER = "ADD_OPEN_FOLDER"
const SET_CURRENT_OPEN_FOLDER = "SET_CURRENT_OPEN_FOLDER"
const SET_FILE_SELECT = "SET_FILE_SELECT"
const ADD_SELECTED_FILE = "ADD_SELECTED_FILE"
const REMOVE_SELECTED_FILE = "REMOVE_SELECTED_FILE"
const CLEAR_SELECTED_FILES = 'CLEAR_SELECTED_FILES'
const SET_VISIBLE_FILES = 'SET_VISIBLE_FILES'
const SET_SEARCH_FILES = 'SET_SEARCH_FILES'
const SET_CLICKED_FILE = 'SET_CLICKED_FILE'
const SET_ONE_TYPE = 'SET_ONE_TYPE'
const SET_DISK_ANALYTIC = 'SET_DISK_ANALYTIC'

const defaultState = {
    files: [],
    currentDir: null,
    currentPath: '',
    popupDisplay: false,
    dirStack: [],
    pathStack: [],
    view: 'plate',
    structure: [],
    openFolders: [],
    currentFolder: '',
    selected: false,
    selectedFiles: [],
    visibleFiles: [
        { id: 'all', name: 'All files'},
        { id: 'image', name: "Images" },
        { id: 'links', name: "Links" },
        { id: 'video', name: "Video" },
        { id: 'audio', name: "Audio" },
        { id: 'pdf', name: "Files PDF" },
        { id: 'ppt', name: "Presentations (PPT)" },
        { id: 'txt', name: "Text" },
        { id: 'document', name: "Documents" },
        { id: 'excel', name: "Excel" },
        { id: 'zip', name: "Archive (ZIP)" },
        { id: 'other', name: "Other" },
    ],
    searchFiles: [],
    clickedFile: null,
    diskAnalytic: [],
    oneType: false
}

export default function fileReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_FILES: return {...state, files: action.payload}
        case SET_CURRENT_DIR: return {...state, currentDir: action.payload}
        case ADD_FILE: return {...state, files: [...state.files, action.payload]}
        case SET_POPUP_DISPLAY: return {...state, popupDisplay: action.payload}
        case PUSH_TO_STACK: return {...state, dirStack: [...state.dirStack, action.payload]}
        case PUSH_TO_PATH: return {...state, pathStack: [...state.pathStack, action.payload]}
        case DELETE_FILE: return {...state, files: [...state.files.filter(file => file._id !== action.payload)]}
        case SET_VIEW: return {...state, view: action.payload}
        case SET_STRUCTURE: return {...state, structure: action.payload}
        case SET_CURRENT_PATH: return {...state, currentPath: action.payload}
        case ADD_OPEN_FOLDER: return {...state,openFolders: [...state.openFolders, action.payload]}
        case REMOVE_OPEN_FOLDER: return { ...state, openFolders: state.openFolders.filter(path => path !== action.payload) }
        case SET_CURRENT_OPEN_FOLDER: return { ...state, currentFolder: action.payload }
        case SET_FILE_SELECT: return { ...state, selected: action.payload}
        case ADD_SELECTED_FILE: return {...state, selectedFiles: [...state.selectedFiles, action.payload]}
        case CLEAR_SELECTED_FILES: return {...state, selectedFiles: []}
        case REMOVE_SELECTED_FILE: return {...state, selectedFiles: [...state.selectedFiles.filter(file => file._id != action.payload._id)]}
        case SET_VISIBLE_FILES: return {...state, visibleFiles: action.payload}
        case SET_SEARCH_FILES: return {...state, searchFiles: action.payload}
        case SET_CLICKED_FILE: return {...state, clickedFile: action.payload}
        case SET_DISK_ANALYTIC: return {...state, diskAnalytic: action.payload}
        case SET_ONE_TYPE: return {...state, oneType: action.payload} 
        default:
            return state
    }
}

export const setFiles = (files) => ({type: SET_FILES, payload: files})
export const setCurrentDir= (dir) => ({type: SET_CURRENT_DIR, payload: dir})
export const addFile = (file) => ({type: ADD_FILE, payload: file})
export const setPopupDisplay = (display) => ({type: SET_POPUP_DISPLAY, payload: display})
export const pushToStack = (dir) => ({type: PUSH_TO_STACK, payload: dir})
export const pushToPath = (dir) => ({type: PUSH_TO_PATH, payload: dir})
export const deleteFileAction = (dirId) => ({type: DELETE_FILE, payload: dirId})
export const setFileView = (payload) => ({type: SET_VIEW, payload})
export const setStructure = (payload) => ({type: SET_STRUCTURE, payload})
export const setCurrentPath = (payload) => ({type: SET_CURRENT_PATH, payload})
export const setSearchFiles = (payload) => ({type: SET_SEARCH_FILES, payload})

export const addSelectedFile = (payload) => ({type: ADD_SELECTED_FILE, payload})
export const removeSelectedFile = (payload) => ({type: REMOVE_SELECTED_FILE, payload})
export const clearSelectedFiles = () => ({type: CLEAR_SELECTED_FILES})

export const setVisibleFiles = (payload) => ({type: SET_VISIBLE_FILES, payload})
export const setClickedFile = (payload) => ({type: SET_CLICKED_FILE, payload})

export const setDiskAnalitic = (payload) => ({type: SET_DISK_ANALYTIC, payload})

export const addOpenFolder = (folderPath) => ({
    type: ADD_OPEN_FOLDER,
    payload: folderPath
});

export const removeOpenFolder = (folderPath) => ({
    type: REMOVE_OPEN_FOLDER,
    payload: folderPath
});  

export const setCurrentOpenFolder = (folderPath) => ({
    type: SET_CURRENT_OPEN_FOLDER,
    payload: folderPath
  });
  
  
export const setFileSelect = (value) => ({
    type: SET_FILE_SELECT,
    payload: value
})


export const setOneType = (value) => ({
    type: SET_ONE_TYPE,
    payload: value
})