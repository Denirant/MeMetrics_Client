import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const DownloadFileComp = ({file}) => {
  const dispatch = useDispatch()

  console.log(file)

  return (
      <div className="download-file">
          <div className="download-file__header">
              <div className="download-file__name">{(file.type === 'dir' ? file.name + '.zip' : file.name)}</div>
          </div>
          <div className="download-file__progress-bar">
              <div className="download-file__download-bar" style={{width: file.progress + "%"}}/>
              <div className="download-file__percent">{file.progress}%</div>
          </div>
      </div>
  );
};


export default DownloadFileComp;