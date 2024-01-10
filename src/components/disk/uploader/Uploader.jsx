import React, {useState} from 'react';
import UploadFile from "./UploadFile";
import './uploader.css'
import {useDispatch, useSelector} from "react-redux";
import {clearUploaderFiles, hideUploader} from "../../../reducers/uploadReducer";

const Uploader = () => {
    const files = useSelector(state => state.upload.files)
    const isVisible = useSelector(state => state.upload.isVisible)
    const dispatch = useDispatch()


    const [isMinimal, setIsMinimal] = useState(true);

    function handleCloseUploader(){
        dispatch(clearUploaderFiles())
    }

    function handleMinimalUploader(){
        setIsMinimal(!isMinimal);
    }

    function convertBytesToUnits(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let unitIndex = 0;
        
        while (bytes >= 1024 && unitIndex < units.length - 1) {
          bytes /= 1024;
          unitIndex++;
        }
      
        return `${bytes.toFixed(2)} ${units[unitIndex]}`
    }

    return (<div className="uploader">
            <div className="uploader__header">
                {
                    files.filter(el => el.progress !== 100 && el.status.name !== 'error' ).length > 0 && 
                    <div className="uploader__title">Uploading {files.filter(el => el.progress !== 100 && el.status.name !== 'error' ).length + (files.filter(el => el.progress !== 100 && el.status.name !== 'error' ).length !== 1 ? ' items': ' item')} </div>
                }
                {
                    files.filter(el => el.progress === 100).length === files.length &&
                    <div className="uploader__title">
                        Complete {files.filter(el => el.status.name !== 'error').length} upload
                        { files.filter(el => el.status.name === 'error').length > 0 &&
                            <p className='uploader__title--error'> with <span>{` ${files.filter(el => el.status.name === 'error').length} error${files.filter(el => el.status.name === 'error').length > 1 ? 's' : ''}`}</span></p>
                        }
                    </div>
                }
                <div className='upload_file-control'>
                    <button className={`uploader__minimal ${!isMinimal ? 'open' : ''}`} onClick={() => handleMinimalUploader()}></button>
                    <button className="uploader__close" onClick={() => handleCloseUploader()}></button>
                </div>
            </div>
            {!isMinimal ? (
                    <div className='uploader__container'>
                        {files.map((file, index) =>
                            <UploadFile key={`file_upload_${index}`} file={file}/>
                        )}
                    </div>
                ) : (
                    files.filter(el => el.progress !== 100).length > 0 &&
                    <div>
                        <div className='uploader_progress--mid'>
                            <span className='uploader_progress--line' style={{width: `${Math.round((files.reduce((acc, item) => acc + item.status.loaded, 0) * 100) / files.reduce((acc, item) => acc + item.status.totalLength, 0))}px`}}></span>
                        </div>
                        <p>Uploading {convertBytesToUnits(files.reduce((acc, item) => acc + item.status.loaded, 0))} / {convertBytesToUnits(files.reduce((acc, item) => acc + item.status.totalLength, 0))}</p>
                    </div>
                    
                )
            }
        </div>
    );
};

export default Uploader;
