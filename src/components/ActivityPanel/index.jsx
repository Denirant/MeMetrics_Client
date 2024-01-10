import React from "react";
import './style.css'

function ActivityPopUp({
  title,
  date,
  name,
  surname,
  image,
  tags,
  description,
  files,
  handleClose,
}) {
  return (
    <div className="activity_element_wrapper">
      <div className="activity_element_container">
        <div className="header">
          <h1 className="header_title">{title}</h1>
          <p className="header_date">{date}</p>
          <div className="header_close" onClick={handleClose}></div>
        </div>
        <div className="body">
          <div className="row">
            <h1 className="title">Responsible</h1>
            <div className="content">
              <img src={image} alt="icon" width={24} height={24} />
              <p>
                {name} {surname}
              </p>
            </div>
          </div>
          <div className="row">
            <h1 className="title">Tags</h1>
            <ul className="tags-list">
                {tags && tags.map(el => (
                    <div className="tags-list_item">
                        {el}
                    </div>
                ))}
            </ul>
          </div>
          <div className="row column">
            <h1 className="title">Description</h1>
            <p className="activity_description">{description}</p>
          </div>
          <div className="row column">
            <h1 className="title">Attach</h1>
            <ul className="attachment_list">
                {files && files.map(el => (
                    <li className="attachment_list-item">
                        <div className="attachment_list-item_header">
                            <p className="attachment_list-item_header-name">{el.name}</p>
                            <div className="attachment_list-item_header-download"></div>
                        </div>
                            <img src={el.url} alt="attachment" />
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityPopUp;
