import React from 'react'
import './drag.css'
import { useSelector } from 'react-redux'


function DragImage() {
    
    const selectedFiles = useSelector(state => state.files.selectedFiles)
    
    return (
        <div className='drag_container' id='drag'>
            <div className={`drag_plate ${selectedFiles.length < 2 ? '' : 'multy'}`}>
                {
                    (selectedFiles.length === 1) ? selectedFiles[0].name.slice(0, 11) + '...' : selectedFiles.length
                }
            </div>
        </div>
    )
}

export default DragImage
