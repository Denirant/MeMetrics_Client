import React, { useState } from "react";
// import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addNotification,
  removeNotification,
} from "../reducers/notificationsReducer";
import { v4 as uuidv4 } from "uuid";

const generateNotification = (
  type,
  activePosition,
  text,
  status,
  cancelHandle = null,
  openHandle = null,
  title = null,
  imageUrl = null
) => {
  return async (dispatch) => {
    try {
      const id = uuidv4();
      const notification = {
        id,
        position: activePosition,
      };

      switch (type) {
        case "Action":
          if (["top center", "bottom center"].includes(activePosition)) {
            notification.text = text;
            notification.type = "Action";
            notification.status = status;
          } else {
            alert("Invalid notification type for selected position");
            return; // Не добавляем недопустимое уведомление
          }
          break;
        case "Informative":
          notification.text = text;
          notification.date = new Date().toLocaleDateString();
          notification.type = "Informative";
          break;
        case "Interactive":
          if (["top right", "bottom right"].includes(activePosition)) {
            notification.image = imageUrl;
            notification.title = title;
            notification.text = text;
            notification.handleCancel = cancelHandle;
            notification.handleOpen = openHandle;
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

        console.log(type + " notification was deleted");
      }, 5000);

      console.log(type + " notification was created...It will be deleted after 5 secs.");
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export default generateNotification;
