import React, { useState } from "react";
import DayPickerInput from "../../InputDayPicker";

import './style.css'

function PostPoneComponent({
  start,
  end,
  stages = [],
  handleClose,
  handleSave,
}) {
  const [eventData, setEventData] = useState({
    start,
    end,
    stages: stages.map((el) => ({ start: el.start, end: el.end })),
  });

  return (
    <div className="inspect_event__container">
      <div className="add_worker__container-form_title">
        <h1 className="add_worker__container-form_title-text">Add worker</h1>
        <div
          className="add_worker__container-form_title-close"
          onClick={handleClose}
        ></div>
      </div>
      <div className="add_worker__container-form_body">
      <h1>Change common deadline</h1>
        <div className="inputs_row">
          <div className="company_add_search__input">
            <label htmlFor="start" className="company_add_search__label">
              Start date
              <DayPickerInput
                onDaySelect={(key, value) => {
                  setEventData({ ...eventData, [key]: value });
                }}
                placeholder={"Choose start date"}
                key={"start"}
                id={"start"}
                value={eventData?.start}
              />
            </label>
          </div>
          <div className="company_add_search__input">
            <label htmlFor="start" className="company_add_search__label">
              End date
              <DayPickerInput
                onDaySelect={(key, value) => {
                  setEventData({ ...eventData, [key]: value });
                }}
                placeholder={"Choose end date"}
                key={"end"}
                id={"end"}
                value={eventData?.start}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="company_add__controls">
        <button
          className="company_add__controls--btn"
          type="button"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="company_add__controls--btn btn_blue"
          onClick={() => {}}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default PostPoneComponent;
