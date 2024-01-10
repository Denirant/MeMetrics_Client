import React, {useState} from 'react';
import Input from "../../utils/input/Input";
import {useDispatch, useSelector} from "react-redux";
import {setPopupDisplay} from "../../reducers/fileReducer";
import {createDir} from "../../actions/file";
import { getStructure } from '../../actions/file';
import './popup.css'
import TreeSelect from '../TreeSelect/TreeSelect';

const Path = ({string}) => {
    
    const elements = string.length > 0 ? ['All folders', ...string.split('/')] : ['All folders'];

    console.log(elements)

    return (
        <ul className='path_container'>
            {elements.map(el => (
                <li className='path_container--item'>
                    {el}
                </li>
            ))}
        </ul>
    )
}

const Popup = () => {
    const [dirName, setDirName] = useState('');
    const currentPath = useSelector(state => state.files.currentPath)
    const [currentDir, setCurrentDir] = useState(useSelector(state => state.files.currentDir))
    const [selectedPath, setSelectedPath] = useState(currentPath);
    const dispatch = useDispatch();
    const [isSelecting, setIsSelecting] = useState(false);
    const structure = useSelector(state => state.files.structure)

    function createHandler() {
        dispatch(createDir(currentDir, dirName))
        dispatch(setPopupDisplay(false))
    }

    function handleChangePath(newPath){
        setIsSelecting(false);
        setSelectedPath(newPath)

        setCurrentDir(findElementWithPath(structure, newPath))
    }

    function findElementWithPath(data, path) {
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


    // alert(currentPath)
      

    return (
        <div className="popup" id='popUpContainer' onClick={(e) => {
            if(e.target.id === 'popUpContainer'){
                dispatch(setPopupDisplay(false))
            }
        }} onKeyDown={(event) => {
            if(event.key === 'Escape' || event.keyCode === 27){
                dispatch(setPopupDisplay(false))
            }
        }}>
            {!isSelecting ? 
                <div className="popup__content" onClick={(event => event.stopPropagation())}>
                    <div className="popup__header">
                        <div className='popup_location'>
                            <div className="popup_title">New folder</div>
                            {console.log(selectedPath)}
                            <Path string={selectedPath} />
                            <button onClick={() => setIsSelecting(true)} className='popup_change-btn'>Change location</button>
                        </div>
                        <button className="popup_close" onClick={() => dispatch(setPopupDisplay(false))}></button>
                    </div>

                    <Input label={'Name'} type="text" placeholder="Folder name" value={dirName} setValue={setDirName} createFunc={createHandler}/>

                    <div className='popup_control'>
                        <button className="popup-button" onClick={() => dispatch(setPopupDisplay(false))}>Cancel</button>
                        <button className="popup-button blue" onClick={() => createHandler()}>Create</button>
                    </div>
                </div> :
                <TreeSelect prevPath={currentPath} data={structure} handleCloseForm={() => setIsSelecting(false)} handleSelectPath={handleChangePath}/>
            }
        </div>
    );
};

export default Popup;
