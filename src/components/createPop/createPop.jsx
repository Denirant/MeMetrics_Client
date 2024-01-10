import React, {useState} from 'react';
import Input from "../../utils/input/Input";
import {useDispatch, useSelector} from "react-redux";
import {setPopupDisplay} from "../../reducers/fileReducer";
import {createDir} from "../../actions/file";

const CreatePop = () => {
    const [dirName, setDirName] = useState('')
    const currentDir = useSelector(state => state.files.currentDir)
    const dispatch = useDispatch()

    function createHandler() {
        dispatch(createDir(currentDir, dirName))
        dispatch(setPopupDisplay(false))
    }

    return (
        <div className="popup" onClick={() => dispatch(setPopupDisplay(false))} onKeyDown={(event) => {
            if(event.key === 'Escape' || event.keyCode === 27){
                dispatch(setPopupDisplay(false))
            }
        }}>
            <div className="popup__content" onClick={(event => event.stopPropagation())}>
                <div className="popup__header">
                    <div className="popup__title">Создать новую папку</div>
                    <button className="popup__close" onClick={() => dispatch(setPopupDisplay(false))}>X</button>
                </div>
                <Input type="text" placeholder="Введите название папки..." value={dirName} setValue={setDirName} createFunc={() => console.log('1ß')}/>
                <button className="popup__create" onClick={() => createHandler()}>Создать</button>
            </div>
        </div>
    );
};

export default CreatePop;
