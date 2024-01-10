import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {createDir, getFiles, uploadFile, getStructure, changeComment, getComment, getAnalitic} from "../../actions/file";
import FileList from "./fileList/FileList";
import Path from '../pathComponent/path';
import './disk.css'
import Popup from "./Popup";
import {setCurrentDir, setCurrentPath, setFileView, setPopupDisplay, setFileSelect, clearSelectedFiles, setVisibleFiles, setOneType} from "../../reducers/fileReducer";
import Uploader from "./uploader/Uploader";

import {API_URL} from "../../config";
import axios from 'axios';

import { Resizable } from 'react-resizable';

// File tree data
import Tree from '../tree/Tree';
import Downloader from './downloader/Downloader';
import CustomSelect from '../select/Select';
import DropdownSelect from '../dropdownSelect/dropdownSelect';

import MultipleSelectAction from '../multipleSelectAction/multipleSelectAction';

import DragImage from '../dragComponent/DragImage';
import DiskNavigation from '../diskNavbar/DiskNavigation';

import FolderComment from '../FolderComment/FolderComment';
import { render } from 'react-dom';

import SplitPane, { Pane } from "split-pane-react";
import 'split-pane-react/esm/themes/default.css'



import updateItemWidth from '../../utils/changeFileSize';
import CircleChart from '../CircleChart/CircleChart';


import AllSelect from '../../assets/img/FileType/all.svg';
import ImageSelect from '../../assets/img/FileType/jpg.svg';
import LinkSelect from '../../assets/img/FileType/link.svg';
import VideoSelect from '../../assets/img/FileType/mov.svg';
import AudioSelect from '../../assets/img/FileType/mp3.svg';
import PDFSelect from '../../assets/img/FileType/pdf.svg';
import PPTSelect from '../../assets/img/FileType/ppt.svg';
import TextSelect from '../../assets/img/FileType/txt.svg';
import DocumentSelect from '../../assets/img/FileType/word.svg';
import ExcelSelect from '../../assets/img/FileType/xlsx.svg';
import ArchiveSelect from '../../assets/img/FileType/zip.svg';
import ImageInspector from './imageInspector';

// const structure = [
//     {
//       type: "folder",
//       name: "client",
//       files: [
//         {
//           type: "folder",
//           name: "ui",
//           files: [
//             { type: "file", name: "Toggle.js" },
//             { type: "file", name: "Button.js" },
//             { type: "file", name: "Button.style.js" }
//           ]
//         },
//         {
//           type: "folder",
//           name: "components",
//           files: [
//             { type: "file", name: "Tree.js" },
//             { type: "file", name: "Tree.style.js" }
//           ]
//         },
//         { type: "file", name: "setup.js" },
//         { type: "file", name: "setupTests.js" }
//       ]
//     },
//     {
//       type: "folder",
//       name: "packages",
//       files: [
//         {
//           type: "file",
//           name: "main.js"
//         }
//       ]
//     },
//     { type: "file", name: "index.js" }
// ];
  

const Disk = () => {

    const dispatch = useDispatch()
    const currentDir = useSelector(state => state.files.currentDir)
    const currentPath = useSelector(state => state.files.currentPath)
    const files = useSelector(state => state.files.files)
    const [sort, setSort] = useState('');
    const structure = useSelector(state => state.files.structure);
    const openFolders = useSelector(state => state.files.openFolders);
    const selected = useSelector(state => state.files.selected)
    const selectedFiles = useSelector(state => state.files.selectedFiles)
    const isOneType = useSelector(state => state.files.oneType)


    const defaultSelectText =  "Sort by";
    const listSort =  [
        { id: 'no', name: 'No'},
        { id: 'name', name: "Name" },
        { id: 'type', name: "Type" },
        { id: 'date', name: "Date" }
    ]

    const defaultDropdownSelectText =  "Type";
    const listType =  [
        { id: 'all', name: 'All files', image: AllSelect},
        { id: 'image', name: "Images", image: ImageSelect},
        { id: 'video', name: "Video", image: VideoSelect},
        { id: 'audio', name: "Audio", image: AudioSelect},
        { id: 'pdf', name: "Files PDF", image: PDFSelect},
        { id: 'ppt', name: "Presentations (PPT)", image: PPTSelect},
        { id: 'txt', name: "Text", image: TextSelect},
        { id: 'document', name: "Documents", image: DocumentSelect},
        { id: 'excel', name: "Excel", image: ExcelSelect},
        { id: 'zip', name: "Archive (ZIP)", image: ArchiveSelect},
    ]


    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        dispatch(getFiles(currentDir, sort));
    }, [currentDir, sort]);

    useEffect(() => {
        if(files.length === 0){
            dispatch(setFileSelect(false));
            dispatch(setOneType(false))
        }
    }, [files]);

    useEffect(() => {

        if(!isMounted){
            dispatch(getStructure())
            setIsMounted(true);

            dispatch(setVisibleFiles(listType.map(el => el.name)))
            dispatch(getAnalitic())
        }
    }, []);


    function showPopupHandler() {
        dispatch(setPopupDisplay(true))
    }

    function fileUploadHandler(event) {
        const files = [...event.target.files]


        if(files.length > 0){
            files.forEach(file => dispatch(uploadFile(file, currentDir)));
        }
        
        event.target.value = null;
    }

    function dragEnterHandler(event) {
        event.preventDefault()
        event.stopPropagation()
    }

    function dragLeaveHandler(event) {
        event.preventDefault()
        event.stopPropagation()
    }

    function dropHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        let files = [...event.dataTransfer.files]
        files.forEach(file => dispatch(uploadFile(file, currentDir)))
    }

    const buildTree = (data) => {

        return data.map((item, index) => {

            if (item.type === 'folder') {
                return (
                <Tree.Folder id={item.file._id} key={`structure_folder_${index}`} name={item.name} file={item.file} openFolders={openFolders}>
                    {buildTree(item.files)}
                </Tree.Folder>
                );
            } 
        });
    };

    const TreeStructure = ({ data }) => {
        
        return (
            <Tree>
                {buildTree(data)}
            </Tree>
        );
    };


    function handleSelectElements(e) {
        dispatch(setFileSelect(!selected));
        if(selected){
            dispatch(clearSelectedFiles())
        }
    }


    async function handleComment(e){
        e.stopPropagation()
        
        const comment = await dispatch(getComment(currentDir));

        const container = document.createElement('div');
        container.classList.add('comment_container')
        document.querySelector('.app').appendChild(container);

        render(
            <FolderComment text={comment.text} lastEdit={comment.lastEdit} handleClose={(text) => {
                container.remove();
                dispatch(changeComment(text, currentDir));
            }}/>,
            container
        );
    }

    const [sizes, setSizes] = useState([
        270,
        'auto',
    ]);

    const analytic = useSelector(state => state.files.diskAnalytic)

    function convert(data){
        const total = data.reduce((acc, item) => {
            return acc + item.size;
        }, 0);
        const emptySize = data[0].size;

        let target = total - emptySize;

        if(target < emptySize){
            target = emptySize;
        }

        return data.map((el) => {
            if (el.size >= 0 && el.size <= target * 0.04) {
                return {
                    name: el.name,
                    size: el.size + target * 0.04,
                    label: el.label,
                    color: el.color
                };
            }
        
            if (el.size > target * 0.04 && el.size <= target * 0.08) {
                return {
                    name: el.name,
                    size: el.size + target * 0.06,
                    label: el.label,
                    color: el.color
                };
            }

            if (el.size > target * 0.08 && el.size <= target * 0.12) {
                return {
                    name: el.name,
                    size: el.size + target * 0.1,
                    label: el.label,
                    color: el.color
                };
            }

            if (el.size > target * 0.4) {
                return {
                    name: el.name,
                    size: el.size * 0.4,
                    label: el.label,
                    color: el.color
                };
            }
        
            return {
                name: el.name,
                size: el.size,
                label: el.label,
                color: el.color
            };
        });
        
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

    const uploadedFiles = useSelector(state => state.upload.files);


    const currentFolder = useSelector(state => state.files.currentFolder);

    const [imageInspectorPath, setImageInspectorPath] = useState(null);
    
    async function handleSelectFile(path = null){
        await setImageInspectorPath(path);
    }

    async function handleClose(){
        await setImageInspectorPath(null);
    }

    return (
        <div className="disk" id='disk' onChange={(e) => console.log(e)}>
            <div className='disk_container'>
                
                <SplitPane
                    primary="first"
                    split='vertical'
                    sizes={sizes}
                    onChange={(e) => {
                        setSizes(e)
                        updateItemWidth()
                    }}
                    onDragFinished={(e) => {
                        console.log(e)
                    }}
                >
                    <Pane minSize={230} maxSize={400} className='disk_left'>
                        <div className='disk_structure'>
                            <h2 >Folders</h2>
                            { <TreeStructure data={structure}/> }
                        </div>
                        
                        {analytic.length && <CircleChart dataProp={convert(analytic)} usedSpace={convertBytesToUnits(analytic.filter(el => el.name !== 'Empty').reduce((acc, item) => { return acc + item.size }, 0))}/>}

                    </Pane>

                    <Pane>
                        <div className='disk_files'>
                            <div className='nav_flex_one_type'>
                                <DiskNavigation isOneType={isOneType} createFunction={() => {
                                    showPopupHandler()
                                }}/>
                                {isOneType && <div className={`content_btn content_btn__white content_btn__select ${selected ? 'active' : ''}`} onClick={handleSelectElements}></div>}
                            </div>

                            {(!files.filter(el => el.type !== 'dir').length && !isOneType) && <div className='content_control'>
                                {!isOneType && <Path address={currentPath}/>}
                                {!isOneType && <div className='content_btns'>
                                    <div className='content_btn content_btn__blue content_btn__comment' style={{
                                        pointerEvents: !currentDir ? 'none' : 'all',
                                        opacity: !currentDir ? '.6' : '1',
                                    }} onClick={handleComment}></div>
                                </div>}
                            </div>
                            }

                            {!isOneType && <div className={`drop-area ${!files.filter(el => el.type !== 'dir').length ? 'drop-area--empty' : ''}`} onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                                Drag & Drop or Choose file to 
                                <div className="disk__upload">
                                    <label htmlFor="disk__upload-input" className="disk__upload-label">Upload</label>
                                    <input multiple={true} onChange={(event)=> fileUploadHandler(event)} type="file" id="disk__upload-input" className="disk__upload-input"/>
                                </div>
                            </div>}
                            {files.filter(el => el.type !== 'dir').length > 0 && !isOneType && <div className='content_control'>
                                <Path address={currentPath}/>
                                <div className='content_btns'>
                                    
                                    <div className='custom-select' style={{width: 'fit-content'}}>
                                        <DropdownSelect 
                                            defaultText={defaultDropdownSelectText}
                                            optionsList={listType}
                                        />
                                    </div>
                                    <div className='custom-select' style={{width: 'fit-content'}}>
                                        <CustomSelect
                                            defaultText={defaultSelectText}
                                            optionsList={listSort}
                                            handleFunction={setSort}
                                        />
                                    </div>
                                    <div className={`content_btn content_btn__white content_btn__select ${selected ? 'active' : ''}`} onClick={handleSelectElements}></div>
                                    <div className='content_btn content_btn__blue content_btn__comment' style={{
                                        pointerEvents: !currentDir ? 'none' : 'all',
                                        opacity: !currentDir ? '.6' : '1',
                                    }} onClick={handleComment}></div>
                                </div>
                            </div>}
                            
                            {files.filter(el => el.type !== 'dir').length > 0 && <FileList isHuge={isOneType} handleSelectFile={handleSelectFile}/>}
                            {uploadedFiles.length > 0 && <Uploader/>}
                            <Downloader/>

                            {selected && selectedFiles.length > 0 && <MultipleSelectAction/>}
                        </div>


                    </Pane>
                </SplitPane>
                {imageInspectorPath && <ImageInspector imagePath={imageInspectorPath} handleClose={handleClose}/>}
            </div>

            <DragImage/>
        </div>
    );
};

export default Disk;
