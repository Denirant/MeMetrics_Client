import React from 'react'
import DiskSearch from './DiskSearch/DiskSearch'
import Delete from '../../assets/img/NavigationIcons/Delete.svg';
import Move from '../../assets/img/NavigationIcons/Move.svg';
import Add from '../../assets/img/NavigationIcons/Add.svg';
import { render } from 'react-dom';
import { moveFile } from '../../actions/file';
import MoveFile from '../FilesMove/TreeSelect';
import './diskNavigation.css';
import { useSelector, useDispatch } from 'react-redux';
import { deleteFile } from '../../actions/file';
import showErrorAlert from '../../utils/showCustomError';
import { setCurrentDir, setCurrentPath, setCurrentOpenFolder, removeOpenFolder, addOpenFolder } from '../../reducers/fileReducer';

function DiskNavigation({createFunction, isOneType}) {


    const currentDir = useSelector(state => state.files.currentDir);
    const structure = useSelector(state => state.files.structure);
    const currentPath = useSelector(state => state.files.currentPath)
    const files = useSelector(state => state.files.files);
    const dispatch = useDispatch();

    function handleDeleteFolder(e){
        
        if(currentDir){
            dispatch(deleteFile({
                _id: currentDir
            }, files))
        }else{
            showErrorAlert('Can\'t delete root folder!');
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

    function findFileWithId(data, id) {
        for (const item of data) {
          if (item?.file?._id === id) {
            return {
                ...item.file,
                files: item.files 
            };
          }
      
          if (item.files && item.files.length > 0) {
            const found = findFileWithId(item.files, id);
            if (found) {
              return found;
            }
          }
        }
      
        return null;
    }

    function isPathAncestor(parentPath, childPath) {
        const parentParts = parentPath.split('/');
        const childParts = childPath.split('/');
    
        if (parentParts.length >= childParts.length) {
            return false;
        }
    
        for (let i = 0; i < parentParts.length; i++) {
            if (parentParts[i] !== childParts[i]) {
                return false;
            }
        }
    
        return true;
    }

    function handleMoveFolder(e){
        e.stopPropagation()
        
        if(currentDir){
            const container = document.createElement('div');
            container.classList.add('move_selecter-handle');

            document.querySelector('.app').appendChild(container);

            render(
                <MoveFile prevPath={currentPath} data={structure} handleCloseForm={() => container.remove()} handleSelectPath={(path) => {
                    const moveId = findElementWithPath(structure, path);

                    const movedDir = findFileWithId(structure, currentDir);
                    const parentDir = findFileWithId(structure, moveId);

                    const newPath = parentDir.path + '/' + movedDir.name;

                    if(!isPathAncestor(movedDir.path, parentDir.path) && movedDir._id !== parentDir._id && !parentDir.files.filter(el => el.name === movedDir.name).length){
                        dispatch(moveFile(moveId, currentDir));
                        dispatch(setCurrentDir(currentDir))
                        dispatch(setCurrentPath(newPath))
                        dispatch(setCurrentOpenFolder(newPath))
                        dispatch(removeOpenFolder(movedDir.path))
                        dispatch(addOpenFolder(newPath))
                    }else{
                        if(isPathAncestor(movedDir.path, parentDir.path)){
                            showErrorAlert('Parent folder cant be moved into child folder!')
                          }else if(movedDir._id === parentDir._id){
                            showErrorAlert('Cant move folder iteself!')
                          }else if(parentDir.files.filter(el => el.name === movedDir.name).length){
                            showErrorAlert('Folder already contains folder with this name!')
                          }
                    }

                    
                    container.remove();
                }}/>,
                container
            );
        }else{
            showErrorAlert("Can't move root folder!");
        }
    }
    

    return (
        <div className='disk_navigation'>
            {!isOneType && <div className='dis_navigation-folder-control'>
                <ul className='navigation_list'>
                    <li onClick={createFunction} className='navigation_list-item blue'>
                        <img src={Add} alt="icon" />
                        <p>Create folder</p>
                    </li>
                    <li onClick={handleDeleteFolder} className={`navigation_list-item ${!currentDir ? 'inactive' : ''}`}>
                        <img src={Delete} alt="icon" />
                        <p>Delete folder</p>
                    </li>
                    <li onClick={handleMoveFolder} className={`navigation_list-item ${!currentDir ? 'inactive' : ''}`}>
                        <img src={Move} alt="icon" />
                        <p>Move folder</p>
                    </li>
                </ul>
            </div>}
            <DiskSearch/>
        </div>
    )
}

export default DiskNavigation
