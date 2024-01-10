import React, { useRef, useState } from 'react';
import './tree.css'

const RenderFolder = ({onClick, level, folder, currentPath}) => {
    
    const [isOpen, setIsOpen] = useState(false);

    function handleOpenFolder(e){
        setIsOpen(!isOpen);
    }

    const arrowRef = useRef(null)

    return (
        <div className='move_selecter-container' key={folder.file._id} onClick={(e) => {
            onClick(e, folder.file.path)

            if(e.target !== arrowRef.current){
                setIsOpen((!isOpen) ? true : isOpen)
            }
        }}>
            <div className={`move_selecter-title ${currentPath === folder.file.path ? 'selected' : ''}`} style={{paddingLeft: `${(folder.files.filter(el => el.type === 'folder').length > 0 ? 16 : 52) + 16 * level}px`}}>
                
                {
                    folder.files.filter(el => el.type === 'folder').length > 0 && <span ref={arrowRef} className={`move_selecter-btn ${isOpen ? 'active' : ''}`} onClick={(e) => handleOpenFolder(e)}></span>
                }

                <span className='move_selecter-name'>
                    <span className='folder_icon'></span>
                    {folder.name}
                </span>
                
            </div>
            {isOpen && (
                <div className='move_selecter-childs'>
                    {folder.files.filter(item => item.type === 'folder').map((folder) => <RenderFolder level={level + 1} onClick={onClick} folder={folder} currentPath={currentPath}/>)}
                </div>
            )}
        </div>
    );
};


const Path = ({string}) => {
    
    const elements = ['All folders', ...string.split('/')]

    return (
        <ul className='path_container'>
            {elements.map(el => (
                <li>
                    {el}
                </li>
            ))}
        </ul>
    )
}

const MoveFile = ({ prevPath = '', data, handleCloseForm, handleSelectPath }) => {

    const [currentPath, setCurrentPath] = useState(prevPath ? prevPath : '');

    const handleClick = (e, path) => {
        e.stopPropagation();
        const arrow_btn = Array.from(e.target.classList).includes('move_selecter-btn')

        if(!arrow_btn){
            setCurrentPath(path);
        }
    };

    return (
        <div className='move_selecter'>
            {/* <p className='folder_select-path'>{currentPath}</p> */}
            <div className="move_selecter-header">
                <p>Select path...</p>
                <div className='close_btn' onClick={handleCloseForm}></div>
            </div>
            <div className="move_selecter-body">
                <Path string={currentPath ? currentPath : prevPath} />
                {data.filter(item => item.type === 'folder').map((folder) => <RenderFolder level={0} onClick={handleClick} folder={folder} currentPath={currentPath}/>)}
            </div>
            <div className="move_selecter-control">
                <div className="move_selecter-button" onClick={handleCloseForm}>Cancel</div>
                <div className={`move_selecter-button blue ${currentPath === prevPath ? 'unActive' : ''}`} onClick={(e) => handleSelectPath(currentPath)} >Move</div>
            </div>
        </div>
    );
};

export default MoveFile;