import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addUploadFile,
  removeUploadFile,
} from '../../../reducers/uploadReducer';

import Error from '../../../assets/img/NotificationIcons/Alert.svg';
import Warning from '../../../assets/img/NotificationIcons/Warning.svg';
import Success from '../../../assets/img/NotificationIcons/Success.svg';
import Progress from '../../../assets/img/loader_anim.svg'

import FileTypes from '../../../utils/types';

import All from '../../../assets/img/smallFileType/all.svg'
import Image from '../../../assets/img/smallFileType/jpg.svg'
import Link from '../../../assets/img/smallFileType/link.svg'
import Video from '../../../assets/img/smallFileType/mov.svg'
import Audio from '../../../assets/img/smallFileType/mp3.svg'
import PDF from '../../../assets/img/smallFileType/pdf.svg'
import PPT from '../../../assets/img/smallFileType/ppt.svg'
import Text from '../../../assets/img/smallFileType/txt.svg'
import Docs from '../../../assets/img/smallFileType/word.svg'
import Excel from '../../../assets/img/smallFileType/xlsx.svg'
import Rar from '../../../assets/img/smallFileType/zip.svg'
import { uploadFile } from '../../../actions/file';


function getStatusIcon(file){
  switch(file.status.name){
    case 'progress':
      if(file.progress === 100)
        return Success;
      return Progress;
    default:
      return Warning;
  }
}


function getFileFormatIcon(type){
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



const UploadFile = ({file}) => {
  const dispatch = useDispatch()
  const currentPath = useSelector(state => state.files.currentPath)

    function handleCancelFile(){
        if(file.progress !== 100){
            file.cancelSource.cancel('Cancelled by user')    
        }else{
            dispatch(removeUploadFile(file.id))
        }
    }

    function handleRetryUpload(){
        dispatch(removeUploadFile(file.id))
        dispatch(uploadFile(file.file, file.dirId))
    }

    return (
        <div className="upload-file">
            <div className="upload-file__header">
                <img src={getStatusIcon(file)} alt="file_status_icon" />

                <img src={getFileFormatIcon(file.name.split('.').pop().toLowerCase())} alt="file_type_icon" />
                <div className="upload-file__name">
                    {file.name}
                    <p className={file.status.name === 'error' ? 'warning' : ''}>{file.progress < 100 || file.status.name === 'error' ? file.status.message : 'Uploaded to ' + (currentPath.split('/').pop() ? currentPath.split('/').pop() : 'Disk')}</p>
                </div>

                <div className='upload_file-control'>
                    {file.status.name === 'error' && <button className='upload-file__retry' onClick={() => handleRetryUpload()}></button>}
                    <button className={`upload-file__remove ${file.status.name === 'error' || file.progress === 100 ? 'icon' : ''}`} onClick={() => handleCancelFile()}>{file.status.name === 'error' || file.progress === 100 ? '' : 'Cancel'}</button>
                </div>
            </div>
            {file.progress !== 100 && <div className={`upload-file__progress-bar`}>
                <div className="upload-file__upload-bar" style={{width: file.progress + "%"}}/>
            </div>}
        </div>
    );
};


export default UploadFile