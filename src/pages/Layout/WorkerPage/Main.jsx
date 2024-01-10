import React, { useState, useRef, useEffect } from "react";
// import WorkerList from "../../../components/WorkerList/WorkerList";
// import WorkerTable from "../../../components/WorkerTable/workerTable";
// import HorizontalCalendar from "../../../components/Calendar/calendar";
// import List from "../../../components/AdaptiveList/list";

import * as XLSX from "xlsx";

import UserTable from "../../../components/WorkerTable/workerTable";
import ReactBigCalendar from "../../../components/BigCalendar/ReactBigCalendar";

import AmountStat from "../../../components/AmountStat/AmountStat";
import LineGraph from "../../../components/LineChart/LineGraph";
import { Chart } from "react-chartjs-2";
import BarChart from "../../../components/Modules/BankComponents/BarChart";

import CloseIcon from "../../../assets/img/Close.svg";

import ExportIcon from "../../../assets/img/ExportWorker.svg";
import EditIcon from "../../../assets/img/EditWorker.svg";
import TaskIcon from "../../../assets/img/taskWorker.svg";
import MessengerIcon from "../../../assets/img/MessengerWorker.svg";

import AddIcon from "../../../assets/img/NavigationIcons/Add.svg";

import DataTable from "./WorkerTable";
import SelectTableComponent from "../../../components/WorkerTable/workerTable";

import AddWorker from "./AddWorker";
import ImageList from "./ImageList";

import axios from "axios";

import Calendar from "../../../components/CalendarPage";

// import LayoutFlow from "../../../components/NotificationGen/FlowWorkers";

import ActivityPopUp from "../../../components/ActivityPanel";

import "./style.css";
import LayoutFlow from "../../../components/NotificationGen/FlowWorkers";
import { useDispatch, useSelector } from "react-redux";
import {
  createWorker,
  getDepartmentsBytCompany,
  getAllStructureByCompany,
  RemoveTag,
} from "../../../actions/user";
import { addWorker, clearWorker } from "../../../reducers/workerReducer";
import EditWorker from "./EditWorker";
import DayPickerInput from "../../../components/InputDayPicker";
import { DayPicker } from "react-day-picker";
import TagSelector from "../../../components/Tags";
import WorkerListCheck from "../../../components/WorkerListCheck";
import MultipleEdit from "./MultipleEdit";

import TagShortcut from "../../../components/TagComponents/TagShortcut";
import SearchIcon from "../../../assets/img/Search.svg";
import TagScreen from "../../../components/TagComponents/TagScreen";
import WeeklyDownloadsChart from "../../../components/SmallLineChart";
import generateNotification from "../../../utils/generateNotification";

const WorkerPage = () => {
  const [isActivity, setIsActivity] = useState(false);
  const tagsList = useSelector(state => state.tags);

  function handleActivity() {
    setIsActivity(!isActivity);
  }

  const hugeTitleStyle = {
    fontSize: "12px",
    lineHeight: "12px",
  };

  const hugeCurrentStyle = {
    fontSize: "20px",
    lineHeight: "24px",
    fontWeight: "600",
  };

  const hugePercentStyle = {
    fontSize: "14px",
    lineHeight: "20px",
  };

  const chartData = [3000, 1200, 3100, 4200].map((el, index) => [
    index + 1,
    el,
  ]);
  const props = {
    data: chartData,
    smoothing: 1,
    strokeWidth: 5,
  };

  const [hoveredSegment, setHoveredSegment] = useState(null);
  const chartRef = useRef();

  const dataProp = [
    {
      size: 32,
      color: "#f7d202",
      name: "Completed",
    },
    {
      size: 68,
      color: "#2EBDAB",
      name: "In work",
    },
  ];

  const state = {
    datasets: [
      {
        data: dataProp.map((el) => el.size),
        backgroundColor: dataProp.map((el) => el.color),
        offset: 0,
        borderRadius: 20,
        borderWidth: 8,
        hoverBorderWidth: 4,
        borderColor: "#F9FAFB",
        hoverBorderColor: "#F9FAFB",
      },
    ],
  };

  const options = {
    cutout: 62,
    responsive: true,
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
    onHover: (event, activeElements) => {
      const chartContainer = document.querySelector(".chart_container");
      if (activeElements && activeElements.length > 0) {
        setHoveredSegment(activeElements[0].index);
        chartContainer.children[0].style.cursor = "pointer";
      } else {
        setHoveredSegment(null);
        chartContainer.children[0].style.cursor = "default";
      }
    },
  };

  const segmentBackgroundColors = state.datasets[0].backgroundColor.map(
    (color, index) => {
      if (hoveredSegment === null || hoveredSegment === index) {
        return color;
      } else {
        return `${color}80`;
      }
    }
  );

  const stateWithBackgroundColors = {
    ...state,
    datasets: [
      {
        ...state.datasets[0],
        backgroundColor: segmentBackgroundColors,
      },
    ],
  };

  const DataMockDiag = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 12 },
    { name: "Apr", value: 32 },
    { name: "May", value: 10 },
    { name: "Jun", value: 72 },
    { name: "Jul", value: 43 },
    { name: "Aug", value: 22 },
    { name: "Sep", value: 12 },
    { name: "Oct", value: 43 },
    { name: "Nov", value: 22 },
    { name: "Dec", value: 54 },
  ];

  const [search, setSearch] = useState("");

  function handleChange(e) {
    setSearch(e.target.value);
  }

  const [isSelected, setIsSelected] = useState(false);
  const [selectedList, setSelectedList] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [userName, setUserName] = useState("");

  function handleChangeAdding() {
    setIsAdding(!isAdding);
    console.log(isAdding);
    if (isAdding) {
      setPreview(null);
    }
  }

  function handleSelectWorkerTable(selectedArg) {
    // console.log(selectedArg.length)

    if (selectedArg && selectedArg.length) {
      setIsSelected(true);

      setSelectedList(selectedArg);
    } else {
      setIsSelected(false);
    }
  }

  async function handleDeleteItem(id) {
    if (selectedList.length === 1) {
      setIsSelected(false);
      setSelectedList([]);
    }

    if (selectedList.length > 1) {
      setSelectedList(selectedList.map((el) => el !== id));
    }
  }

  const workerList = useSelector((state) => state.workers);

  const [isTree, setIsTree] = useState(false);
  const [isHuge, setIsHuge] = useState(false);

  const [structure, setStructure] = useState([]);

  async function handleToggleTree(company_id, name, surname) {
    if (!isTree) {
      const id = company_id;
      try {
        const data = await getAllStructureByCompany(id);

        setUserName(name + " " + surname);
        setStructure(data);
        setIsTree(!isTree);
        setIsHuge(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const [isTreeSearchable, setIsTreeSearchable] = useState(false);

  async function handleShowRowCompanyTree(){

    const company_id = workerList.filter(el => el.position === "CEO")[0].company_id
    if (!isTreeSearchable) {
      const id = company_id;
      try {
        const data = await getAllStructureByCompany(id);

        setStructure(data);
        setIsTree(false);
        setIsHuge(false);
        setIsTreeSearchable(!isTreeSearchable);
      } catch (error) {
        console.log(error);
      }
    }
  }

  function handleTreeSize() {
    setIsHuge(!isHuge);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    const getWorkers = async () => {
      try {
        const url = `https://memetricsserver.onrender.comapi/workers/list`;
        const { data: res } = await axios.get(url, {
          params: { id: localStorage.getItem("id") },
        });

        dispatch(clearWorker());

        for (let item of res) {
          dispatch(addWorker(item));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getWorkers()

      const interval = setInterval(() => {
        getWorkers();
      }, 15000);
  
      return () => {
        clearInterval(interval);
      };
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const [selected, setSelected] = useState(new Date());


  async function handleEditPanel(data) {
    if (!editData) {
      setEditData(data);
    } else {
      setEditData(null);
      setPreview(null);
    }
    setIsEditing(!isEditing);
  }

  const [multipleEdit, setIsMultipleEdit] = useState(false);

  const handleClickExport = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    // Преобразование к массиву байтов
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Создание Blob
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Создание ссылки для скачивания
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.xlsx";

    // Добавление ссылки на страницу и имитация клика
    document.body.appendChild(a);
    a.click();

    // Удаление ссылки
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const [preview, setPreview] = useState(null);

  function handleSelectDataFromTree(data) {
    setPreview(data);
  }

  function handleSelectPreview(data) {
    setIsTree(false);
    // setPreview(null)
  }

  const [isActivityDetail, setIsActivityDetail] = useState(false);

  function handleShowActivity(e) {
    setIsActivityDetail(!isActivityDetail);
  }

  const [isTagHuge, setIsTagHuge] = useState(false);

  function handleTagHuge(){
    setIsTagHuge(!isTagHuge)
  }

  const default_efficiency = 9542;
  const default_activity = 112;

  const [efficiencyValue, setEffeciencyValue] = useState(default_efficiency);
  const [activityValue, setActivityValue] = useState(default_activity);

  function handleHoverTrigger(value, key){

    console.log(value)

    switch(key){
      case 'efficiency':
        setEffeciencyValue(value);
        break;
      case 'activity':
        setActivityValue(value)
        break;
      default:
        alert('Ivalid key property')
    }
  }

  function handleBlurTrigger(key){
    switch(key){
      case 'efficiency':
        setEffeciencyValue(default_efficiency);
        break;
      case 'activity':
        setActivityValue(default_activity)
        break;
      default:
        alert('Ivalid key property')
    }
  }


  function handleTagDelete(title){
    try{
      dispatch(RemoveTag(title))
    }catch(error){
      dispatch(generateNotification('Action', 'top center', error.message, 'Error'))
    }
  }

  return (
    <div className="worker_container">
      {/* <WorkerTable/>
            <WorkerList/> */}

      {/* <HorizontalCalendar/> */}
      {/* <HorizontalCalendar/> */}
      {/* <List/> */}

      {/* <UserTable/> */}

      <div className="worker_container__main">
        <div className="worker_container__main_left">
          <div className="worker_container__main_left_segment">
            <h1 className="worker_container_title">Analystic</h1>
            <div className="worker_container__main_left_segment_graphs">
              <div className="worker_container__main_left_segment_graphs_element">
                <div className="company_row--element">
                  <AmountStat
                    titleValue={"Employee efficiency::"}
                    currentValue={efficiencyValue}
                    prevValue={10050}
                    prefixValue={""}
                    imageHeight={20}
                    imageWidth={20}
                    titleStyle={hugeTitleStyle}
                    currentStyle={hugeCurrentStyle}
                    percentStyle={hugePercentStyle}
                  />
                  <div className="company_row--element_grap">
                    {/* <LineGraph
                      {...props}
                      accent={"#DB371F"}
                      fillBelow={"#ffb5b5"}
                    /> */}
                    <WeeklyDownloadsChart id={'efficiency'} isMenu={false} handleHover={handleHoverTrigger} handleBlur={handleBlurTrigger}/>
                  </div>
                </div>
                <div className="company_row--element">
                  <AmountStat
                    titleValue={"Average activity::"}
                    currentValue={activityValue}
                    prevValue={10050}
                    prefixValue={""}
                    imageHeight={20}
                    imageWidth={20}
                    titleStyle={hugeTitleStyle}
                    currentStyle={hugeCurrentStyle}
                    percentStyle={hugePercentStyle}
                  />
                  <div className="company_row--element_grap">
                    
                    <WeeklyDownloadsChart id={'activity'} isMenu={false} handleHover={handleHoverTrigger} handleBlur={handleBlurTrigger}/>
                  </div>
                </div>
              </div>
              {/* <div className="worker_container__main_left_segment_graphs_element">
                <div className="doughnut-chart">
                  <h1 className="bank_body-header">Tasks</h1>
                  <div
                    className="chart_container"
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <Chart
                      ref={chartRef}
                      data={stateWithBackgroundColors}
                      options={options}
                      type={"doughnut"}
                      style={{ width: "180px", height: "180px" }}
                    />
                    <div className="disk_analytics">
                      {hoveredSegment === null ? (
                        <div className="disk_analytics--unhover">
                          <span className="disk_analytics_work">In work</span>
                          <p className="disk_analytics_title">45</p>
                          <h2 className="disk_analytics_space">Total 431</h2>
                        </div>
                      ) : (
                        <div className="disk_analytics--hover">
                          <p className="disk_analytics_all">
                            {dataProp[hoveredSegment].name}
                          </p>
                          <h2 className="disk_analytics_space">
                            {dataProp[hoveredSegment].name === "Spending"
                              ? "-50 млн"
                              : "+180 млн"}
                          </h2>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="chart_inspect">
                    <ul>
                      {dataProp.map((el, index) => (
                        <li>
                          <span
                            className="dot_container"
                            style={{ backgroundColor: el.color }}
                          >
                            <span
                              className="dot_inner"
                              style={{ backgroundColor: el.color }}
                            ></span>
                          </span>
                          <p>{el.name}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div> */}
              <div className="worker_container__main_left_segment_graphs_element">
                <BarChart data={DataMockDiag} />
              </div>
            </div>
          </div>
          <div className="worker_container__main_left_segment">
            <h1 className="worker_container_title">Workers</h1>
            <div className="worker_table_header">
              <div className="navigation_search_input">
                <div className="navigation_search_input-loop"></div>
                <input
                  type="text"
                  id="search_field"
                  placeholder="Search"
                  value={search}
                  onChange={handleChange}
                />
                {search.length > 0 && (
                  <img
                    className="clear"
                    alt="iconCross"
                    src={CloseIcon}
                    onClick={() => setSearch("")}
                  ></img>
                )}
              </div>
              <button
                className="worker_table_header__btn"
                onClick={() => handleClickExport(workerList)}
              >
                <img src={ExportIcon} alt="export icon" />
                Export
              </button>

              {isSelected && (
                <button
                  className="worker_table_header__btn"
                  onClick={() => setIsMultipleEdit(!multipleEdit)}
                >
                  <img src={EditIcon} alt="export icon" />
                  Edit
                </button>
              )}

              {isSelected && (
                <button className="worker_table_header__btn">
                  <img src={MessengerIcon} alt="export icon" />
                  Send message
                </button>
              )}

              {isSelected && (
                <button className="worker_table_header__btn">
                  <img src={TaskIcon} alt="export icon" />
                  Create task
                </button>
              )}

              {!isSelected && (
                <button
                  onClick={handleShowRowCompanyTree}
                  className="worker_table_header__btn"
                >
                  <img src={SearchIcon} alt="tree icon" />
                </button>
              )}

              {!isSelected && (
                <button
                  onClick={handleChangeAdding}
                  className="worker_table_header__btn blue"
                >
                  <img src={AddIcon} alt="export icon" />
                  Add worker
                </button>
              )}
            </div>
            <SelectTableComponent
              onSelect={(selectedArg) => handleSelectWorkerTable(selectedArg)}
              data={workerList}
              handleEdit={handleEditPanel}
              searchQuery={search}
            />
          </div>
        </div>
        <div className="worker_container__main_right">
          <h1 className="worker_container_title">
            Activities
            <button onClick={handleActivity}>All activities</button>
          </h1>
          <ul className="worker_container_activities-list">
            <li className="worker_container_activities-list__item">
              <div className="worker_container_activities-list__item_title">
                <img
                  src="https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg"
                  alt="activity_userIcon"
                />
                <h2 className="worker_container_activities-list__item_title-name">
                  Vidhi Shah
                </h2>
                <p className="worker_container_activities-list__item_title-shortTheme">
                  updated their status
                </p>
                <div className="worker_container_activities-list__item_title-dot"></div>
                <span className="worker_container_activities-list__item_title-time">
                  1d
                </span>
              </div>

              <div className="worker_container_activities-list__item_body">
                <h2 className="worker_container_activities-list__item_body-title">
                  Available for freelance opportunities
                </h2>
                <p className="worker_container_activities-list__item_body-project">
                  Kids Pod at Nike House of Innovation Paris
                </p>
                <p className="worker_container_activities-list__item_body-description">
                  A long term interactive installation for the Nike House of
                  Innovation Paris encouraging kids to use their bodies as a
                  controller
                </p>
                <ImageList
                  imageLinks={[
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                  ]}
                />
              </div>
            </li>
            <li className="worker_container_activities-list__item">
              <div className="worker_container_activities-list__item_title">
                <img
                  src="https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg"
                  alt="activity_userIcon"
                />
                <h2 className="worker_container_activities-list__item_title-name">
                  Vidhi Shah
                </h2>
                <p className="worker_container_activities-list__item_title-shortTheme">
                  updated their status
                </p>
                <div className="worker_container_activities-list__item_title-dot"></div>
                <span className="worker_container_activities-list__item_title-time">
                  1d
                </span>
              </div>

              <div className="worker_container_activities-list__item_body">
                <h2 className="worker_container_activities-list__item_body-title">
                  Available for freelance opportunities
                </h2>
                <p className="worker_container_activities-list__item_body-project">
                  Kids Pod at Nike House of Innovation Paris
                </p>
                <p className="worker_container_activities-list__item_body-description">
                  A long term interactive installation for the Nike House of
                  Innovation Paris encouraging kids to use their bodies as a
                  controller
                </p>
                <ImageList
                  imageLinks={[
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                  ]}
                />
              </div>
            </li>
            <li className="worker_container_activities-list__item">
              <div className="worker_container_activities-list__item_title">
                <img
                  src="https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg"
                  alt="activity_userIcon"
                />
                <h2 className="worker_container_activities-list__item_title-name">
                  Vidhi Shah
                </h2>
                <p className="worker_container_activities-list__item_title-shortTheme">
                  updated their status
                </p>
                <div className="worker_container_activities-list__item_title-dot"></div>
                <span className="worker_container_activities-list__item_title-time">
                  1d
                </span>
              </div>

              <div className="worker_container_activities-list__item_body">
                <h2 className="worker_container_activities-list__item_body-title">
                  Available for freelance opportunities
                </h2>
                <p className="worker_container_activities-list__item_body-project">
                  Kids Pod at Nike House of Innovation Paris
                </p>
              </div>
            </li>

            <li className="worker_container_activities-list__item">
              <div className="worker_container_activities-list__item_title">
                <img
                  src="https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg"
                  alt="activity_userIcon"
                />
                <h2 className="worker_container_activities-list__item_title-name">
                  Vidhi Shah
                </h2>
                <p className="worker_container_activities-list__item_title-shortTheme">
                  updated their status
                </p>
                <div className="worker_container_activities-list__item_title-dot"></div>
                <span className="worker_container_activities-list__item_title-time">
                  1d
                </span>
              </div>

              <div className="worker_container_activities-list__item_body">
                <h2 className="worker_container_activities-list__item_body-title">
                  Available for freelance opportunities
                </h2>
                <p className="worker_container_activities-list__item_body-project">
                  Kids Pod at Nike House of Innovation Paris
                </p>
                <p className="worker_container_activities-list__item_body-description">
                  A long term interactive installation for the Nike House of
                  Innovation Paris encouraging kids to use their bodies as a
                  controller
                </p>
                <ImageList
                  imageLinks={[
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                  ]}
                />
              </div>
            </li>

            <li className="worker_container_activities-list__item">
              <div className="worker_container_activities-list__item_title">
                <img
                  src="https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg"
                  alt="activity_userIcon"
                />
                <h2 className="worker_container_activities-list__item_title-name">
                  Vidhi Shah
                </h2>
                <p className="worker_container_activities-list__item_title-shortTheme">
                  updated their status
                </p>
                <div className="worker_container_activities-list__item_title-dot"></div>
                <span className="worker_container_activities-list__item_title-time">
                  1d
                </span>
              </div>

              <div className="worker_container_activities-list__item_body">
                <h2 className="worker_container_activities-list__item_body-title">
                  Available for freelance opportunities
                </h2>
                <p className="worker_container_activities-list__item_body-project">
                  Kids Pod at Nike House of Innovation Paris
                </p>
                <p className="worker_container_activities-list__item_body-description">
                  A long term interactive installation for the Nike House of
                  Innovation Paris encouraging kids to use their bodies as a
                  controller
                </p>
                <ImageList
                  imageLinks={[
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                  ]}
                />
              </div>
            </li>
            <li className="worker_container_activities-list__item">
              <div className="worker_container_activities-list__item_title">
                <img
                  src="https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg"
                  alt="activity_userIcon"
                />
                <h2 className="worker_container_activities-list__item_title-name">
                  Vidhi Shah
                </h2>
                <p className="worker_container_activities-list__item_title-shortTheme">
                  updated their status
                </p>
                <div className="worker_container_activities-list__item_title-dot"></div>
                <span className="worker_container_activities-list__item_title-time">
                  1d
                </span>
              </div>

              <div className="worker_container_activities-list__item_body">
                <h2 className="worker_container_activities-list__item_body-title">
                  Available for freelance opportunities
                </h2>
                <p className="worker_container_activities-list__item_body-project">
                  Kids Pod at Nike House of Innovation Paris
                </p>
                <p className="worker_container_activities-list__item_body-description">
                  A long term interactive installation for the Nike House of
                  Innovation Paris encouraging kids to use their bodies as a
                  controller
                </p>
                <ImageList
                  imageLinks={[
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                  ]}
                />
              </div>
            </li>
            <li className="worker_container_activities-list__item">
              <div className="worker_container_activities-list__item_title">
                <img
                  src="https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg"
                  alt="activity_userIcon"
                />
                <h2 className="worker_container_activities-list__item_title-name">
                  Vidhi Shah
                </h2>
                <p className="worker_container_activities-list__item_title-shortTheme">
                  updated their status
                </p>
                <div className="worker_container_activities-list__item_title-dot"></div>
                <span className="worker_container_activities-list__item_title-time">
                  1d
                </span>
              </div>

              <div className="worker_container_activities-list__item_body">
                <h2 className="worker_container_activities-list__item_body-title">
                  Available for freelance opportunities
                </h2>
                <p className="worker_container_activities-list__item_body-project">
                  Kids Pod at Nike House of Innovation Paris
                </p>
                <p className="worker_container_activities-list__item_body-description">
                  A long term interactive installation for the Nike House of
                  Innovation Paris encouraging kids to use their bodies as a
                  controller
                </p>
                <ImageList
                  imageLinks={[
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                    "https://www.dell.com/wp-uploads/2022/11/Human-like-Avatar-3-640x480.jpg",
                  ]}
                />
              </div>
            </li>
          </ul>
        </div>
      </div>

      {isActivity && (
        <div className="worker_container__activity">
          <button
            className="worker_container__activity_btn"
            onClick={handleActivity}
          ></button>
          <div className="worker_container__activity_left">
            <h1 className="worker_container__activity_title">Calendar</h1>
            <DayPicker
              mode="single"
              selected={selected}
              // onSelect={(e) => {
              //   console.log(e)
              //   setSelected(e);
              // }}
              captionLayout="dropdown-buttons"
              fromYear={1970}
              toYear={2024}
              showOutsideDays
              ISOWeek
              onMonthChange={(e) => console.log(e.getMonth())}
            />
            {/* <TagSelector /> */}
            <TagShortcut tags={tagsList} onDelete={handleTagDelete} onSettings={handleTagHuge}/>
            <WorkerListCheck
              items={workerList.filter((el) => el.position !== "CEO")}
            />
            {isTagHuge && <TagScreen onClose={handleTagHuge} onDelete={() => {}} onSave={() => {}} tags={tagsList}/>}
          </div>
          <div className="worker_container__activity_right">
            <h1 className="worker_container__activity_title">Activities</h1>
            <div className="worker_container__activity_calendar">
              <ReactBigCalendar handleShowActivity={handleShowActivity}/>
              {isActivityDetail && (
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
                      name: "file.png",
                      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJwik-PbAfAymIYs5jmP1n4yWOBMGTmOx-Kg&usqp=CAU",
                    },
                    {
                      name: "file_2.png",
                      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJwik-PbAfAymIYs5jmP1n4yWOBMGTmOx-Kg&usqp=CAU",
                    },
                    {
                      name: "file_3.png",
                      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJwik-PbAfAymIYs5jmP1n4yWOBMGTmOx-Kg&usqp=CAU",
                    },
                  ]}
                  handleClose={handleShowActivity}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <AddWorker
          handleTree={handleToggleTree}
          handleClose={handleChangeAdding}
          department={preview?.department?.name}
          manager={preview?.manager?.name}
        />
      )}
      {isEditing && (
        <EditWorker
          handleTree={handleToggleTree}
          handleClose={handleEditPanel}
          data={editData}
          department={preview?.department?.name}
          manager={preview?.manager?.name}
        />
      )}
      {multipleEdit && (
        <MultipleEdit
          data={selectedList.map((el) => ({
            name: el.name,
            surname: el.surname,
            image: el.image,
            position: el.position,
            id: el.id,
          }))}
          handleClose={() => setIsMultipleEdit(!multipleEdit)}
          handleRemove={(id) => handleDeleteItem(id)}
        />
      )}
      {isTree && (
        <div className="tree_container">
          <div className={`tree_body ${isHuge ? "huge" : ""}`}>
            <div className="tree_body__header">
              <h2 className="tree_body__header-title">
                Choose department
                <span>Manager will be choosen automaticly</span>
                {userName.trim() && (
                  <p className="worker_name_preview">{userName}</p>
                )}
              </h2>
              <div className="tree_body__header-control">
                <button
                  onClick={handleTreeSize}
                  className={`tree_body__header-control_btn screen ${
                    isHuge ? "huge" : ""
                  }`}
                ></button>
                <button
                  onClick={() => {
                    setStructure([]);
                    setIsTree(false);
                    setIsHuge(false);
                  }}
                  className="tree_body__header-control_btn close"
                ></button>
              </div>
            </div>
            <div className="tree_body__preview">
              <div className="inputs_row">
                <div className="company_add_search__input">
                  <label
                    htmlFor="worker_phone"
                    className="company_add_search__label"
                  >
                    Department
                    <input
                      type="text"
                      placeholder="Department..."
                      id="worker_phone"
                      name="phone"
                      onChange={() => {}}
                      required
                      value={preview?.department?.name}
                      className="company_add_search__input"
                      readOnly
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
                    Department
                    <input
                      type="text"
                      placeholder="Manager..."
                      id="worker_phone"
                      name="phone"
                      onChange={() => {}}
                      required
                      value={preview?.manager?.name}
                      className="company_add_search__input"
                      readOnly
                    />
                  </label>
                </div>
              </div>
              <button
                className="tree_save"
                style={{
                  opacity: !preview ? ".75" : "1",
                  pointerEvents: !preview ? "none" : "auto",
                  userSelect: "none",
                }}
                onClick={handleSelectPreview}
              >
                Save
              </button>
            </div>
            <LayoutFlow
              data={structure}
              handleSelectDataFromTree={handleSelectDataFromTree}
              userName={userName}
              isSelectable={!isTreeSearchable}
            />
          </div>
        </div>
      )}


      {isTreeSearchable && (
        <div className="tree_container">
          <div className={`tree_body ${isHuge ? "huge" : ""}`}>
            <div className="tree_body__header">
              <h2 className="tree_body__header-title">
                Choose department
              </h2>
              <div className="tree_body__header-control">
                <button
                  onClick={handleTreeSize}
                  className={`tree_body__header-control_btn screen ${
                    isHuge ? "huge" : ""
                  }`}
                ></button>
                <button
                  onClick={() => {
                    setIsTreeSearchable(false);
                    setIsHuge(false);
                  }}
                  className="tree_body__header-control_btn close"
                ></button>
              </div>
            </div>
            <LayoutFlow
              data={structure}
              isSelectable={!isTreeSearchable}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkerPage;
