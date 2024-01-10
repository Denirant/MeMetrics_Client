import axios from "axios";
import { setUser } from "../reducers/userReducer";
import { API_URL } from "../config";

import showErrorAlert from "../utils/showCustomError";

import { setCookie, getCookie, deleteCookie } from "../utils/cookies";
import { removeWorker } from "../reducers/workerReducer";
import { addEvent, removeEvent, finishTask } from "../reducers/eventReducer";
import { addTag, removeTag } from "../reducers/tagReducer";
import { createDir, uploadFile } from "./file";
import generateNotification from "../utils/generateNotification";
import { convertDateFromString } from "../utils/date";

class DataCheckError extends Error {
  constructor(message) {
    super(message);
    this.name = "DataCheckError";
  }
}

export const registration = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}api/auth/registration`, {
      email,
      password,
    });
  } catch (e) {
    alert(e.response.data.message);
  }
};

export const updateUserPassword = async (passwordArg) => {
  try {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    const res = await axios.post(
      `${API_URL}api/users/updatePassword?id=${id}`,
      { newPass: passwordArg },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const uploadProfilePhoto = async (file) => {
  try {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    const formData = new FormData();
    formData.append("photo", file);

    await axios.post(`${API_URL}api/users/updateAvatar?id=${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(file);

    return;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getUser = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      const { data: res } = await axios.get(
        `${API_URL}api/users/data?id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getDepartmentsBytCompany = async (id) => {
  try {
    // alert(id)

    const token = localStorage.getItem("token");

    const { data: res } = await axios.get(
      `${API_URL}api/companies/departments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          id: id,
        },
      }
    );

    // alert(res)

    return res.array;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const getListOfCompanies = async () => {
  try {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    const { data: res } = await axios.get(`${API_URL}api/companies/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: id,
      },
    });

    console.log(res.data);

    return res.data;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const createWorker = async (
  name,
  surname,
  gender,
  birthday,
  company_id,
  department_id,
  menager_id,
  position,
  phone,
  email,
  image,
  department
) => {
  try {
    const missingArguments = [];

    if (!name) missingArguments.push("name");
    if (!surname) missingArguments.push("surname");
    if (!gender) missingArguments.push("gender");
    if (!birthday) missingArguments.push("birthday");
    if (!company_id) missingArguments.push("company_id");
    if (!department_id) missingArguments.push("department_id");
    if (!menager_id) missingArguments.push("manager_id");
    if (!position) missingArguments.push("position");
    if (!phone) missingArguments.push("phone");
    if (!email) missingArguments.push("email");
    if (!image) missingArguments.push("image");

    if (missingArguments.length > 0) {
      throw new DataCheckError(
        `Missing arguments: ${missingArguments.join(", ")}`
      );
    }

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("gender", gender);
    formData.append("birthday", birthday);
    formData.append("company_id", company_id);
    formData.append("department_id", department_id);
    formData.append("menager_id", menager_id);
    formData.append("position", position);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("file", image);
    formData.append("department", department);

    console.log(formData.values());

    const { data: res } = await axios.post(`${API_URL}api/workers/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(res);

    return res;
  } catch (e) {
    if (e.name === "DataCheckError") {
      throw new DataCheckError(e.message);
    }

    throw new Error(e.message);
  }
};

export const EditWorkerFunc = async (
  name,
  surname,
  gender,
  birthday,
  company_id,
  department_id,
  menager_id,
  position,
  phone,
  email,
  image,
  department,
  id
) => {
  try {
    const token = localStorage.getItem("token");
    // const id = localStorage.getItem("id");

    // console.log(typeof image)

    // if(typeof image)

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("gender", gender);
    formData.append("birthday", birthday);
    formData.append("company_id", company_id);
    formData.append("department_id", department_id);
    formData.append("menager_id", menager_id);
    formData.append("position", position);
    formData.append("phone", phone);

    if (typeof image !== "string") {
      formData.append("file", image);
    }

    for (let item of formData.entries()) {
      console.log(item);
    }

    const { data: res } = await axios.post(
      `${API_URL}api/workers/update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const EditCompanyFunc = async (name, description, color, image, id) => {
  try {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("color", "#" + color);

    if (image) {
      formData.append("file", image);
    }

    const token = localStorage.getItem("token");
    const { data: res } = await axios.post(
      `${API_URL}api/companies/update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(res);

    return res;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const deleteWorker = (id) => {
  return async (dispatch) => {
    try {
      await axios.post(`${API_URL}api/workers/delete`, {
        id,
      });
      dispatch(removeWorker(id));
      console.log("Worker was deleted!");
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const createTask = (body, stages, id) => {
  return async (dispatch) => {
    try {

      console.log(stages);

    const filesIds = [];
    const stagesFilesIds = [];

    if (body.files.length > 0) {
      const rootFolder = await dispatch(createDir(null, body.title + '-events-' + (new Date().toLocaleDateString('en-GB').replace(/\//g, '.'))));

      // Добавляем файлы для body
      await Promise.all(body.files.map(async (file, index) => {
        if (file.file instanceof File) { // Проверка на валидный File объект
          const fileResult = await dispatch(uploadFile(file.file, rootFolder._id));
          filesIds.push(fileResult._id);
        }
      }));

      // Добавляем файлы для stages
      await Promise.all(stages.map(async (stage, stageIndex) => {
        const stageDir = await dispatch(createDir(rootFolder._id, stage.title));
        stagesFilesIds.push([]);

        await Promise.all(stage.files.map(async (file, fileIndex) => {
          if (file.file instanceof File) { // Проверка на валидный File объект
            const fileStage = await dispatch(uploadFile(file.file, stageDir._id));
            stagesFilesIds[stageIndex].push({fileId: fileStage._id, host: localStorage.getItem("id")});
          }
        }));
      }));

      await dispatch(generateNotification('Action', 'top center', 'All files were uploaded to the host', 'Success'));
    }

    const newFilesIds = filesIds.map(el => ({fileId: el, host: localStorage.getItem("id")}))
      body.files = newFilesIds;

      for(let i = 0; i < stages.length; i++){
        stages[i].files = stagesFilesIds[i];

        stages[i].startDay = convertDateFromString(stages[i].startDay)
        stages[i].endDay = convertDateFromString(stages[i].endDay)
        stages[i].planner = [{title: 'Finish', complete: false}]
      }

      body.members = body.members.map(el => el.id);
      body.tags = body.tags.map(el => ({title: el.title, color: el.color}));

      body.startDay = convertDateFromString(body.startDay)
      body.endDay = convertDateFromString(body.endDay)


      const formData = new FormData();

      // Добавляем остальные данные
      formData.append("body", JSON.stringify(body));
      formData.append("stages", JSON.stringify(stages));

      // Отправляем formData на сервер
      const {data: res} = await axios.post(`${API_URL}api/tasks/add`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res)

      dispatch(addEvent(res))
      dispatch(generateNotification('Action', 'top center', 'Task was created', 'Success'))

    } catch (e) {
      dispatch(generateNotification('Action', 'top center', e.response.data.message, 'Warning'))
    }
  };
};

export const deleteTask = (id) => {
  return async (dispatch) => {
    try {
      await axios.delete(`${API_URL}api/tasks/delete`, {
        data: {
          id
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(removeEvent(id));
      console.log("Event was deleted!");
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const finishEvent = (id) => {
  return async (dispatch) => {
    try {
      await axios.post(`${API_URL}api/tasks/finish`, {id}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log('Finish update')
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const getAllStructureByCompany = async (id) => {
  try {
    const { data: res } = await axios.get(`${API_URL}api/companies/tree`, {
      params: {
        id: id,
      },
    });

    console.log(res);

    return res;
  } catch (e) {
    console.log(e.response.data.message);
  }
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(`${API_URL}api/auth/login`, {
        email,
        password,
      });
      dispatch(setUser(response.data.user));
      localStorage.setItem("token", response.data.token);
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

const checkTokenValidity = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  try {
    const response = await axios.get(`${API_URL}api/users/auth`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.setItem("token", response.data.token);
    console.log("Everything is OK!");
  } catch (e) {
    if (e.response && e.response.status === 401) {
      // alert('Token is no longer valid. Please log in again.');
      await showErrorAlert(
        "Website token is no longer valid. Please log in again.",
        true
      );

      window.location.href = "/";
      localStorage.removeItem("token");
    } else {
      console.error("Auth error:", e);
    }
  }
};

export const auth = () => {
  return async (dispatch) => {
    try {
      await checkTokenValidity();

      dispatch(getTags());
    } catch (error) {
      console.error("Error checking token validity:", error);
    }
  };
};

export const updateAccessToken = async () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${API_URL}api/users/banks/alfa?refresh_token=${getCookie(
          "alfaAccess"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.setItem("alfaAccess", response.data.access_token);
      window.location.href = "/bank";
    } catch (e) {
      alert(e.response.data.message);
    }
  };
};

export const getRefreshToken = async (code, state) => {
  try {
    const response = await axios.get(
      `${API_URL}api/users/banks/alfa?code=${code}&state=${state}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    localStorage.setItem("alfaAccess", response.data.access_token);
    setCookie("alfaRefresh", response.data.refresh_token, 180);
    window.location.href = "/bank";
  } catch (e) {
    alert(e.response.data.message);
  }
};

export const revokeRefreshToken = async () => {
  try {
    const response = await axios.get(
      `${API_URL}api/users/banks/alfa?token=${getCookie("alfaRefresh")}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data.message);
  } catch (e) {
    alert(e.response.data.message);
  }
};

export const getInfoBank = async () => {
  try {
    const response = await axios.get(
      `${API_URL}api/users/banks/alfa/info?token=${localStorage.getItem(
        "alfaAccess"
      )}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
  } catch (e) {
    alert(e.response.data.message);
  }
};

export const paymentInfo = async () => {
  try {
    const response = await axios.get(
      `${API_URL}api/users/banks/alfa/payment?accountNumber=${"40702810102300000001"}&token=${localStorage.getItem(
        "alfaAccess"
      )}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
  } catch (e) {
    alert(e.response.data.message);
  }
};

export const summeryInfo = async () => {
  try {
    const response = await axios.get(
      `${API_URL}api/users/banks/alfa/summery?accountNumber=${"40702810102300000001"}&token=${localStorage.getItem(
        "alfaAccess"
      )}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
  } catch (e) {
    alert(e.response.data.message);
  }
};

// **Tags**

export const AddTag = (title, color) => {
  return async (dispatch) => {
    try {
      console.log(!title);

      if (!title || !color) {
        throw new DataCheckError(
          "Please provide values for all required fields before proceeding!"
        );
      }

      const token = localStorage.getItem("token");
      const { data: res } = await axios.post(
        `${API_URL}api/users/tags`,
        {
          title,
          color,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res);

      await dispatch(addTag(res.newTag));
    } catch (e) {
      if (e.name === "DataCheckError") {
        console.log(e.message);
        throw new DataCheckError(e.message);
      }
      // alert(e.response.data.message);
    }
  };
};

export const RemoveTag = (title) => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);

      await axios.delete(`${API_URL}api/users/tags`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { title },
      });

      await dispatch(removeTag(title));
    } catch (e) {
      // alert(e.response.data.message);
      console.log(e.response.data.message)
    }
  };
};

export const getTags = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");
      const { data: res } = await axios.get(`${API_URL}api/users/tags`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      for (let item of res.tags) {
        await dispatch(addTag(item));
      }
    } catch (e) {
      // alert(e.response.data.message)
      if(e.response.data.message === 'Auth error'){
        console.log('Cant get tags...')
      }
    }
  };
};
