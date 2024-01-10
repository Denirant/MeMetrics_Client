import React from "react";
import "./style.css";

function MultipleEdit({ data, handleClose, handleRemove }) {
  return (
    <div className="multiple_wrapper">
      <div className="multiple_container">
        <div className="multiple_container-header">
          <h1 className="multiple_container-header_title">Edit</h1>
          <div className="multiple_container-header_close" onClick={handleClose}></div>
        </div>
        <div className="multiple_container-body">
          {data &&
            data.map((user, index) => (
              <div key={'multiple_delete_' + index} className="inputs_row">
                <div className="company_add_search__input list">
                  <label
                    htmlFor="worker_phone"
                    className="company_add_search__label"
                  >
                    <img src={'https://memetricsserver.onrender.com' + user.image} alt="icon worker" width={40} height={40} />
                    <h1 className="worker_header">
                        {user.name} {user.surname}
                      <span className="worker_position">{user.position}</span>
                    </h1>
                    <div className="worker_close_list" onClick={(e) => {
                      e.preventDefault()
                      console.log(user.id)
                      handleRemove(user.id)
                    }}></div>
                  </label>
                </div>
              </div>
            ))}
          <div className="inputs_row">
            <div className="company_add_search__input">
              <label
                htmlFor="worker_phone"
                className="company_add_search__label"
              >
                Company
                <input
                  type="text"
                  id="worker_phone"
                  className="company_add_search__input"
                  onChange={() => {}}
                  value={"Sony"}
                  placeholder="Enter phone number"
                  readOnly={true}
                />
              </label>
            </div>
            <div className="company_add_search__input">
              <label
                htmlFor="worker_email"
                className="company_add_search__label"
              >
                Department
                <input
                  type="text"
                  id="worker_email"
                  className="company_add_search__input"
                  onChange={() => {}}
                  value={"IT"}
                  placeholder="Enter email"
                  readOnly={true}
                />
              </label>
            </div>
          </div>
          <div className="inputs_row">
            <div className="company_add_search__input">
              <label
                htmlFor="worker_phone"
                className="company_add_search__label"
              >
                Manager
                <input
                  type="text"
                  id="worker_phone"
                  className="company_add_search__input"
                  onChange={() => {}}
                  value={"Ivanov Ivan"}
                  placeholder="Enter phone number"
                  readOnly={true}
                />
              </label>
            </div>
          </div>
        </div>
        <div
          className="add_worker__container-form_controls"
          style={{ marginTop: "30px" }}
        >
          <button className="company_add__controls--btn btn_blue">Save</button>
          <button
            className="company_add__controls--btn"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default MultipleEdit;
