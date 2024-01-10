import React from 'react';
import DownloadFileComp from "./DownloadFileComp";
import './downloader.css'
import {useDispatch, useSelector} from "react-redux";
import {hideDownloader} from "../../../reducers/downloadReducer";

const Downloader = () => {
    const files = useSelector(state => state.download.files)
    const isVisible = useSelector(state => state.download.isVisible)
    const dispatch = useDispatch()


    return ( isVisible &&
        <div className="downloader">
            <div className="downloader__header">
                <div className="downloader__title">Downloads</div>
                <button className="downloader__close" onClick={() => dispatch(hideDownloader())}>X</button>
            </div>
            {files.map(file =>
                <DownloadFileComp key={file.id} file={file}/>
            )}
        </div>
    );
};

export default Downloader;
