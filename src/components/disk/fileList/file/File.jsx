import React, { useState } from "react";
import "./file.css";
import dirLogo from "../../../../assets/img/dir.svg";
import wordLogo from "../../../../assets/img/word.svg";
import dottedMenu from "../../../../assets/img/Navigation.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFile,
  downloadFile,
  getFiles,
  moveFile,
} from "../../../../actions/file";
import moment from "moment";
import sizeFormat from "../../../../utils/sizeFormat";
import Dropdown from "../../../dropdownComponent/dropdown";

import DownloadIcon from "../../../../assets/img/DropDown/Download.svg";
import ShareIcon from "../../../../assets/img/DropDown/Share.svg";
import MoveIcon from "../../../../assets/img/DropDown/Move.svg";
import TrashIcon from "../../../../assets/img/DropDown/Trash.svg";
import {
  addSelectedFile,
  removeSelectedFile,
  setClickedFile,
} from "../../../../reducers/fileReducer";
import ReactDOM from "react-dom";
import domtoimage from "dom-to-image";

import Drag from "../../../../assets/img/oneDrag.svg";
import MoveFile from "../../../FilesMove/TreeSelect";
import showCustomConfirm from "../../../../utils/showCustomConfirm";
import showErrorAlert from "../../../../utils/showCustomError";

import FileTypes from "../../../../utils/types";
import All from "../../../../assets/img/filesIcons/all.svg";
import Image from "../../../../assets/img/filesIcons/jpg.svg";
import Link from "../../../../assets/img/filesIcons/link.svg";
import Video from "../../../../assets/img/filesIcons/mov.svg";
import Audio from "../../../../assets/img/filesIcons/mp3.svg";
import PDF from "../../../../assets/img/filesIcons/pdf.svg";
import PPT from "../../../../assets/img/filesIcons/ppt.svg";
import Text from "../../../../assets/img/filesIcons/txt.svg";
import Docs from "../../../../assets/img/filesIcons/word.svg";
import Excel from "../../../../assets/img/filesIcons/xlsx.svg";
import Rar from "../../../../assets/img/filesIcons/zip.svg";
import generateNotification from "../../../../utils/generateNotification";

const File = ({ file, handleSelectFile }) => {
  const dispatch = useDispatch();
  const fileView = useSelector((state) => state.files.view);

  const selected = useSelector((state) => state.files.selected);
  const selectedFiles = useSelector((state) => state.files.selectedFiles);
  const structure = useSelector((state) => state.files.structure);
  const currentPath = useSelector((state) => state.files.currentPath);
  const clickedFile = useSelector((state) => state.files.clickedFile);

  const handleDragStart = (event) => {
    event.persist();

    handleNameMouseLeave();
    if (!selected) {
      event.dataTransfer.setData("text/plain", file._id);
      dispatch(addSelectedFile(file));
    } else {
      event.dataTransfer.setData(
        "text/plain",
        selectedFiles.map((el) => el._id).join(",")
      );
    }

    const dragEl = document.getElementById("drag");

    console.log("Start dragging element: " + dragEl);

    event.dataTransfer.setDragImage(dragEl, 70, 24);
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    if (!selected) {
      dispatch(removeSelectedFile(file));
    }
  };

  function fileClickHandler(e) {
    const dropdown__container = e.target.closest(".dropdown__container");

    if (!dropdown__container) {
      dispatch(setClickedFile(file._id));
    }
  }

  function handleOpen(e, file) {
    const dropdown__container = e.target.closest(".dropdown__container");

    if (!dropdown__container) {
        const fileExtensions = ["jpg", "png", "bmp", "gif", "tif", "jpeg"];

        if (fileExtensions.includes(file.type)) {
            handleSelectFile(`http://localhost:8080/files/${file.user}/${file.path}`)
        } else {
          dispatch(generateNotification('Action', 'top center', 'Cant open file with this type', 'Error'))
        }    
    }
  }

  function downloadClickHandler(e) {
    e.stopPropagation();
    dispatch(downloadFile(file));
  }

  const files = useSelector((state) => state.files.files);

  function deleteClickHandler(e) {
    e.stopPropagation();
    dispatch(deleteFile(file, files));
  }

  function addPseudoElement(target, text) {
    const pseudoElement = document.createElement("div");
    pseudoElement.className = "pseudo-element add-animation";
    pseudoElement.textContent = text;

    target.appendChild(pseudoElement);
  }

  let timerId;

  function handleNameMouseEnter(e, file) {
    handleNameMouseLeave();

    e.persist();
    e.preventDefault();

    timerId = setTimeout(() => {
      addPseudoElement(e.target, file.name);
    }, 1000);
  }

  function handleNameMouseLeave(e, file) {
    if (timerId) {
      clearTimeout(timerId);
      const element = document.querySelector(".pseudo-element");
      if (element) {
        element.classList.remove("add-animation");
        element.classList.add("delete-animation");
        setTimeout(() => {
          element.remove();
        }, 400);
      }
    }
  }

  function handleFileSelect(e) {
    const dropdown__container = e.target.closest(".dropdown__container");
    handleNameMouseLeave();

    if (!dropdown__container) {
      document.getElementById(`file_selector_${file.path}`).checked =
        !document.getElementById(`file_selector_${file.path}`).checked;
      handleChangeFileSelect(
        e,
        document.getElementById(`file_selector_${file.path}`)
      );
    }
  }

  function findElementWithPath(data, path) {
    for (const item of data) {
      if (item?.file?.path === path) {
        return item.file._id;
      }

      if (item.files && item.files.length > 0) {
        const found = findElementWithPath(item.files, path);
        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  function moveClickHandler(e) {
    e.stopPropagation();

    const container = document.createElement("div");
    container.classList.add("move_selecter-handle");

    document.querySelector(".app").appendChild(container);

    ReactDOM.render(
      <MoveFile
        prevPath={file.path.split("/").slice(0, -1).join("/")}
        data={structure}
        handleCloseForm={() => container.remove()}
        handleSelectPath={(path) => {
          if (path !== currentPath) {
            const idParent = findElementWithPath(structure, path);
            dispatch(moveFile(idParent, file._id));
          } else {
            showErrorAlert("Folder already contains this file");
          }

          container.remove();
        }}
      />,
      container
    );
  }

  function handleChangeFileSelect(e, target) {
    e.preventDefault();
    if (target.checked) {
      dispatch(addSelectedFile(file));
    } else {
      dispatch(removeSelectedFile(file));
    }
  }

  const isDraggable = !selected
    ? true
    : selectedFiles.includes(file)
    ? true
    : false;

  function getFileIcon(type) {
    switch (
      Object.keys(FileTypes).find((key) =>
        FileTypes[key].includes(type.toLowerCase())
      ) ||
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

  function formatFileName(fileName) {
    const MAX_LENGTH = 9;

    if (fileName.split(".").slice(0, -1).join(".").length > MAX_LENGTH) {
      const nameWithoutExtension = fileName.split(".").slice(0, -1).join(".");
      return (
        nameWithoutExtension.slice(0, 9) + "..." + fileName.split(".").pop()
      );
    }

    return fileName;
  }

  if (fileView === "plate") {
    return (
      <div
        className={`file-plate ${
          clickedFile === file._id ? "file-plate__active" : ""
        }`}
        onClick={(e) => (selected ? handleFileSelect(e) : fileClickHandler(e))}
        onDoubleClick={(e) => (selected ? () => {} : handleOpen(e, file))}
        draggable={isDraggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="file-plate__control">
          <img
            src={getFileIcon(file.type)}
            alt=""
            className="file-plate__img"
          />
          {!selected && (
            <Dropdown
              imageUrl={dottedMenu}
              dropContent={[
                {
                  icon: ShareIcon,
                  text: "Empty",
                  handler: () => alert(1),
                },
                {
                  icon: DownloadIcon,
                  text: "Download",
                  handler: (e) => downloadClickHandler(e),
                },
                {
                  icon: MoveIcon,
                  text: "Move",
                  handler: (e) => moveClickHandler(e),
                },
                {
                  icon: TrashIcon,
                  text: "Delete",
                  handler: (e) => deleteClickHandler(e),
                },
              ]}
              width={"24px"}
              height={"24px"}
              dropClass={"file-menu"}
            />
          )}
        </div>
        <div className="file_bottom">
          <div className="file_bottom_info">
            <div
              className="file-plate__name"
              onMouseEnter={(e) => handleNameMouseEnter(e, file)}
              onMouseLeave={(e) => handleNameMouseLeave(e, file)}
              data-type={file.type}
            >
              {formatFileName(file.name)}
            </div>
            <div className="file-plate__date">
              {moment(file.date).format("DD.MM.YYYY")}
            </div>
          </div>
          {selected && (
            <div className="file_select">
              <input
                type="checkbox"
                name="file_selector"
                id={`file_selector_${file.path}`}
                checked={selectedFiles.includes(file)}
                onChange={(e) => handleChangeFileSelect(e, e.target)}
              />
              <label htmlFor={`file_selector_${file.path}`}></label>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default File;
