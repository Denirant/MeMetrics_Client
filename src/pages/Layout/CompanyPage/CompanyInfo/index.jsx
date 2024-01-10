import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "./index.css";

import HorizontalCalendar from "../../../../components/Calendar/calendar";
import List from "../../../../components/AdaptiveList/list";
import Carousel from "../../../../components/Gallery/gallery";

import { Chart, getElementAtEvent } from "react-chartjs-2";

import { removeCompany } from "../../../../reducers/companyReducer";

import AmountStat from "../../../../components/AmountStat/AmountStat";
import LineGraph from "../../../../components/LineChart/LineGraph";

import BarChart from "../../../../components/Modules/BankComponents/BarChart";

import { API_URL } from "../../../../config";

import Email from "../../../../assets/img/Envelope.svg";
import Phone from "../../../../assets/img/Phone.svg";
import Location from "../../../../assets/img/MapPin.svg";
import { useDispatch } from "react-redux";

import EmployeeTable from "../../../../components/WorkerListCompany";

import { useSelector } from "react-redux";
import { clearWorker, addWorker } from "../../../../reducers/workerReducer";

import AddEventComponent from "../../../../components/Calendar/AddEvent";

import { addEvent, clearEvent } from "../../../../reducers/eventReducer";

import EditCompany from "../EditCompany";

import WeeklyDownloadsChart from "../../../../components/SmallLineChart";
import LineChart from "./lineChart";

const CompanyInfo = () => {
  // const location = useLocation()

  const params = useParams();

  const [company, setCompany] = useState(null);
  // const [employees, setEmployees] = useState([]);
  const employees = useSelector((state) => state.workers);

  console.log(employees);

  const getCompany = async () => {
    try {
      const { data: res } = await axios.get(
        `http://localhost:8080/api/companies/`,
        { params: { id: params.id } }
      );
      setCompany(res.company);
    } catch (error) {
      console.log(error);
    }
  };

  const getWorkers = async () => {
    try {
      const url = `http://localhost:8080/api/workers/list`;
      const { data: res } = await axios.get(url, {
        params: { id: localStorage.getItem("id") },
      });

      dispatch(clearWorker());

      for (let item of res) {
        dispatch(addWorker(item));
      }

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  function handleClose(){
    window.location = '../company'
  }


  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(params.id);

  function handleEdit(){
    setEditId(isEditing ? null : params.id);
    setIsEditing(!isEditing);
    if(isEditing){
      window.location.reload()
    }
  }

  const chartRef = useRef();
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const DataMockDiag = [
    { name: "Mon, 09.09", value: 30 },
    { name: "Tue, 10.09", value: 20 },
    { name: "Wed, 11.09", value: 70 },
    { name: "Thu, 12.09", value: 25 },
    { name: "Fri, 13.09", value: 23 },
    { name: "Sat, 14.09", value: 42 },
    { name: "Sun, 15.09", value: 12 },
  ];

  const eventsData = useSelector(state => state.events);

  


  useEffect(() => {
    getCompany();
      getWorkers();
  }, []);

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

  const data2 = [5400, 8300, 13700, 9500, 12200, 7700, 4500, 10900, 2800];
  const props2 = {
    data: data2,
    smoothing: 0.7,
    strokeWidth: 5,
    hover: true,
  };

  const dataProp = [
    {
      size: 32,
      color: "#0E5FD9",
      name: "Social Media",
    },
    {
      size: 12,
      color: "#FF9500",
      name: "Marketplaces",
    },
    {
      size: 28,
      color: "#22C55E",
      name: "Websites",
    },
    {
      size: 10,
      color: "#EAB308",
      name: "Digital Ads",
    },
    {
      size: 18,
      color: "#EF4444",
      name: "Others",
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
    cutout: 80,
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

  const dispatch = useDispatch();

  async function handleDeleteSingle(idArg = params.id) {
    try {
      const { data: res } = await axios.delete(
        `http://localhost:8080/api/companies/delete/`,
        { params: { userId: localStorage.getItem("id"), companyId: idArg } }
      );

      dispatch(removeCompany(idArg));
      window.location = "/company";
    } catch (e) {
      console.log(e);
    }
  }

  const [activeButton, setActiveButton] = useState("Analytic");

  const handleButtonClick = async (buttonType) => {
    await setActiveButton(buttonType);

    // if(buttonType === 'Timeline'){
    //   await getEvents()
    // }
  };


  const [isAdding, setIsAdding] = useState(false);

  function handleAddEvent(){
    setIsAdding(!isAdding);
  }


  async function handleAddAction(){
    await handleButtonClick("Analytic")
    await handleButtonClick("Timeline")

    console.log('Add')
  }

  return (
    <div className="company_inspect">
      <div className="company_content">
        <div className="company_content_header">
          <button
            className={activeButton === "Analytic" ? "active" : ""}
            onClick={() => handleButtonClick("Analytic")}
          >
            Analytic
          </button>
          <button
            className={activeButton === "Timeline" ? "active" : ""}
            onClick={() => handleButtonClick("Timeline")}
          >
            Timeline
          </button>

          {activeButton !== "Analytic" && <button
            className='timeline_today'
            onClick={() => {
              const btn_today = document.getElementById('current-month-button__id');

              btn_today.click()
            }}
          >
            Today
          </button>}
        </div>
        { activeButton === "Analytic" ? (<ul className="company_content_body">
          <li className="company_row">
            <div className="company_row--element">
              <AmountStat
                titleValue={"Net profit:"}
                currentValue={9542}
                prevValue={10050}
                prefixValue={"$"}
                imageHeight={20}
                imageWidth={20}
                titleStyle={hugeTitleStyle}
                currentStyle={hugeCurrentStyle}
                percentStyle={hugePercentStyle}
              />
              <div className="company_row--element_grap">
                <WeeklyDownloadsChart isDrop={true} id={1}/>
              </div>
            </div>
            <div className="company_row--element">
              <AmountStat
                titleValue={"Net profit:"}
                currentValue={9542}
                prevValue={10050}
                prefixValue={"$"}
                imageHeight={20}
                imageWidth={20}
                titleStyle={hugeTitleStyle}
                currentStyle={hugeCurrentStyle}
                percentStyle={hugePercentStyle}
              />
              <div className="company_row--element_grap">
              <WeeklyDownloadsChart isDrop={true} id={2}/>
              </div>
            </div>
            <div className="company_row--element">
              <AmountStat
                titleValue={"Net profit:"}
                currentValue={9542}
                prevValue={10050}
                prefixValue={"$"}
                imageHeight={20}
                imageWidth={20}
                titleStyle={hugeTitleStyle}
                currentStyle={hugeCurrentStyle}
                percentStyle={hugePercentStyle}
              />
              <div className="company_row--element_grap">
              <WeeklyDownloadsChart id={3}/>
              </div>
            </div>
            <div className="company_row--element">
              <AmountStat
                titleValue={"Net profit:"}
                currentValue={9542}
                prevValue={10050}
                prefixValue={"$"}
                imageHeight={20}
                imageWidth={20}
                titleStyle={hugeTitleStyle}
                currentStyle={hugeCurrentStyle}
                percentStyle={hugePercentStyle}
              />
              <div className="company_row--element_grap">
              <WeeklyDownloadsChart id={4}/>
              </div>
            </div>
          </li>
          <li className="company_row">
            <div className="company_row--element">
              <BarChart data={DataMockDiag}/>
            </div>
            <div className="company_row--element">
              <h1 className="element_title light">Statistics</h1>
              <div className="radial_chart">
                <div
                  className="chart_container"
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <Chart
                    ref={chartRef}
                    data={stateWithBackgroundColors}
                    options={options}
                    type={"doughnut"}
                  />
                  <div className="disk_analytics">
                    {hoveredSegment === null ? (
                      <div className="disk_analytics--unhover">
                        <p className="disk_analytics_title">Total</p>
                        <h2 className="disk_analytics_space">+220 млн</h2>
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
                <ul className="company_cat">
                  <li className="company_cat--element">
                    <div className="company_cat--element_icon"></div>
                    <p className="company_cat--element_name">Social Media</p>
                    <p className="company_cat--element_info">85.71%</p>
                  </li>
                  <li className="company_cat--element">
                    <div className="company_cat--element_icon"></div>
                    <p className="company_cat--element_name">Social Media</p>
                    <p className="company_cat--element_info">85.71%</p>
                  </li>
                  <li className="company_cat--element">
                    <div className="company_cat--element_icon"></div>
                    <p className="company_cat--element_name">Social Media</p>
                    <p className="company_cat--element_info">85.71%</p>
                  </li>
                  <li className="company_cat--element">
                    <div className="company_cat--element_icon"></div>
                    <p className="company_cat--element_name">Social Media</p>
                    <p className="company_cat--element_info">85.71%</p>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li className="company_row">
            <div className="company_row--element">
              <h1 className="element_title">Statistics</h1>
              {/* <LineGraph {...props2} accent={"#DB371F"} fillBelow={"#ffb5b5"} /> */}
              <LineChart/>
            </div>
          </li>
        </ul>) : (
          <div className="company_timeLine">
            <HorizontalCalendar eventsArray={eventsData} handleAddEvent={handleAddEvent}/>
          </div>
        )}
      </div>
      <div className="company_addition">
        <h2>About</h2>
        <div className="company_back" style={{cursor: 'pointer'}} onClick={handleClose}></div>
        <div className="company_addition_info">
          <div className="company_addition_info--header">
            <div className="company_addition_info--header_main">
              <img src={API_URL + company?.iconUrl} width={48} height={48} />
              <h3>
                {company?.name}
              </h3>
            </div>
            <ul className="company_addition_info--header_control">
              <li className="company_addition_info--header_control_element">
                <button onClick={() => handleDeleteSingle()}>Delete</button>
              </li>
              <li className="company_addition_info--header_control_element">
                <button className="blue" onClick={() => handleEdit()}>Edit</button>
              </li>
            </ul>
          </div>
          <p className="company_addition_info--description">
            {company?.description}
          </p>
          <ul className="company_addition_info--contact">
            <li className="company_addition_info--contact_element">
              <img src={Email} alt="Email icon" />
              <h3>Email</h3>
              <p>{company?.email ?? "None"}</p>
            </li>
            <li className="company_addition_info--contact_element">
              <img src={Phone} alt="Email icon" />
              <h3>Phone</h3>
              <p>{company?.email ?? "None"}</p>
            </li>
            <li className="company_addition_info--contact_element">
              <img src={Location} alt="Email icon" />
              <h3>Location</h3>
              <p>{company?.adress.slice(0, 30) + "..." ?? "None"}</p>
            </li>
          </ul>
        </div>
        <div className="company_workers">
          <div className="workers_header">
            <h1>Workers</h1>
          </div>

          {employees.filter((el) => el.position !== "CEO").length > 0 ? (
            <EmployeeTable
              employees={employees.filter((el) => el.position !== "CEO")}
            />
          ) : (
            <p>
              At the moment there are no employees in your company, <br /> to
              add them, click on the Workers tab
            </p>
          )}
        </div>
      </div>
      {isAdding && <AddEventComponent handleClose={handleAddEvent} onAdd={handleAddAction}/>}
      {isEditing && <EditCompany handleClose={() => handleEdit()} companyId={editId} info={company}/>}
    </div>
  );
};

export default CompanyInfo;
