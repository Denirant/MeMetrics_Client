import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./style.css";
import AddTabIcon from "../../../assets/img/NavigationIcons/Add.svg";
import DayPickerInput from "../../InputDayPicker";
import SelectMembers from "../AddEvent/SelectNameMemebers";

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


const TabPanel = forwardRef(({isStage, members}, ref) => {
  const [tabs, setTabs] = useState([
    { title: "Stage 1", members: [], description: "", startDay: "", endDay: "", files: [] },
  ]);
  const [activeTab, setActiveTab] = useState(0);

  console.log(members)

  const handleAddTab = () => {
    setTabs([
      ...tabs,
      {
        title: `Stage ${tabs.length + 1}`,
        members: [],
        description: "",
        startDay: "",
        endDay: "",
        files: [],
      },
    ]);
    setActiveTab(tabs.length);
  };

  const handleTabSwitch = (index) => {
    setActiveTab(index);
  };

  const handleTabChange = (index, field, value) => {
    const updatedTabs = [...tabs];
    updatedTabs[index] = { ...updatedTabs[index], [field]: value };
    setTabs(updatedTabs);
  };

  // DND files

  const handleDrop = (acceptedFiles, index = activeTab) => {

    console.log(acceptedFiles)

    const newFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      file,
    }));

    console.log(newFiles)

    const updatedTabs = [...tabs];
    updatedTabs[index].files.push(...newFiles);
    setTabs(updatedTabs);
  };

  const handleRemoveFile = (id, index = activeTab) => {
    const updatedTabs = [...tabs];
    updatedTabs[index].files = updatedTabs[index].files.filter(file => file.id !== id);
    setTabs(updatedTabs);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (e) => {
      handleDrop(e)
    },
    multiple: true,
  });



  useImperativeHandle(ref, () => {
    return {
      data() {
        return tabs;
      }
    };
  }, [tabs]);


  return (
    <div className={`tab-panel ${isStage ? 'active' : ''}`}>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`tab-title ${index === activeTab ? "active" : ""}`}
            onClick={() => handleTabSwitch(index)}
          >
            {tab.title}
          </div>
        ))}
        <button className="add-tab-button" onClick={handleAddTab}>
          <img src={AddTabIcon} alt="" />
        </button>
      </div>
      <div className="form-container">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`form ${index === activeTab ? "active" : ""}`}
          >
            <div className="inputs_row">
              <div className="company_add_search__input">
                <SelectMembers data={members} onChange={(arr) => handleTabChange(index, "members", arr.map(el => el.id))}/>
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
                  value={tabs[index].description}
                  onChange={(e) =>
                    handleTabChange(index, "description", e.target.value)
                  }
                  placeholder="Enter description"
                />
              </label>
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
                      handleTabChange(index, key, value);
                    }}
                    placeholder={"Choose date"}
                    key={"startDay"}
                    id={"startDay"}
                    value={tabs[index]?.startDay}
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
                      handleTabChange(index, key, value);
                    }}
                    placeholder={"Choose date"}
                    key={"endDay"}
                    id={"endDay"}
                    value={tabs[index]?.endDay}
                  />
                </label>
              </div>
            </div>
            <div className="event_dnd__field" {...getRootProps()}>
              <input {...getInputProps()} />
              Drag & Drop or Choose file to <span>Upload</span>
            </div>
            <div className="file-list">
              {tab.files.map((file) => (
                <div key={file.id} className="file-item">
                  <img
                    width={24}
                    height={24}
                    src={getFileIcon(file.name?.split(".").pop())}
                    alt="file_type"
                  />
                  <span>{file.name}</span>
                  <button onClick={() => handleRemoveFile(file.id, index)}></button>
                </div>
              ))}
            </div>
            <p className="file_attached_counter">
              {tab.files.length} file(s) attached
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TabPanel;
