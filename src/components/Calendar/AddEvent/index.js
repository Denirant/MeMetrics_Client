import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import DropdownInput from "../../InputDropdown";

import DayPickerInput from "../../InputDayPicker";

import PlusIcon from "../../../assets/img/NavigationIcons/Add.svg";
import TabPanel from "../StageTabs";
import { useParams } from "react-router-dom";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { clearWorker, addWorker } from "../../../reducers/workerReducer";

import SelectMembers from "./SelectNameMemebers";
import { createTask } from "../../../actions/user";
import SelectTags from "./SelectTagsElements";

import { useDropzone } from "react-dropzone";

import FileTypes from "../../../utils/types";
import All from "../../../assets/img/filesIcons/all.svg";
import Image from "../../../assets/img/filesIcons/jpg.svg";
import Link from "../../../assets/img/filesIcons/link.svg";
import Video from "../../../assets/img/filesIcons/mov.svg";
import Audio from "../../../assets/img/filesIcons/mp3.svg";
import PDF from "../../../assets/img/filesIcons/pdf.svg";
import PPT from "../../../assets/img/filesIcons/ppt.svg";
import Text from "../../../assets/img/filesIcons/txt.svg";
import Docs from "../../../assets/img/filesIcons/word.svg";
import Excel from "../../../assets/img/filesIcons/xlsx.svg";
import Rar from "../../../assets/img/filesIcons/zip.svg";
import Folder from "../../../assets/img/closeFolder.svg";

function getFileIcon(type) {
  if (type === "dir") {
    return Folder;
  }

  switch (
    Object.keys(FileTypes).find((key) => FileTypes[key].includes(type)) ||
    ""
  ) {
    case "image":
      return Image;
    case "document":
      return Docs;
    case "table":
      return Excel;
    case "pdf":
      return PDF;
    case "text":
      return Text;
    case "rar":
      return Rar;
    case "audio":
      return Audio;
    case "video":
      return Video;
    case "webPage":
      return All;
    case "presentation":
      return PPT;
    case "database":
    case "iso":
    case "vector":
    case "torrent":
    case "scan":
    case "ebook":
    case "photoshop":
      return All;
    default:
      return All;
  }
}

function AddEventComponent({ handleClose, onAdd }) {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    members: [],
    startDay: "",
    endDay: "",
    tags: [],
    files: [],
  });

  const tags = useSelector((state) => state.tags);

  const tabsRef = useRef(null);

  const [isStage, setIsStage] = useState(false);

  const [suggetions, setSuggetions] = useState([]);
  const [members, setMembers] = useState([]);

  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    async function getCompanyMembers(id) {
      try {
        const url = `http://localhost:8080/api/workers/list`;
        const { data: res } = await axios.get(url, {
          params: { id: localStorage.getItem("id") },
        });

        dispatch(clearWorker());

        for (let item of res) {
          dispatch(addWorker(item));
        }

        setSuggetions(res.filter((el) => el.position !== "CEO"));
      } catch (error) {
        console.log(error);
      }
    }

    getCompanyMembers(params.id);
  }, []);

  function handleChangeMembers(arr) {
    setEventData({ ...eventData, members: arr });
  }

  function handleChangeTags(arr) {
    setEventData({ ...eventData, tags: arr });
  }

  async function handleCreate() {
    const tabsData = isStage
      ? tabsRef.current
          .data()
          .filter((item) => Object.values(item).every((value) => value !== ""))
      : [];

    await dispatch(createTask(eventData, tabsData, params.id));

    handleClose();
    await onAdd();
  }

  // DND files

  const handleDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      file,
    }));

    setEventData((prevData) => ({
      ...prevData,
      files: [...prevData.files, ...newFiles],
    }));
  };

  const handleRemoveFile = (id) => {
    setEventData((prevData) => ({
      ...prevData,
      files: prevData.files.filter((file) => file.id !== id),
    }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
  });

  return (
    <div className="event_addition_wrapper">
      <div className="event_addition_container">
        <div>
          <div className="main">
            <h1 className="event_addition_container__title">
              Create Timeline Task
            </h1>
            {console.log(suggetions)}
            <div className="delete_btn" onClick={() => handleClose()}></div>
            <div className="event_addition_container__common">
              <div className="inputs_row">
                <div className="company_add_search__input">
                  <label
                    htmlFor="inn_value"
                    className="company_add_search__label"
                  >
                    Task name
                    <input
                      type="text"
                      id="title"
                      className="company_add_search__input"
                      placeholder="Enter event name"
                      value={eventData?.name}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          [e.target.id]: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="inputs_row">
                <label
                  htmlFor="description"
                  className="company_add_search__label"
                >
                  Description
                  <textarea
                    id="description"
                    className="company_add_search__input"
                    value={eventData?.description}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        [e.target.id]: e.target.value,
                      })
                    }
                    placeholder="Enter description"
                  />
                </label>
              </div>
              <div className="inputs_row">
                <SelectMembers
                  onChange={handleChangeMembers}
                  data={suggetions}
                />
              </div>

              <div className="inputs_row">
                <div className="company_add_search__input">
                  <label
                    htmlFor="worker_birthday"
                    className="company_add_search__label"
                  >
                    Start date
                    <DayPickerInput
                      onDaySelect={(key, value) => {
                        setEventData({ ...eventData, [key]: value });
                      }}
                      placeholder={"Choose date"}
                      key={"startDay"}
                      id={"startDay"}
                      value={eventData?.startDay}
                    />
                  </label>
                </div>
                <div className="company_add_search__input">
                  <label
                    htmlFor="worker_birthday"
                    className="company_add_search__label"
                  >
                    End date
                    <DayPickerInput
                      onDaySelect={(key, value) => {
                        setEventData({ ...eventData, [key]: value });
                      }}
                      placeholder={"Choose date"}
                      key={"endDay"}
                      id={"endDay"}
                      value={eventData?.endDay}
                    />
                  </label>
                </div>
              </div>
              <div className="inputs_row">
                <SelectTags data={tags} onChange={handleChangeTags} />
              </div>
              <div className="event_dnd__field" {...getRootProps()}>
                <input {...getInputProps()} />
                Drag & Drop or Choose file to <span>Upload</span>
              </div>
              <div className="file-list">
                {eventData.files.map((file) => (
                  <div key={file.id} className="file-item">
                    {console.log()}
                    <img
                      width={24}
                      height={24}
                      src={getFileIcon(file.name.split(".").pop())}
                      alt="file_type"
                    />
                    <span>{file.name}</span>
                    <button onClick={() => handleRemoveFile(file.id)}></button>
                  </div>
                ))}
              </div>
              <p className="file_attached_counter">
                {eventData.files.length} file(s) attached
              </p>
            </div>
            <div className="event_addition_container__routing">
              <div className="notification_switch-container">
                <p>
                  Add routing
                  <span className="notification_date">
                    Task reminder will be sent to task assignee and task creator
                  </span>
                </p>
                <div className="notification_toggle">
                  <input
                    type="checkbox"
                    id="actions"
                    checked={isStage}
                    onClick={() => {
                      setIsStage(!isStage);
                    }}
                  />
                  <label for="actions">Toggle</label>
                </div>
              </div>
            </div>
          </div>
          <div className="routing">
            <TabPanel
              members={eventData?.members}
              ref={tabsRef}
              isStage={isStage}
            />
          </div>
        </div>
        <div className="add_worker__container-form_controls">
          <button
            className="company_add__controls--btn btn_blue"
            onClick={() => handleCreate()}
          >
            Create
          </button>
          <button
            className="company_add__controls--btn"
            type="button"
            onClick={() => handleClose()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEventComponent;
