import React, { useRef } from 'react'
import './style.css'

import Close from '../../assets/img/Close.svg'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from '../../reducers/userReducer';

import ReadActive from '../../assets/img/NotificationControl/outline.svg'

import Informative from './NotificationFrameElements/Informative';

import EyeIcon from '../../assets/img/eye.png'

function NotificationFrame() {

    const dispatch = useDispatch();
    const isNotification = useSelector(state => state.user.isNotification)
    const frameRef = useRef(null);
    const closeRef = useRef(null)

    function handleClick(e){
    
        if (frameRef.current !== null && !frameRef.current.contains(e.target) || closeRef.current === e.target) {
            dispatch(setNotification(!isNotification))
        }
    }

    function handleSortNotification(e){
        console.log('Sort')
    }

    function handleFilterNotification(e){
        console.log('Filter')
    }
        
    return (
        <div onClick={handleClick} className='frame-background'>
            <div ref={frameRef} className='frame-container'>
                <div className='frame-header'>
                    <p>Notifications</p>
                    <img ref={closeRef} onClick={handleClick} src={Close} alt="close icon" />
                </div>
                <div className='frame-control'>
                    <div className='frame-control_radio'>
                        <input type="radio" name='select_read' id='all' className='radio_read--input' value='all'/>
                        <label htmlFor="all">All</label>
                        <input type="radio" name='select_read' id='unread' className='radio_read_select' value='unread'/>
                        <label htmlFor="unread">Unread</label>
                    </div>
                    <div className='frame-control_btns'>
                        <button className='frame-control_btn frame-control_btn__sort' onClick={handleSortNotification}></button>
                        <button className='frame-control_btn frame-control_btn__filter' onClick={handleFilterNotification}></button>
                        <button className='frame-control_btn__long'>
                            <img src={EyeIcon} alt="" width={14} height={14} />
                            <span>Mark as read </span>
                        </button>
                    </div>
                </div>
                <div className='frame-list'>
                    {/* <div className='frame-list--el'></div>
                    <div className='frame-list--el'></div>
                    <div className='frame-list--el'></div>
                    <div className='frame-list--el'></div>
                    <div className='frame-list--el'></div>
                    <div className='frame-list--el'></div>
                    <div className='frame-list--el'></div>
                    <div className='frame-list--el'></div>
                    <div className='frame-list--el'></div>
                    <div className='frame-list--el'></div> */}

                    <Informative 
                        image='https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' 
                        title='Lex Murphy left a comment on UNIX directory tree hierarchy' 
                        time={new Date([2023, 9, 14])}
                        isImportant
                    />

                    <Informative 
                        image='https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' 
                        title='Lex Murphy left a comment on UNIX directory tree hierarchy' 
                        time={new Date([2023, 9, 14])} 
                        message={"Oh, I finished de-bugging the phones, but the system's compiling for eighteen minutes, or twenty.  So, some minor systems may go on and off for a while."}
                    />


                    <Informative 
                        image='https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' 
                        title='Lex Murphy left a comment on UNIX directory tree hierarchy' 
                        time={new Date([2023, 9, 14])}
                        onAccept={{
                            action: (e) => console.log(e.target),
                            text: 'Accept',
                        }}
                        onReject={{
                            action: (e) => console.log(e.target),
                            text: 'Reject',
                        }}
                        message={"Oh, I finished de-bugging the phones, but the system's compiling for eighteen minutes, or twenty.  So, some minor systems may go on and off for a while."}
                        isImportant
                    />

                    <Informative 
                        image='https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' 
                        title='Lex Murphy left a comment on UNIX directory tree hierarchy' 
                        time={new Date([2023, 9, 14])}
                        onReject={{
                            action: (e) => console.log(e.target),
                            text: 'Reject',
                        }}
                        isImportant
                    />


                    <Informative 
                        image='https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' 
                        title='Lex Murphy left a comment on UNIX directory tree hierarchy' 
                        time={new Date([2023, 9, 14])} 
                        message={"Oh, I finished de-bugging the phones, but the system's compiling for eighteen minutes, or twenty.  So, some minor systems may go on and off for a while."}
                        onReject={{
                            action: (e) => console.log(e.target),
                            text: 'Reject',
                        }}
                    />

                    <Informative 
                        image='https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' 
                        title='Lex Murphy left a comment on UNIX directory tree hierarchy' 
                        time={new Date([2023, 9, 14])}
                    />

                    <Informative 
                        image='https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg' 
                        title='Lex Murphy left a comment on UNIX directory tree hierarchy' 
                        time={new Date([2023, 9, 14])} 
                        message={"Oh, I finished de-bugging the phones, but the system's compiling for eighteen minutes, or twenty.  So, some minor systems may go on and off for a while."}
                    />
                </div>
            </div>
        </div>
    )
}

export default NotificationFrame
