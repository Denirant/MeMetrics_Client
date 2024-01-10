import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './style.css';
import { deleteFile, downloadFile, moveFile } from '../../actions/file';
import { addSelectedFile, clearSelectedFiles } from '../../reducers/fileReducer';
import MoveFile from '../FilesMove/TreeSelect';
import ReactDOM from 'react-dom';

import showErrorAlert from '../../utils/showCustomError';



export default function MultipleSelectAction() {

    const dispatch = useDispatch();
    const selectedFiles = useSelector(state => state.files.selectedFiles);
    const structure = useSelector(state => state.files.structure);
    const currentPath = useSelector(state => state.files.currentPath)

    const files = useSelector(state => state.files.files)

    function handleMultipleDelete(e){
        if(selectedFiles.length > 0){
            for(let file of selectedFiles){
                e.stopPropagation()
                dispatch(deleteFile(file, files))
            }
            dispatch(clearSelectedFiles())
        }
    }


    function handleMultipleDownload(e){
        console.log('download')
        if(selectedFiles.length > 0){
            for(let file of selectedFiles){
                e.stopPropagation()
                dispatch(downloadFile(file))
            }
        }
    }

    function findElementWithPath(data, path) {
        console.log(data)
        for (const item of data) {
          if (item?.file?.path === path) {
            return item.file._id;
          }
      
          if (item.files && item.files.length > 0) {
            const found = findElementWithPath(item.files, path);
            if (found) {
              return found;
            }
          }
        }
      
        return null;
    }


    function handleMultipleMove(e){
        e.stopPropagation()
        
        const container = document.createElement('div');
        container.classList.add('move_selecter-handle');

        document.querySelector('.app').appendChild(container);

        ReactDOM.render(
            <MoveFile data={structure} handleCloseForm={() => container.remove()} handleSelectPath={(path) => {

                if(selectedFiles.length > 0 && path !== currentPath){
                    for(let file of selectedFiles){
                        e.stopPropagation()
                        dispatch(moveFile(findElementWithPath(structure, path), file._id));
                    }

                    dispatch(clearSelectedFiles())
                }else{
                    showErrorAlert('Folder already contains these files');
                }

                container.remove();
            }}/>,
            container
        );
    }


    function handleSelectAll(){
        dispatch(clearSelectedFiles());

        if(files.length !== selectedFiles.length){
            for(let file of files){
                if(file.type !== 'dir'){
                    dispatch(addSelectedFile(file))
                }
            }
        }
        
    }


    return (
        <div className='selected_container'>
            <p className='selected_text'>Selected {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'}</p>
            <ul className='selected_action__container'>
                <li className='selected_action' onClick={handleSelectAll}>
                    <div className='selected_action__share'></div>
                    <p>All</p>
                </li>
                <li className='selected_action' onClick={handleMultipleDownload}>
                    <div className='selected_action__download'></div>
                    <p>Download</p>
                </li>
                <li className='selected_action' onClick={handleMultipleMove}>
                    <div className='selected_action__move'></div>
                    <p>Move</p>
                </li>
                <li className='selected_action' onClick={handleMultipleDelete}>
                    <div className='selected_action__delete' ></div>
                    <p>Delete</p>
                </li>
            </ul>
        </div>
    )
}