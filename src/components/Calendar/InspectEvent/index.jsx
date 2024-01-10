import React, { useState } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";

import CompleteIcon from "../../../assets/img/TaskComplete.svg";
import ProgressIcon from "../../../assets/img/NotComplete.svg";

import linkIcon from "../../../assets/img/linkIcon.svg";
import { convertDateToString } from "../../../utils/date";

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
import { downloadFile } from "../../../actions/file";
import { finishEvent } from "../../../actions/user";
import generateNotification from "../../../utils/generateNotification";

import PostPoneComponent from "../PostponeEvent";
import { finishTask } from "../../../reducers/eventReducer";

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

function getContrastColor(hexColor) {
  // Преобразование цвета в RGB формат
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Расчет контрастности по формуле
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "black" : "white";
}

function EventInspect({
  title,
  start,
  end,
  description,
  checkes,
  stages,
  handleClose,
  tags,
  people,
  files,
  id,
  owner,
  short = false
}) {

  const dispatch = useDispatch();

  function percentAmount(array) {
    const totalCount = array.length,
      trueCount = array.filter((check) => check === true).length;

    return Math.floor((trueCount / totalCount) * 100);
  }

  function selectStatusClass(array, time) {
    const percent = percentAmount(array);

    if (new Date(time).getTime() < new Date().getTime()) {
      return "#DB371F";
    } else if (percent < 100) {
      return "#EDA80D";
    } else {
      return "#2EBDAB";
    }
  }

  function selectStatusText(array, time) {
    const percent = percentAmount(array);

    if (new Date(time).getTime() < new Date().getTime()) {
      return "Overdue";
    } else if (percent < 100) {
      return "In progress";
    } else {
      return "Done";
    }
  }

  const [isPostpone, setIsPostpone] = useState(false);

  function handlePostpone() {
    setIsPostpone(!isPostpone);
  }

  function handleDownload(name, _id, type) {
    dispatch(downloadFile({ name, type, _id }));
  }

  const TableComponent = ({ data }) => {
    return (
      <table className="inspect_table">
        <thead>
          <tr>
            <th></th>
            <th>Stage</th>
            <th>Task name</th>
            <th>Status</th>
            <th>Owner</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="inspect_check">
                <img
                  src={
                    Math.floor(
                      (item.points.filter(Boolean).length /
                        item.points.length) *
                        100
                    ) === 100
                      ? CompleteIcon
                      : ProgressIcon
                  }
                  alt="status_icon"
                />
              </td>
              <td className="inspect_id">{index + 1}</td>
              <td className="inspect_name">
                <h2>{item.name}</h2>
                <div>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "4px",
                      background:
                        selectStatusClass(item.points, item.end) + "33",
                      borderRadius: "20px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: `${percentAmount(item.points)}%`,
                        background: selectStatusClass(item.points, item.end),
                      }}
                    />
                  </div>
                  <p>{percentAmount(item.points)}%</p>
                </div>
              </td>
              <td className="inspect_status">
                <div className="status_header">
                  <div
                    className="round"
                    style={{
                      backgroundColor: selectStatusClass(item.points, item.end),
                    }}
                  ></div>
                  <p className="status">
                    {selectStatusText(item.points, item.end)}
                  </p>
                </div>
                <div className="deadline_date">
                  {convertDateToString(item.start).replace("-", ".")} -{" "}
                  {convertDateToString(item.end).replace("-", ".")}
                </div>
              </td>
              <td className="inspect_owner">
                <img
                  width={24}
                  height={24}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                  src={`https://memetricsserver.onrender.com${people[0].image}`}
                  alt="user_icon"
                />
                {people[0].name}
              </td>
              <td className="inspect_link">
                <a
                  href={"www.google.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={linkIcon} alt="link_icon" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="inspect_event__wrapper">
      {!isPostpone ? (
        <div className="inspect_event__container">
          <div className="inspect_header">
            <h1>
              {title}
              <span>
                {new Date().toLocaleString("ru", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </span>
            </h1>
            <div className="inspect_close" onClick={() => handleClose()}></div>
          </div>
          <div className="inspect_content">
            <div className="inspect_content__item">
              <h2 className="inspect_content__item-title">Owner</h2>
              <p className="inspect_content__item-text">
                <img
                  src={`https://memetricsserver.onrender.com${owner.image}`}
                  alt="icon_header"
                  width={24}
                  height={24}
                  style={{
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
                {owner.name}
              </p>
            </div>
            <div className="inspect_content__item">
              <h2 className="inspect_content__item-title">Tags</h2>
              <ul className="inspect_content__item-list">
                {tags.map((el, index) => (
                  <li
                    key={`li_inspect_${index}`}
                    className="inspect_content__item-list-tag"
                    style={{
                      backgroundColor: el.color,
                      color: getContrastColor(el.color),
                    }}
                  >
                    {el.title}
                  </li>
                ))}
              </ul>
            </div>
            <div className="inspect_content__item">
              <h2 className="inspect_content__item-title">Status</h2>
              <div className="inspect_content__item-status">
                <div className="status_header">
                  <div
                    className="round"
                    style={{
                      backgroundColor: selectStatusClass(
                        stages
                          .reduce((acc, item) => {
                            acc.push(...item.points);
                            return acc;
                          }, [])
                          .flat(),
                        end
                      ),
                    }}
                  ></div>
                  <p className="status">
                    {selectStatusText(
                      stages
                        .reduce((acc, item) => {
                          acc.push(...item.points);
                          return acc;
                        }, [])
                        .flat(),
                      end
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="inspect_content__item">
              <h2 className="inspect_content__item-title">Deadline</h2>
              <p className="inspect_content__item-date">
                {start} - {end}
              </p>
            </div>
            <div className="inspect_content__item">
              <h2 className="inspect_content__item-title">Description</h2>
              <p className="inspect_content__item-description">{description}</p>
            </div>
            {files.length > 0 && (
              <div className="inspect_content__item column">
                <h2 className="inspect_content__item-title">Attach</h2>
                <div className="inspect_content__item-file-list">
                  {files.map((file) => (
                    <div key={file.fileId} className="file-item">
                      <img
                        width={24}
                        height={24}
                        src={getFileIcon(file.type)}
                        alt="file_type"
                      />
                      <span>{file.name}</span>
                      <button
                        onClick={() =>
                          handleDownload(file.name, file.fileId, file.type)
                        }
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
                <p className="inspect_content__item-file_attached_counter">
                  {files.length} file(s) attached
                </p>
              </div>
            )}
          </div>
          {stages.length > 0 && (
            <div className="inspect-stages">
              <h1 className="inspect-stages__title">Stages</h1>
              <TableComponent data={stages} />
            </div>
          )}
          {!stages.length && (
            <div className="inspect-status">
              <h2 className="inspect_content__item-title">Status</h2>
              <p>
                <b>Info:</b> You do not have stages, so the task completion
                score is calculated from the completed task items and the
                sending of the "Finish" status
                {/* <span>Status: {checkes.filter(el => el).length}/{checkes.length}</span> */}
              </p>
              <div className="progress-status">
                <div className="inspect-bar">
                  <div
                    className="bar-progress"
                    style={{
                      width: `${
                        (checkes.filter((el) => el.complete).length / checkes.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {checkes.filter((el) => el.complete).length}/{checkes.length}
                </span>
              </div>
            </div>
          )}
          <div className="inspect-action">
            <h2>Task actions:</h2>
            <div className="inspect-action_list">
              {!short && <button
                className="inspect_btn insert green"
                onClick={async () => {
                  try {
                    dispatch(finishEvent(id));
                    dispatch(finishTask(id))
                    dispatch(
                      generateNotification(
                        "Action",
                        "top center",
                        "The event is successfully completed, all employees will receive notifications about the completion of work",
                        "Success"
                      )
                    );
                
                    handleClose();
                  } catch (error) {
                    console.error("Error finishing event:", error);
                    // Handle error, show an error notification, etc.
                  }
                }}
              >
                Finish
              </button>}
              {!short && <button
                className="inspect_btn border orange"
                onClick={handlePostpone}
              >
                Postpone
              </button>}
              <button
                className="inspect_btn border red"
                onClick={() => handleClose()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <PostPoneComponent handleClose={handlePostpone} />
      )}
    </div>
  );
}

export default EventInspect;
