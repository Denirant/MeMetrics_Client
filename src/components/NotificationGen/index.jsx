import React, { useState } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotification,
  removeNotification,
} from "../../reducers/notificationsReducer";
import { v4 as uuidv4 } from "uuid";

import { HexColorPicker } from "react-colorful";

import DNDList from "../dndList";
import BasicFlow from "../ReactFlowRender/Flow";
import V2Example from "../ReactFlowRender/xarrow";
// import "../../../node_modules/antd/lib/";

import Datepicker from "../DatePicker/DatePicker";

import ReactBigCalendar from "../BigCalendar/ReactBigCalendar";

import DayPickerSimple from "../DayPicker";

import TreeChart from "../TreeComponent";

import LayoutFlow from "./FlowWorkers";

import ActivityPopUp from "../ActivityPanel";

const initialData = {
  name: "😐",
  children: [
    {
      name: "🙂",
      children: [
        {
          name: "😀",
        },
        {
          name: "😁",
        },
        {
          name: "🤣",
        },
      ],
    },
    {
      name: "😔",
    },
  ],
};

function GridWithClick() {
  const notifications = useSelector((state) => state.notification);
  const dispatch = useDispatch();

  const [activePosition, setActivePosition] = useState("top center");
  const [selectedOption, setSelectedOption] = useState("Action");
  const [selectedType, setSelectedType] = useState("Success");

  const [dataTree, setDataTree] = useState(initialData);

  const handleItemClick = (row, col) => {
    setActivePosition(`${getGridPosition(row, col)} ${getGridAlignment(col)}`);
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSelectType = (e) => {
    setSelectedType(e.target.value);
  };

  const getGridPosition = (row, col) => {
    if (row === 1) {
      return "top";
    } else if (row === 2) {
      return "center";
    } else {
      return "bottom";
    }
  };

  const getGridAlignment = (col) => {
    if (col === 1) {
      return "left";
    } else if (col === 2) {
      return "center";
    } else {
      return "right";
    }
  };

  const createNotification = (type) => {
    const id = uuidv4();
    const notification = {
      id,
      position: activePosition,
    };

    switch (type) {
      case "Action":
        if (["top center", "bottom center"].includes(activePosition)) {
          notification.text = selectedOption;
          notification.type = "Action";
          notification.status = selectedType;
        } else {
          alert("Invalid notification type for selected position");
          return; // Не добавляем недопустимое уведомление
        }
        break;
      case "Informative":
        notification.text = selectedOption;
        notification.date = new Date().toLocaleDateString();
        notification.type = "Informative";
        break;
      case "Interactive":
        if (["top right", "bottom right"].includes(activePosition)) {
          notification.image =
            "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg";
          notification.title = "Notification Title";
          notification.text = "Notification Text";
          notification.handleCancel = () => {
            alert("Cancel handler!");
          };
          notification.handleOpen = () => {
            alert("Open handler!");
          };
          notification.type = "Interactive";
        } else {
          alert("Invalid notification type for selected position");
          return; // Не добавляем недопустимое уведомление
        }
        break;
      default:
        break;
    }

    dispatch(addNotification(notification));

    setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 5000);

  };

  const [color, setColor] = useState("aabbcc");

  const [isColorSelect, setIsColorSelect] = useState(false);

  const data = [
    { id: "1", label: "List Item 1" },
    { id: "2", label: "List Item 2" },
    { id: "3", label: "List Item 3" },
    { id: "4", label: "List Item 4" },
    { id: "5", label: "List Item 5" },
    { id: "6", label: "List Item 6" },
  ];

  const [isActivity, setIsActivity] = useState(false);

  return (
    <div className="generate-container">
      <div className="generate-notification">
        <div className="generate-control">
          <div className="grid-container">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => {
              const row = Math.ceil((index + 1) / 3);
              const col = (index + 1) % 3 === 0 ? 3 : (index + 1) % 3;

              const clickable = [2, 3, 8, 9].includes(index + 1);

              return (
                <div
                  key={index}
                  className={`grid-item ${
                    activePosition ===
                    `${getGridPosition(row, col)} ${getGridAlignment(col)}`
                      ? "active"
                      : ""
                  } ${clickable ? "clickable" : ""}`}
                  onClick={() => clickable && handleItemClick(row, col)}
                >
                  {`Item ${item}`}
                </div>
              );
            })}
          </div>
          <div className="generate-right">
            <select value={selectedOption} onChange={handleSelectChange}>
              <option value="Action">Action</option>
              {/* <option value="Informative">Informative</option> */}
              <option value="Interactive">Interactive</option>
            </select>

            {selectedOption === "Action" && (
              <select value={selectedType} onChange={handleSelectType}>
                <option value="Success">Success</option>
                {/* <option value="Informative">Informative</option> */}
                <option value="Warning">Warning</option>
                <option value="Error">Error</option>
              </select>
            )}
            <div className="output">
              <p>Active Position: {activePosition}</p>
              <p>Selected Option: {selectedOption}</p>
            </div>
          </div>
        </div>
        <button
          className="generate_button"
          onClick={() => createNotification(selectedOption)}
        >
          Create Notification
        </button>
      </div>
      <div className="colorPickerComponents">
        <label htmlFor="colorpicker_id" className="colorPickerComponents_label">
          <div
            className="color_icon"
            onClick={() => setIsColorSelect(!isColorSelect)}
            style={{ backgroundColor: "#" + color }}
          ></div>
          <p>#</p>
          <input
            type="text"
            id="colorpicker_id"
            value={color.slice(1)}
            onChange={(e) => setColor(e.target)}
          />
        </label>
        <div className={`color_container ${isColorSelect ? "show" : ""}`}>
          <HexColorPicker
            color={"#" + color}
            onChange={(e) => setColor(e.slice(1))}
          />
        </div>
      </div>
      <div>
        <DNDList dataList={data} />
      </div>
      {/* <div style={{width: '900px', height: '600px', border: '1px solid black', overflow: 'hidden'}}>
          <BasicFlow/>
          <V2Example/>
        </div> */}
      <div>
        {/* <Datepicker/> */}
        {/* <DayPickerSimple handleDaySelect={(valueArg) => console.log(valueArg) }/> */}
        {/* <TreeChart data={data} />
        <button onClick={() => setDataTree(initialData.children[0])}>
          Update data
        </button> */}

        <LayoutFlow />
      </div>

      <button onClick={() => setIsActivity(!isActivity)}>Activity</button>

      {isActivity && (
        <ActivityPopUp
          title={"Create Shot Dribbble"}
          date={"13.09.2023, 8:00"}
          name={"Donald"}
          surname={"Mask"}
          image={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWDyPczPbekZb6NVln-vVXH6ya4xJLvU7vUQ6ptTyHeQ&s"
          }
          tags={["All", "Dev", "UX/UI"]}
          description={
            "Make dribbble shots for studio portfolio needs and your own portfolio."
          }
          files={[
            {
              name: 'file.png',
              url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJwik-PbAfAymIYs5jmP1n4yWOBMGTmOx-Kg&usqp=CAU'
            },
            {
              name: 'file_2.png',
              url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJwik-PbAfAymIYs5jmP1n4yWOBMGTmOx-Kg&usqp=CAU'
            },
            {
              name: 'file_3.png',
              url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJwik-PbAfAymIYs5jmP1n4yWOBMGTmOx-Kg&usqp=CAU'
            }
          ]}
          handleClose={() => setIsActivity(!isActivity)}
        />
      )}
    </div>
  );
}

export default GridWithClick;
