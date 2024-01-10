import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import './style.css';
import { RiDeleteBin2Line } from 'react-icons/ri';


const PhotoInput = forwardRef((props, ref) => {
    const [photo, setPhoto] = useState('');
    const inputFileRef = useRef(null);


    const handlePhotoChange = (event) => {
        let target = event.target || window.event.srcElement,
            files = target.files;

        setPhoto(files[0]);
    
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {
                setPhoto(fr.result);
            }
            fr.readAsDataURL(files[0]);
        }
    };

    const handleRemovePhoto = () => {
        setPhoto('');
        inputFileRef.current.value = '';
    };

    useImperativeHandle(ref, () => ({
        getPhoto: () => inputFileRef.current.files[0],
        clearPhoto: () => {
          setPhoto('');
          inputFileRef.current.value = '';
        }
    }));
    

    return (
        <div className="photo-input">
            {photo ? (
                <div className="photo-preview">
                <img src={photo} alt="Selected icon" />
                <button className="remove-photo" onClick={handleRemovePhoto}>
                    <RiDeleteBin2Line color='black' />
                </button>

                </div>
            ) : (
                <label htmlFor="photo" className="empty-photo">
                    Click to select a photo
                </label>
            )}
            <input 
                type="file" 
                id="photo" 
                accept="image/*" 
                onChange={handlePhotoChange}
                ref={inputFileRef} 
            />
        </div>
    );
});

export default PhotoInput;
