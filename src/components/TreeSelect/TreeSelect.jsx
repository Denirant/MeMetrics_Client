import React, { useRef, useState } from 'react';
import './tree.css'

const RenderFolder = ({onClick, level, folder, currentPath}) => {
    
    const [isOpen, setIsOpen] = useState(false);

    function handleOpenFolder(e){
        setIsOpen(!isOpen);
    }

    const arrowRef = useRef(null)

    return (
        <div className='folder_select-container' key={folder.file._id} onClick={(e) => {
            onClick(e, folder.file.path);

            if(e.target !== arrowRef.current){
                setIsOpen((!isOpen) ? true : isOpen)
            }
        }}>
            <div className={`folder_select-title ${currentPath === folder.file.path ? 'selected' : ''}`} style={{paddingLeft: `${ (folder.files.filter(el => el.type === 'folder').length > 0 ? 16 : 52) + 16 * level}px`}}>
                {
                    folder.files.filter(el => el.type === 'folder').length > 0 && <span ref={arrowRef} className={`folder_select-btn ${isOpen ? 'active' : ''}`} onClick={(e) => handleOpenFolder(e)}></span>
                }
                <span className='folder_select-name'>
                    <span className='folder_icon'></span>
                    {folder.name}
                </span>
            </div>
            {isOpen && (
                <div className='folder_select-childs'>
                    {folder.files.filter(item => item.type === 'folder').map((folder) => <RenderFolder level={level + 1} onClick={onClick} folder={folder} currentPath={currentPath}/>)}
                </div>
            )}
        </div>
    );
};


const Path = ({string}) => {
    
    const elements = string.length > 0 ? ['All folders', ...string.split('/')] : ['All folders']

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

const TreeSelect = ({ prevPath = '', data, handleCloseForm, handleSelectPath }) => {

    const [currentPath, setCurrentPath] = useState(prevPath ? prevPath : '');

    const handleClick = (e, path) => {
        e.stopPropagation();
        const arrow_btn = Array.from(e.target.classList).includes('folder_select-btn')

        if(!arrow_btn){
            setCurrentPath(path);
        }
    };

    return (
        <div className='folder_select'>
            {/* <p className='folder_select-path'>{currentPath}</p> */}
            <div className="folder_select-header">
                <p>Select path...</p>
                <div className='close_btn' onClick={handleCloseForm}></div>
            </div>
            <div className="folder_select-body">
                <Path string={currentPath} />
                <div className='folder-select-container'>
                    {data.filter(item => item.type === 'folder').map((folder) => <RenderFolder level={0} onClick={handleClick} folder={folder} currentPath={currentPath}/>)}
                </div>
            </div>
            <div className="folder_select-control">
                <div className="folder_select-button" onClick={handleCloseForm}>Cancel</div>
                <div className={`folder_select-button blue ${currentPath === prevPath ? 'unActive' : ''}`} onClick={(e) => handleSelectPath(currentPath)} >Select</div>
            </div>
        </div>
    );
};

export default TreeSelect;