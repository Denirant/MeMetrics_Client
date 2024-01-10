import React, { useRef, useState } from 'react'
import CloseIcon from '../../../assets/img/Close.svg'
import { useDispatch, useSelector } from 'react-redux';
import { searchFiles } from '../../../actions/file';
import moment from 'moment';
import './search.css'
import { addOpenFolder, setClickedFile, setCurrentDir, setCurrentOpenFolder, setCurrentPath, setSearchFiles } from '../../../reducers/fileReducer';


import FileTypes from '../../../utils/types';
import All from '../../../assets/img/filesIcons/all.svg'
import Image from '../../../assets/img/filesIcons/jpg.svg'
import Link from '../../../assets/img/filesIcons/link.svg'
import Video from '../../../assets/img/filesIcons/mov.svg'
import Audio from '../../../assets/img/filesIcons/mp3.svg'
import PDF from '../../../assets/img/filesIcons/pdf.svg'
import PPT from '../../../assets/img/filesIcons/ppt.svg'
import Text from '../../../assets/img/filesIcons/txt.svg'
import Docs from '../../../assets/img/filesIcons/word.svg'
import Excel from '../../../assets/img/filesIcons/xlsx.svg'
import Rar from '../../../assets/img/filesIcons/zip.svg'
import Folder from '../../../assets/img/closeFolder.svg'
import { useOutsideClick } from '../../../utils/useOutsideClick';


function DiskSearch() {

  const filterRef = useRef(null)

  
  const [isOpen, setIsOpen] = useOutsideClick(filterRef, false);
  const [filter, setFilter] = useState({
    folders: true,
    files: true,
  })
  const [suggetion, setSuggetion] = useState(false);
  
  const dispatch = useDispatch();
  const closeRef = useRef(null);
  const suggetions = useRef(null);


  const structure = useSelector(state => state.files.structure);
  const searchFilesArray = useSelector(state => state.files.searchFiles);
  const openFolders = useSelector(state => state.files.openFolders);

  const [search, setSearch] = useState('');

  function handleChange(e){
    setSearch(e.target.value);
    if(e.target.value.length > 1){
      dispatch(searchFiles(e.target.value))
    } else{
      dispatch(setSearchFiles([]))
    }
  }

  function handleSearch(e){
    const field = document.getElementById('search_field');

    console.log(!e.target.closest('.suggetions'))

    if(e.target !== closeRef.current && document.activeElement !== field && !e.target.closest('.suggetions')){
      field.focus();
    }

    setSuggetion(true)
    setIsOpen(false)
  }

  const findMatchingFolderId = (folders, targetPath) => {
    for (const folder of folders) {
      console.log(folder.file)
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

  function handleSelectItem(e, file){
    if(file.type === 'dir'){
      const parents = file.path.split('/')
      const field = document.getElementById('search_field');

      field.blur();
      
      for(let i = 0; i < parents.length; i++){
        const parent = '/Disk' + ((parents.slice(0, i).join('/')) ? '/' + parents.slice(0, i).join('/') : '');
        if(!openFolders.includes(parent)){
          dispatch(addOpenFolder(parent));
        }
      }

      dispatch(setSearchFiles([]))
      setSearch('')
      dispatch(setCurrentDir(file._id))
      dispatch(setCurrentOpenFolder('/' + file.path))
      dispatch(setCurrentPath(file.path))
    }else{
      const fileFolderPath = file.path.split('/').slice(0, file.path.split('/').length - 1).join('/')
      console.log(fileFolderPath)
      console.log(structure)
      const id = findMatchingFolderId(structure, fileFolderPath)

      dispatch(setCurrentDir(id))

      const parents = fileFolderPath.split('/')
      for(let i = 0; i < parents.length; i++){
        const parent = '/Disk' + ((parents.slice(0, i).join('/')) ? '/' + parents.slice(0, i).join('/') : '');
        if(!openFolders.includes(parent)){
          dispatch(addOpenFolder(parent));
        }
      }

      dispatch(setSearchFiles([]))
      setSearch('')
      dispatch(setCurrentDir(id))
      dispatch(setCurrentOpenFolder('/' + fileFolderPath))
      dispatch(setCurrentPath(fileFolderPath))
      dispatch(setClickedFile(file._id))
    }
  }

  function getFileIcon(type){
    if(type === 'dir'){
      return Folder;
    }


    switch (Object.keys(FileTypes).find(key => FileTypes[key].includes(type)) || '') {
        case 'image':
            return Image;
        case 'document':
            return Docs;
        case 'table':
            return Excel;
        case 'pdf':
            return PDF;
        case 'text':
            return Text;
        case 'rar':
            return Rar;
        case 'audio':
            return Audio;
        case 'video':
            return Video;
        case 'webPage':
            return All;
        case 'presentation':
            return PPT;
        case 'database':
        case 'iso':
        case 'vector':
        case 'torrent':
        case 'scan':
        case 'ebook':
        case 'photoshop':
            return All;
        default:
            return All;
    }
}

  return (
    <div className='navigation_search'>
        <div className='navigation_search_input' onClick={handleSearch}>
          {(searchFilesArray.length > 0 && search.length > 0 && suggetion) && 
            <div ref={suggetions} className='suggetions'>
              <h1>Results</h1>
              <ul>
                {
                  searchFilesArray.filter(el => 
                    (el.type === 'dir' && filter.folders) || 
                    (el.type !== 'dir' && filter.files)
                  ).map((el, index) => (
                    <li key={`search_${index}`} className='search-file' onClick={(e) => handleSelectItem(e, el)}>
                      <img className='search-file--image' src={getFileIcon(el.type)} alt="" />
                      <div className='search-file--content'>
                        <h2 className='search-file--name'>{el.name}</h2>
                        <p className='search-file--path'>{'All files / ' + el.path.split('/').slice(0, el.path.split('/').length - 1).join(' / ')}</p>
                      </div>
                      <p className='search-file--date'>{moment(el.date).format('DD.MM.YYYY')}</p>
                    </li>
                  ))
                }
              </ul>
            </div>
          }

          <div className='navigation_search_input-loop'></div>
          <input onBlur={(e) => {setTimeout(() => {
            setSuggetion(false)
            dispatch(setSearchFiles([]))
          }, 100)}} type="text" id='search_field' placeholder='Search' value={search} onFocus={handleChange} onChange={handleChange} onKeyDown={(e) => {
            if(e.key === 'Enter'){
              console.log(filter)
              console.log(search)
            }
          }}/>
          {search.length > 0 && <img className='clear' alt='iconCross' ref={closeRef} src={CloseIcon} onClick={() => setSearch('')}></img>}
        </div>
        <div className='navigation_search_settings' ref={filterRef} onClick={(e) => {
          if(!e.target.closest('.filter_dropdown')){
            setIsOpen(!isOpen)
          }
        }}>
          {isOpen && <div className='filter_dropdown'>
            <div className='navigation_search_header'>
              <p className='navigation_search_title'>Filters</p>
              <img className='navigation_search_close' src={CloseIcon} alt="icon" onClick={() => setIsOpen(false)}/>
            </div>
            <ul className='navigation_search_container'>
              <li className='navigation_search_item'>
                <input type="checkbox" id='search_folders' onChange={() => setFilter({...filter, folders: !filter.folders})} checked={filter.folders}/>
                <label htmlFor="search_folders">Folders</label>
              </li>
              <li className='navigation_search_item'>
                <input type="checkbox" id='search_files' onChange={() => setFilter({...filter, files: !filter.files})} checked={filter.files}/>
                <label htmlFor="search_files">Files</label>
              </li>
            </ul>
          </div> }
        </div>
        {/* {search.length > 0 && 
          <div className='search_btn'>
            Search
          </div>
        } */}
    </div>
  )
}

export default DiskSearch






