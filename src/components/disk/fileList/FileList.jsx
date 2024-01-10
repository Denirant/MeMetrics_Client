import React, {useEffect, useRef} from 'react';
import './fileList.css'
import {useDispatch, useSelector} from "react-redux";
import File from "./file/File";
import {CSSTransition, TransitionGroup} from "react-transition-group";

import {getFiles} from "../../../actions/file";
import updateItemWidth from '../../../utils/changeFileSize';

import FileTypes from '../../../utils/types';

// Обновление ширины элементов при загрузке и изменении размера окна
window.addEventListener('resize', updateItemWidth);






const FileList = ({isHuge, handleSelectFile}) => {

    const visibleFiles = useSelector(state => state.files.visibleFiles)

    const files = useSelector(state => state.files.files);
    const fileView = useSelector(state => state.files.view);
    const loader = useSelector(state => state.app.loader)

    function getFileType(type){
        switch (Object.keys(FileTypes).find(key => FileTypes[key].includes(type)) || '') {
            case 'image':
                return 'Images';
            case 'document':
                return 'Documents';
            case 'table':
                return 'Excel';
            case 'pdf':
                return 'Files PDF';
            case 'text':
                return 'Text';
            case 'rar':
                return 'Archive (ZIP)';
            case 'audio':
                return 'Audio';
            case 'video':
                return 'Video';;
            case 'presentation':
                return 'Presentations (PPT)';
            default:
                return 'Other';
        }
    }


    if(loader) {
        return (
            <div className='loader_container'>
                <div className="loader_body"></div>
            </div>
        )
    }

    if (files.filter(el => el.type !== 'dir').length === 0) {
        return (
            <div className='loader'></div>
        )
    }

    if (fileView === "plate") {
        return (
            <div className={`fileplate ${isHuge ? 'long' : ''}`} onLoad={() => updateItemWidth()}>
                {
                    visibleFiles.length > 0 ?
                    files.filter(file => file.type !== 'dir').map(file => {
                        const isVisible = (
                            visibleFiles.includes('All files') || 
                            visibleFiles.includes(getFileType(file.type.toLowerCase()))
                        );
        
                        if (isVisible) {
                            return (<File key={file._id} file={file} handleSelectFile={handleSelectFile}/>);
                        } else {
                            return null; // Возвращаем null для элементов, которые не нужно рендерить
                        }
                    }) : <div className='select-filter'>No files with selected filter</div>
                }
            </div>
        );        
    }
};

export default FileList;
