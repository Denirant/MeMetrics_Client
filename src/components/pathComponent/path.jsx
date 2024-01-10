import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setCurrentDir, setCurrentOpenFolder, setCurrentPath, setFileView, setPopupDisplay} from "../../reducers/fileReducer";
import './path.css';
import { getFiles } from '../../actions/file';

export default function Path({address}) {
    const dispatch = useDispatch()

    const formattedAddress = address.startsWith('/All files/') ? address : `/All files/${address}`;
    const elements = formattedAddress.split('/').filter((element) => element !== '');
    const structure = useSelector(state => state.files.structure)
    const currentDir = useSelector(state => state.files.currentDir)
    const [hoveredElement, setHoveredElement] = useState(null);


    const findMatchingFolderId = (folders, targetPath) => {
        for (const folder of folders) {
          if (folder?.file?.path === targetPath) {
            return folder.file._id;
          } else if (folder.files && folder.files.length > 0) {
            const nestedMatch = findMatchingFolderId(folder.files, targetPath);
            if (nestedMatch !== null) {
              return nestedMatch;
            }
          }
        }
        return null;
    };

      


    const setPathAddress = (event, index) => {

        dispatch(setCurrentPath('/'));

        const newPath = elements.slice(1, index + 1).join('/');
        if(newPath !== ''){
            const newDir = findMatchingFolderId(structure, newPath);

            if (newDir !== null) {
                dispatch(setCurrentDir(newDir));
                dispatch(setCurrentPath(newPath));
                dispatch(setCurrentOpenFolder('/' + newPath))
            } else if (currentDir !== null) {
                dispatch(setCurrentDir(null));
                dispatch(setCurrentPath(newPath));
                dispatch(setCurrentOpenFolder('/' + newPath))
            }
          

            dispatch(setCurrentDir(newDir))
            dispatch(setCurrentPath(newPath))
        }else if(currentDir !== null){
            dispatch(setCurrentDir(null))
            dispatch(setCurrentPath(newPath))

            dispatch(setCurrentOpenFolder('/' + newPath))
        }else{
            dispatch(getFiles())

            dispatch(setCurrentOpenFolder(''))
        }
        
    }

    return (
        <div className="path-container">
        {elements.map((element, index) => (
            <div className='path-field'>
                {
                    index !== 0 && 
                    <span className={`path-slash ${hoveredElement === index ? 'hovered' : ''}`}>/</span>
                }

                <div
                    className={`path-element ${hoveredElement === index ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredElement(index)}
                    onMouseLeave={() => setHoveredElement(null)}
                    onClick={(e) => setPathAddress(e, index)}
                >
                    {element}
                </div>
            </div>
        ))}
        </div>
    );
}
