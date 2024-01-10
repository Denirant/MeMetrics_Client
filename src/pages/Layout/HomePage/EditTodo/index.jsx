import React, { useState } from "react";
import DayPickerInput from "../../../../components/InputDayPicker";

import { convertDateFromString } from "../../../../utils/date";
import { editTodoApi } from "../../../../actions/todo";
import { editTask } from "../../../../reducers/todoSlice";
import { useDispatch } from "react-redux";

function TodoEdit({ id, title, start, end, handleClose }) {
  const [todoInfo, setTodoInfo] = useState({
    id: id,
    title: title,
    start: start,
    end: end,
  });

  const dispatch = useDispatch()

  function handleDataChang1e(e) {
    setTodoInfo({ ...todoInfo, [e.target.id]: e.target.value });
  }

  function handleSave() {

    let startPar, endPar;

    if(todoInfo.start !== start){
        startPar = convertDateFromString(todoInfo.start)
    }else{
        startPar = new Date(todoInfo.start)
    }

    if(todoInfo.end !== end){
        endPar = convertDateFromString(todoInfo.end)
    }else{
        endPar = new Date(todoInfo.end)
    }

    editTodoApi(
        todoInfo.id,
        todoInfo.title,
        startPar,
        endPar
    )

    dispatch(editTask(todoInfo.id,
        todoInfo.title,
        startPar,
        endPar
    ))

    handleClose()
    
  }

  return (
    <div className="todo_wrapper">
      <div className="todo_container">
        <div className="todo_header">
          <h1>Edit todo</h1>
          <div className="todo_close" onClick={handleClose}></div>
        </div>
        <div className="todo_body">
          <div className="inputs_row">
            <div className="company_add_search__input">
              <label
                htmlFor="worker_name"
                className="company_add_search__label"
              >
                Event title
                <input
                  type="text"
                  id="title"
                  className="company_add_search__input"
                  onChange={handleDataChang1e}
                  value={todoInfo?.title}
                  placeholder="Enter event title..."
                />
              </label>
            </div>
          </div>
          <div className="inputs_row">
            <div className="company_add_search__input">
              <label
                htmlFor="worker_birthday"
                className="company_add_search__label"
              >
                Start event
                <DayPickerInput
                  onDaySelect={(key, value) => {
                    setTodoInfo({ ...todoInfo, [key]: value });
                  }}
                  selectedDay={todoInfo?.start}
                  placeholder={"Choose start date"}
                  key={"start"}
                  id={"start"}
                  value={todoInfo?.end}
                />
              </label>
            </div>
            <div className="company_add_search__input">
              <label
                htmlFor="worker_birthday"
                className="company_add_search__label"
              >
                End event
                <DayPickerInput
                  onDaySelect={(key, value) => {
                    setTodoInfo({ ...todoInfo, [key]: value });
                  }}
                  selectedDay={todoInfo?.start}
                  placeholder={"Choose end date"}
                  key={"end"}
                  id={"end"}
                  value={todoInfo?.end}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="todo_control">
          <button className="todo_btn border" onClick={handleClose}>
            Cancel
          </button>
          <button className="todo_btn blue" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoEdit;
