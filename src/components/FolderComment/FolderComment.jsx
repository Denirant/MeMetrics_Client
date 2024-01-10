 import React, { useState } from 'react';
 import closeIcon from '../../assets/img/Close.svg';
 import './style.css';
 import moment from 'moment';

function FolderComment({text, handleClose, handleChange, lastEdit}) {

    const [textareaComment, setTextareComment] = useState(String(text));

    console.log(textareaComment)

  return (
    <div className='comment_body'>
      <div className='comment_body-header'>
        <p className='comment_body-title'>Comment</p>
        <img src={closeIcon} alt="icon" onClick={() => handleClose(textareaComment)}/>
      </div>
      <textarea placeholder='Comment...' id="comment" onChange={(e) => setTextareComment(e.target.value)} value={textareaComment}></textarea>
      <p className='comment_body-edit'>Last change: {lastEdit ? moment(lastEdit).format('HH:mm, DD.MM.YYYY') : 'None'}</p>
    </div>
  )
}

export default FolderComment
