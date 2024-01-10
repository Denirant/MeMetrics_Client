import axios from 'axios'
import {setDiskAnalitic, addFile, clearSelectedFiles, deleteFileAction, setCurrentDir, setCurrentPath, setFiles, setStructure, setSearchFiles, setFileSelect, setCurrentOpenFolder, setOneType} from "../reducers/fileReducer";
import {addUploadFile, changeUploadFile, hideUploader, removeUploadFile, clearUploaderFiles, showUploader} from "../reducers/uploadReducer";
import {addDownloadFile, changeDownloadFile, hideDownloader, removeDownloadFile, clearDownloaderFiles,showDownloader} from "../reducers/downloadReducer";
import {hideLoader, showLoader} from "../reducers/appReducer";
import {API_URL} from "../config";
import download from 'downloadjs';
import showCustomConfirm from '../utils/showCustomConfirm';
import showErrorAlert from '../utils/showCustomError';

import FileTypes from '../utils/types';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

const types = FileTypes;

let downloadTimeoutId; 


function convertBytesToUnits(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let unitIndex = 0;
    
    while (bytes >= 1024 && unitIndex < units.length - 1) {
      bytes /= 1024;
      unitIndex++;
    }
  
    return `${bytes.toFixed(2)} ${units[unitIndex]}`
}


export function getFiles(dirId, sort) {
    return async dispatch => {
        try {
            const start = new Date();

            if(sort === 'no'){
                sort = '';
            }

            dispatch(showLoader())
            let url = `${API_URL}api/files`
            if (dirId) {
                url = `${API_URL}api/files?parent=${dirId}`
            }
            if (sort) {
                url = `${API_URL}api/files?sort=${sort}`
            }
            if (dirId && sort) {
                url = `${API_URL}api/files?parent=${dirId}&sort=${sort}`
            }
            const response = await axios.get(url, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });

            dispatch(setFiles(response.data))

            const end = new Date();

            if(end - start <= 200){
                setTimeout(() => {
                    dispatch(hideLoader())
                }, 800)
            }
        } catch (e) {
            console.log(e.response.data.message)
        }
    }
}


export function moveFile(parent, file){
    return async dispatch => {

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('parent', parent)
            const response = await axios.post(`${API_URL}api/files/move`, formData, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });

            dispatch(deleteFileAction(file))
            dispatch(clearSelectedFiles())
            dispatch(getStructure())
        } catch (e) {
            console.log(e.response.data.message)
        }
    }
}

export function changeComment(text, id){
    return async dispatch => {

        try {
            const response = await axios.post(`${API_URL}api/files/comment`,{text: text, id: id},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        } catch (e) {
            console.log(e.response.data.message)
        }
    }
}

export function getComment(id){
    return async dispatch => {

        try {
            const response = await axios.get(`${API_URL}api/files/comment?id=${id}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            return response.data;

        } catch (e) {
            console.log(e.response.data.message)
        }
    }
}

function getData(filesData, currentPath = ''){

    const rootNodes = filesData.filter(file => !file.path.includes('/'));
    const structure = [];

    function buildNode(node) {
        const { name, type, _id } = node;
        const nestedFiles = [];

        filesData.forEach(file => {
        if (file.parent === _id) {
            if (file.type === 'dir') {
                const nestedNode = buildNode(file);
                nestedFiles.push(nestedNode);
            } else {
                // Ограничиваем длину имени до 10 символов и добавляем многоточие, если имя длиннее
                const shortenedName = file.name.length > 12 ? file.name.substring(0, 12) + '...' : file.name;
                nestedFiles.push({ type: file.type, name: shortenedName });
            }
        }
        });

        const nodeType = type === 'dir' ? 'folder' : 'file';

        return { type: nodeType, name, files: nestedFiles, file: node, open: false };
    }

    rootNodes.forEach(rootNode => {
        structure.push(buildNode(rootNode));
    });
    return structure;
}

export function getStructure(){
    return async dispatch => {
        try {

            const response = await axios.get(`${API_URL}api/files/all`, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            }); 


            
            dispatch(setStructure([{
                type: 'folder',
                open: true,
                name: "Disk",
                file: {
                    name: "Disk",
                    _id: null,
                    path: "",

                },
                files: getData(response.data)
            }]));
        } catch (e) {
            console.log(e.response.data.message)
        }
    }
}

export function createDir(dirId, name) {
    return async dispatch => {
        try {
            const response = await axios.post(`${API_URL}api/files`,{
                name,
                parent: dirId,
                type: 'dir'
            }, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            })
            dispatch(addFile(response.data))
            dispatch(getStructure());

            return response.data;
            
        } catch (e) {
            alert(e.response.data.message)
        }
    }
}



export function uploadFile(file, dirId) {
    return async dispatch => {
        const CancelToken = axios.CancelToken
        const source = CancelToken.source();
        const uploadFile = {
            name: file.name, 
            progress: 0, 
            cancelSource: source, 
            id: uuidv4(), 
            status: {
                name: 'progress',
                message: '',
                totalLength: 0,
                loaded: 0
            },
            file: file,
            dirId: dirId
        }

        console.log(dirId)

        try {
            dispatch(addUploadFile(uploadFile))

            if(file.size >= 100000000000){
                throw new Error(`File size ${file.name} exceeds 100 mb`);
            }

            const types = Object.values(FileTypes)

            if(!types.flat(1).includes(file.name.split('.').pop().toLowerCase())){
                throw new Error('Can\'t upload this file type!');
            }

            const formData = new FormData()
            formData.append('file', file)
            if (dirId) {
                formData.append('parent', dirId)
            }

            const response = await axios.post(`${API_URL}api/files/upload`, formData, {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
                onUploadProgress: progressEvent => {
                    const totalLength = progressEvent.total;
                    if (totalLength) {
                        const progress = Math.round((progressEvent.loaded * 100) / totalLength)
                        uploadFile.progress = progress
                        uploadFile.status = {
                            name: 'progress',
                            message: `Uploading ${convertBytesToUnits(progressEvent.loaded)} / ${convertBytesToUnits(totalLength)}`,
                            totalLength: totalLength,
                            loaded: progressEvent.loaded
                        };
                        dispatch(changeUploadFile(uploadFile))
                    }
                },
                cancelToken: uploadFile.cancelSource.token,
            });


            

            setTimeout(() => {
                dispatch(removeUploadFile(uploadFile.id));
            }, 15000);

            dispatch(addFile(response.data))
            dispatch(getStructure());
            dispatch(getAnalitic());

            return response.data
        } catch (e) {
            uploadFile.progress = 100;
            uploadFile.status = {
                name: 'error',
                message: (axios.isCancel(e)) ? 'File uploading was canceled' : e?.response?.data?.message || e.message,
                totalLength: uploadFile.status.totalLength,
                loaded: uploadFile.status.loaded
            };
            dispatch(changeUploadFile(uploadFile))
        }
    }
}

// File upload: 
// Progress, Finish, Error (type, size)


export function downloadFile(file) {

    return async dispatch => {

        try {
            const downloadFile = {name: file.name, progress: 0, id: uuidv4(), type: file.type}
            dispatch(showDownloader())
            dispatch(addDownloadFile(downloadFile))

            const response = await axios.get(`${API_URL}api/files/download?id=${file._id}`, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            onDownloadProgress: (progressEvent) => {
                const totalLength = progressEvent.total;
                if (totalLength) {
                    downloadFile.progress = Math.round((progressEvent.loaded * 100) / totalLength)
                    dispatch(changeDownloadFile(downloadFile))
                }
            },
            });


            if (response.status === 200) {
                download(response.data, file.name);
                console.log('Download complete!');

                if (downloadTimeoutId) {
                    console.log('Clear setTimeout')
                    clearTimeout(downloadTimeoutId);
                }

                downloadTimeoutId = setTimeout(() => {
                    dispatch(hideDownloader());
                    dispatch(clearDownloaderFiles());
                }, 5000);

            }
        } catch (error) {
            console.error('Download error:', error);
            dispatch(removeDownloadFile(file._id));
        }
    }
}

export function deleteFile(file, files) {
    return async dispatch => {
        try {
            const response = await axios.delete(`${API_URL}api/files?id=${file._id}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            dispatch(deleteFileAction(file._id))
            dispatch(getStructure());
        } catch (e) {

            const confirmed = await showCustomConfirm("Are you sure you want to delete folder? Folder contains files or folders!", 'Delete', 'Delete folder?');

            if (confirmed) {
                try{
                    dispatch(setCurrentDir(null))
                    dispatch(setCurrentPath(''))

                    console.log('Get all nested object')
        
                    const response = await axios.delete(`${API_URL}api/files/noneEmpty?id=${file._id}`,{
                        headers:{
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })

                    for(let id of response?.data?.deletedIds){
                        dispatch(deleteFileAction(id))
                    }

                    dispatch(getStructure());
                    dispatch(setCurrentDir(null))
                    dispatch(setCurrentPath(''))

                    console.log(response?.data?.message)
                }catch(error){
                    console.log(error)
                }
            }
        } finally {
            dispatch(getAnalitic())
            if(!files.filter(el => el !== file).length){
                dispatch(setFileSelect(false));
            }

        }
    }
}

export function searchFiles(search) {
    return async dispatch => {
        try {
            const response = await axios.get(`${API_URL}api/files/search?search=${search}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            dispatch(setSearchFiles(response.data))
        } catch (e) {
            alert(e?.response?.data?.message)
        } finally {
            
            setTimeout(() => {
                dispatch(hideLoader())
            }, 1700)
        }
    }
}


export function getAnalitic(){
    return async dispatch => {
        try {
            const response = await axios.get(`${API_URL}api/files/inspectDisk`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            dispatch(setDiskAnalitic(response.data))
        } catch (e) {
            alert(e?.response?.data?.message)
        } finally {
            
            setTimeout(() => {
                dispatch(hideLoader())
            }, 1700)
        }
    }
}


export function showAllGroupFiles(groupType){
    return async dispatch => {
        try {
            const response = await axios.get(`${API_URL}api/files/type?type=${groupType}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            dispatch(setCurrentDir(null))
            dispatch(setCurrentPath(''))
            dispatch(setFileSelect(false))
            dispatch(setCurrentOpenFolder('/'))
            dispatch(setOneType(true));
            setTimeout(() => {
                dispatch(setFiles(response.data))
            }, 100)
            

            console.log(response.data)
        } catch (e) {
            console.log(e)
            console.log(e?.response?.data?.message)
        }
    }
}