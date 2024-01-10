import React, { useState, useEffect, useRef } from "react";
import './style.css'
import {
  ActionsWrapper,
  Collapse,
  StyledFolder,
  StyledName,
  VerticalLine
} from "./Tree.style";
import { useTreeContext } from "./TreeContext";
import openFolder from '../../assets/img/openFolder.svg'
import closeFolder from '../../assets/img/closeFolder.svg'
import currentOpenFolder from '../../assets/img/currentFolder.svg'
import currentCloseFolder from '../../assets/img/currentCloseFolder.svg'

import {pushToPath, pushToStack, setCurrentDir, setCurrentPath, setCurrentOpenFolder, setFileSelect, clearSelectedFiles, setOneType} from "../../reducers/fileReducer";
import { useDispatch, useSelector } from "react-redux";

import openArrow from '../../assets/img/folderArrows/openedArrow.png'
import closeArrow from '../../assets/img/folderArrows/closedArrow.png'

import { removeOpenFolder, addOpenFolder } from "../../reducers/fileReducer";
import { getFiles, moveFile } from "../../actions/file";
import showErrorAlert from "../../utils/showCustomError";

import { useOutsideClick } from "../../utils/useOutsideClick";


import CreateIcon from '../../assets/img/NavigationIcons/Add_black.svg';
import DeleteIcon from '../../assets/img/NavigationIcons/Delete.svg';
import MoveIcon from '../../assets/img/NavigationIcons/Move.svg';
import EditIcon from '../../assets/img/Edit.svg';

import { render } from 'react-dom';

import MoveFile from "../FilesMove/TreeSelect";


import { deleteFile, downloadFile } from "../../actions/file";

const FolderName = ({ isOpen, name, handleClick, handleArrow, currentFolder, folderPath, level, id }) => {

  const dispatch = useDispatch();

  
  const dropRef = useRef(null);
  const arrowRef = useRef(null);
  const dropdownRef = useRef(null);

  const files = useSelector(state => state.files.files);

  const structure = useSelector(state => state.files.structure)

  const [isActive, setIsActive] = useOutsideClick(dropdownRef, false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ left: 0, top: 0 });


  const handleDragStart = (event) => {
    event.persist(); 
    
    event.dataTransfer.setData('text/plain', id);
  };

  const handleDragEnd = (e) => {
      e.preventDefault();
  };

  const handleContextMenu = (x, y, folderName) => {
    setIsActive(!isActive)
    setContextMenuPosition({ left: x, top: y });

  };

  function handleClickItem(e, action){
    e.stopPropagation();
    e.preventDefault();


    switch(action){
      case 'delete':
        handleDeleteFolder(id)
        break;
      case 'move':
        handleMoveFolder(id, folderPath, structure);
        break;
      case 'download':
        downloadClickHandler(id);
        break;
      // case 'rename':

      //   break;
      default:
        showErrorAlert('Cant resolve this action!');
        break;
    }

    setIsActive(!isActive)
  }

  function downloadClickHandler(folderId) {
    if(folderId){
      dispatch(downloadFile({
        _id: folderId,
        type: 'dir',
        name: name,
      }))
    }else{
      showErrorAlert('Can\'t download root folder!');
    }
  }


  function handleDeleteFolder(id){
    if(id){
        dispatch(deleteFile({
            _id: id
        }, files))
    }else{
      showErrorAlert('Can\'t delete root folder!');
    }
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

  function handleMoveFolder(currentDir, currentPath, structure){
    
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
    <div 
      className={`folder-header ${level === 1 ? 'first' : ''} ${currentFolder === folderPath ? 'active' : ''}`} 
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();  

        handleContextMenu(e.clientX + 4, e.clientY + 4, name); // Вызов функции с именем папки
      }}
      ref={dropdownRef}
      onClick={(e) => {
        if(e.target !== arrowRef.current){
          handleClick(e)
        }
      }}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd} 
    >
      <img ref={arrowRef} src={isOpen ? openArrow : closeArrow} alt="folder_icon" onClick={handleArrow}/>
      <StyledName>
        <img src={!isOpen ? (currentFolder === folderPath ? currentCloseFolder : closeFolder) : (currentFolder === folderPath ? currentOpenFolder : openFolder)} alt="folder icon"/> 
        &nbsp;&nbsp;
        <p className="folder-header-name">{name}</p>
      </StyledName>

      {isActive && 
      <ul className="folder_context" ref={dropRef} style={{ left: contextMenuPosition.left + 'px', top: contextMenuPosition.top + 'px' }}>
        <li>
          {/* <p onClick={(e) => handleClickItem(e,name)}>Share folder</p> */}
          <p onClick={(e) => handleClickItem(e, 'move')}>Move</p>
        </li>
        <li>
          <p onClick={(e) => handleClickItem(e, 'download')}>Download</p>
          <p onClick={(e) => handleClickItem(e, 'rename')}>Rename</p>
        </li>
        <li>
          <p onClick={(e) => handleClickItem(e, 'delete')}>Delete</p>
        </li>
      </ul>}
    </div>
)
};

const Folder = React.memo(({ id, name, level, children, parentPath, file, openFolders}) => {
  
  const dispatchClassic = useDispatch();

  const { state, dispatch, isImparative, onNodeClick } = useTreeContext();
  const [isEditing, setEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(openFolders.includes(`${parentPath}/${name}`));
  const [childs, setChilds] = useState([]);

  const currentFolder = useSelector(state => state.files.currentFolder);

  const selected = useSelector(state => state.files.selected)

  const currentDir = useSelector(state => state.files.currentDir)
  const currentPath = useSelector(state => state.files.currentPath)


  // increase `level` recursively
  // defaultProps comes in on each cycle
  useEffect(() => {
    const nestedChilds = React.Children.map(children, item => {
      if (item?.type === Folder) {
        return React.cloneElement(item, {
          level: level + 1,
          parentPath: `${parentPath}/${name}`
        });
      }
      return item;
    });
    setChilds(nestedChilds);
  }, [children]);


  const structure = useSelector(state => state.files.structure)

  const dragOverHandler = (event) => {
    event.preventDefault();
  };

  function findFileWithId(data, id) {
    for (const item of data) {
      if (item?.file?._id === id) {
        return {...item.file, files: item.files};
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
  

  // Move(where, what);

  // Перетаскивание файлов осуществяется только если папка не хранит эти файлы
  // Переносим папку, если папка не является родителем
  // Переносим папку, если в указанной папке нет элемента с таким именем, если не работает, то выводим сообщение



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



  const dropHandler = (event) => {
    event.preventDefault();
    event.stopPropagation(); 

    const droppedFilesArray = event.dataTransfer.getData('text/plain').split(',');
    const dirs = droppedFilesArray.filter(el => findFileWithId(structure, el)?.type === 'dir')

    if(dirs.length > 0){


      const movedDir = findFileWithId(structure, dirs[0]);
      const parentDir = findFileWithId(structure, id);

      // console.log('Is parent folder to child? Answer:\n' + !isPathAncestor(movedDir.path, parentDir.path))
      // console.log('Has child with the same name? Answer:\n' + !parentDir.files.filter(el => el.name === movedDir.name).length)

      // console.log({
      //   el: movedDir,
      //   to: parentDir
      // })

      // console.log(!isPathAncestor(movedDir.path, parentDir.path) && !parentDir.files.filter(el => el.name === movedDir.name).length)


      // if(!parentDir.path){
      //   console.log('To root')
      // }


      if(!isPathAncestor(movedDir.path, parentDir.path) && movedDir._id !== parentDir._id && !parentDir.files.filter(el => el.name === movedDir.name).length){
        dispatchClassic(moveFile(id, movedDir._id))

        if(currentPath === movedDir.path){
          dispatchClassic(setCurrentPath(parentDir.path + '/' + movedDir.name))
          dispatchClassic(setCurrentOpenFolder('/' + parentDir.path + '/' + movedDir.name));
        }

      }else{
        if(isPathAncestor(movedDir.path, parentDir.path)){
          showErrorAlert('Parent folder cant be moved into child folder!')
        }else if(movedDir._id === parentDir._id){
          showErrorAlert('Cant move folder iteself!')
        }else if(parentDir.files.filter(el => el.name === movedDir.name).length){
          showErrorAlert('Folder already contains folder with this name!')
        }
        
      }
    }else{
      for(let fileId of droppedFilesArray){
        if(currentDir !== id) dispatchClassic(moveFile(id, fileId));
      }
    }
  };



  function openDirHandler(file) {
    dispatchClassic(pushToStack(currentDir))
    dispatchClassic(pushToPath(currentPath))

    if (file._id !== null) {

      dispatchClassic(setCurrentDir(file._id));
      dispatchClassic(setCurrentPath(file.path));
    } else {
      dispatchClassic(setCurrentDir(null));
      dispatchClassic(setCurrentPath(''));
    }

  }

  const isOneType = useSelector(state => state.files.oneType)

  return (
    <StyledFolder
      onClick={event => {
        event.stopPropagation();  
        onNodeClick({
          state,
          name,
          level,
          path: `${parentPath}/${name}`,
          type: "folder"
        });
      }}
      className="tree__folder"
      indent={level}
      onDragOver={dragOverHandler} 
      onDrop={dropHandler} 
    >
      <VerticalLine>
        <ActionsWrapper>
          <FolderName
            name={name}
            isOpen={isOpen}
            handleClick={() => {
              
              if(selected){
                dispatchClassic(setFileSelect(false));
                dispatchClassic(clearSelectedFiles())
              }

              if(isOneType){
                dispatchClassic(setOneType(false))
                dispatchClassic(getFiles())
              }

              openDirHandler(file)

              if (currentFolder !== '/' + file.path) {
                dispatchClassic(setCurrentOpenFolder('/' + file.path));
              }
              if(isOpen === false){
                dispatchClassic(addOpenFolder(`${parentPath}/${name}`));
              }
            
            }}
            handleArrow={() => {
              setIsOpen(!isOpen)
              if (isOpen) {
                dispatchClassic(removeOpenFolder(`${parentPath}/${name}`));
              } else {
                dispatchClassic(addOpenFolder(`${parentPath}/${name}`));
              }
      
            }}
            currentFolder = {(currentFolder) ? currentFolder : '/'}
            folderPath = {'/' + file.path}
            level={level}
            id={file._id}
      
          />
        </ActionsWrapper>
        <Collapse className="tree__folder--collapsible" isOpen={isOpen}>
          {childs}
        </Collapse>
      </VerticalLine>

    </StyledFolder>
  );
});
Folder.defaultProps = { level: 1, parentPath: "" };

export { Folder, FolderName };
