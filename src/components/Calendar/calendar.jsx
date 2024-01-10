import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import { PiFlagBold } from "react-icons/pi";

import { Button, Table, Image, Form, Card } from "react-bootstrap";
import Plus from "@rsuite/icons/Plus";

import axios from "axios";
import { addEvent, clearEvent } from "../../reducers/eventReducer";

import PlusIcon from "../../assets/img/NavigationIcons/Add.svg";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import EventInspect from "./InspectEvent";
import { convertDateFromString } from "../../utils/date";

import Dropdown from "../dropdownComponent/dropdown";
import dottedMenu from "../../assets/img/Navigation.svg";
import DeleteIcon from "../../assets/img/NavigationIcons/Delete.svg";
import showCustomConfirm from "../../utils/showCustomConfirm";
import { deleteTask } from "../../actions/user";

function formatMonthAndDate(dateString) {
  const dateParts = dateString.split("-");
  const day = dateParts[2];
  const month = dateParts[1];

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedMonth = monthNames[parseInt(month) - 1];

  return formattedMonth + " " + day;
}

function percentAmount(array) {
  const totalCount = array.length,
    trueCount = array.filter((check) => check === true).length;

  return Math.floor((trueCount / totalCount) * 100);
}

function selectStatusClass(array) {
  const percent = percentAmount(array);

  if (percent >= 0 && percent < 40) {
    return "#ffcccc";
  } else if (percent >= 40 && percent < 100) {
    return "#ffffb3";
  } else {
    return "#d6f5f1";
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

const HorizontalCalendar = ({ handleAddEvent }) => {
  //EVENTS:
  const dispatch = useDispatch();
  const eventsArray = useSelector((state) => state.events);

  const [isOpen, setIsOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const params = useParams();

  const getEvents = async () => {
    try {
      const url = `https://memetricsserver.onrender.comapi/tasks/company`;
      const { data: res } = await axios.get(url, {
        params: { id: params.id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      await dispatch(clearEvent([]));

      // Асинхронно добавляем новые события
      for (const item of res.array) {
        await dispatch(addEvent(item));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEvents();
  }, [dispatch]);

  // Используйте обновленное значение eventsArray из аргумента useEffect
  console.log("State после добавления/удаления:", eventsArray);

  function handleIsOpen(data = null) {
    setIsOpen(!isOpen);

    console.log(data);

    if (data) {
      setViewData(data);
    } else {
      setViewData(null);
    }
  }

  function addDaysToDate(dateStr, days) {
    var date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var formattedMonth = month < 10 ? "0" + month : month;
    var formattedDay = day < 10 ? "0" + day : day;

    return date.getFullYear() + "-" + formattedMonth + "-" + formattedDay;
  }

  // const eventsArray = dataEvents;

  /// CODE:

  function getEventsByCurrentMonth(eventsArray) {
    const currentDate = new Date(); // Текущая дата
    const currentMonth = currentDate.getMonth(); // Текущий месяц (от 0 до 11)

    // Фильтруем массив событий, чтобы оставить только те, которые действуют в текущем месяце
    const eventsByMonth = eventsArray
      .map((el) =>
        el.filter((event) => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);

          // Проверяем, что событие начинается до конца текущего месяца и заканчивается после начала текущего месяца
          return (
            eventStart.getMonth() <= currentMonth &&
            eventEnd.getMonth() >= currentMonth
          );
        })
      )
      .filter((el) => el.length > 0);

    return eventsByMonth;
  }

  function generateEventRows(dataArray) {
    const events = [...dataArray].filter((item) => {
      return item.checkes.some((obj) => obj.complete !== true);
    });

    events.sort((a, b) => {
      const dateA = new Date(a.start);
      const dateB = new Date(b.start);
      return dateA.getTime() - dateB.getTime();
    });

    const result = [];

    while (events.length > 0) {
      const row = [events.shift()];

      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        let overlap = false;

        for (let j = 0; j < row.length; j++) {
          const existingEvent = row[j];
          if (isOverlap(event, existingEvent)) {
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          row.push(event);
          events.splice(i, 1);
          i--;
        }
      }

      result.push(row);
    }

    return result;
  }

  // Вспомогательная функция для проверки пересечения событий
  function isOverlap(event1, event2) {
    const start1 = new Date(event1.start);
    const end1 = new Date(event1.end);
    const start2 = new Date(event2.start);
    const end2 = new Date(event2.end);

    return start1 <= end2 && start2 <= end1;
  }

  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());

  const scrollRef = useRef(null);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getWeekday = (year, month, day) => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekdays[new Date(year, month, day).getDay()];
  };

  const monthNamesShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleCurrentMonth = () => {
    setCurrentMonth(currentDate.getMonth());
    setSelectedDate(currentDate);

    setTimeout(() => {
      const scrollElement = scrollRef.current;
      const currentDayElement = scrollElement.querySelector(".current-date");

      if (currentDayElement) {
        const scrollLeft =
          currentDayElement.offsetLeft -
          scrollElement.offsetWidth / 2 +
          currentDayElement.offsetWidth / 2 -
          0;

        console.log(scrollLeft);

        scrollElement.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }, 300);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(year, currentMonth);
    const calendar = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, currentMonth, day);
      const isCurrentDate = date.toDateString() === currentDate.toDateString();
      const isSelectedDate =
        date.toDateString() === selectedDate.toDateString();

      calendar.push(
        <div
          key={day}
          className={`calendar-date 
            ${isCurrentDate ? "current-date" : ""} 
            ${
              isSelectedDate && isCurrentDate === false ? "selected-date" : ""
            }`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="date">
            <p>
              <span>{getWeekday(year, currentMonth, day)}</span>,{" "}
              {String(day).length < 2 ? "0" + day : day}
            </p>
          </div>
        </div>
      );
    }

    return calendar;
  };

  const Block = ({ data }) => {
    const year = currentDate.getFullYear();
    const daysInMonth = getDaysInMonth(year, currentMonth);

    const renderSquares = (eventArray) => {
      const squares = [];

      for (let i = 0; i < daysInMonth; i++) {
        const date = new Date(year, currentMonth, i + 1);
        const isCurrentDate =
          date.toDateString() === currentDate.toDateString();
        const isSelectedDate =
          date.toDateString() === selectedDate.toDateString();

        let isEventOnDay = false,
          lengthOfEvent = 0,
          eventColor = null,
          eventIndex = null;

        for (let index = 0; index < eventArray.length; index++) {
          const daysInMonth = getDaysInMonth(year, currentMonth);

          if (
            currentMonth + 1 ===
              Number(eventArray[index].start.split("-")[1]) &&
            i + 1 === Number(eventArray[index].start.split("-")[2])
          ) {
            isEventOnDay = true;
            eventColor = eventArray[index].color;
            if (eventArray[index].end.split("-")[1] > currentMonth + 1) {
              // console.log('Start to end of month')
              eventIndex = index;
              lengthOfEvent =
                1 + daysInMonth - Number(eventArray[index].start.split("-")[2]);
            } else {
              // console.log('Start and end')
              eventIndex = index;
              lengthOfEvent =
                1 +
                Number(eventArray[index].end.split("-")[2]) -
                Number(eventArray[index].start.split("-")[2]);
            }
          } else if (
            Number(eventArray[index].start.split("-")[1]) < currentMonth + 1 &&
            currentMonth + 1 < Number(eventArray[index].end.split("-")[1]) &&
            Number(eventArray[index].start.split("-")[1]) !==
              currentMonth + 1 &&
            currentMonth + 1 !== Number(eventArray[index].end.split("-")[1]) &&
            i === 0
          ) {
            // console.log('All days in month')
            eventIndex = index;
            isEventOnDay = true;
            lengthOfEvent = daysInMonth;
            eventColor = eventArray[index].color;
          } else if (
            Number(eventArray[index].end.split("-")[1]) === currentMonth + 1 &&
            Number(eventArray[index].end.split("-")[1]) <= daysInMonth &&
            Number(eventArray[index].start.split("-")[1]) < currentMonth + 1 &&
            i === 0
          ) {
            eventIndex = index;
            // console.log('From start to day');
            isEventOnDay = true;
            lengthOfEvent = Number(eventArray[index].end.split("-")[2]);
            eventColor = eventArray[index].color;
          }
        }

        squares.push(
          <div
            key={i}
            className={`square 
            ${isCurrentDate ? "square-current" : ""}
            ${
              isSelectedDate && isCurrentDate === false ? "square-selected" : ""
            }
          `}
          >
            {isEventOnDay &&
              renderEvent({
                title: eventArray[eventIndex].title,
                description: eventArray[eventIndex].description,
                checkes: eventArray[eventIndex].checkes,
                people: eventArray[eventIndex].people,
                length: lengthOfEvent,
                start: eventArray[eventIndex].start,
                end: eventArray[eventIndex].end,
                tags: eventArray[eventIndex].tags,
                stages: eventArray[eventIndex].stages,
                files: eventArray[eventIndex].files,
                id: eventArray[eventIndex].id,
                owner: eventArray[eventIndex].owner,
              })}
          </div>
        );

        if (i < daysInMonth - 1) {
          squares.push(<div key={`line-${i}`} className="line"></div>);
        }
      }

      return squares;
    };

    const renderRows = (array) => {
      array = getEventsByCurrentMonth(array);

      console.log(array);

      const rows = [];

      for (let j = 0; j < array.length; j++) {
        rows.push(
          <div className="row" key={`row-${j}`}>
            {renderSquares(array[j])}
          </div>
        );
      }

      return rows;
    };

    const renderEvent = ({
      title,
      description,
      checkes,
      people,
      length,
      start,
      end,
      tags,
      stages,
      files,
      id,
      owner,
    }) => {
      return (
        <div
          className="event-field"
          style={{
            width: `${176 * length + 10 * (length - 1) - 20}px`,
            gap: `${length > 1 ? "30px" : "0px"}`,
          }}
          onClick={() =>
            handleIsOpen({
              title,
              description,
              checkes,
              people,
              start,
              end,
              tags,
              stages,
              files,
              owner,
              id,
            })
          }
        >
          {/* <div className='event-field-status'></div> */}
          <div className="event-field-info">
            <div className="event-field-info-title">
              {length > 1
                ? title.slice(0, 24) + (title.length > 24 ? "..." : "")
                : title.slice(0, 4) + (title.length > 4 ? "..." : "")}
            </div>
            <ul className="event-field-info-tags">
              {tags.map((el) => (
                <li
                  className="event-field-info-tag green"
                  style={{
                    backgroundColor: el.color,
                    color: getContrastColor(el.color),
                  }}
                >
                  {el.title}
                </li>
              ))}
            </ul>
            {length > 1 && (
              <div
                className="event-field-info-dates"
                style={{ display: "flex" }}
              >
                {`${formatMonthAndDate(start)} - ${formatMonthAndDate(end)}`}
              </div>
            )}
          </div>

          <div className="event-field-aside">
            {length > 1 && (
              // <button className="event-field-aside-button" ></button>
              <div
                onClick={(e) => {
                  e.stopPropagation(); // Предотвращение всплытия события
                  // Другие действия, связанные с дропдауном
                }}
              >
                <Dropdown
                  imageUrl={dottedMenu}
                  dropContent={[
                    {
                      icon: DeleteIcon,
                      text: "Delete",
                      handler: async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const isDelete = await showCustomConfirm(
                          "You sure, you want to delete this event?",
                          "Delete",
                          "Delete event"
                        );
                        if (isDelete) {
                          dispatch(deleteTask(id));
                        }
                      },
                    },
                  ]}
                  width={"24px"}
                  height={"24px"}
                  dropClass={"file-menu"}
                />
              </div>
            )}

            <div
              className="event-field-aside-score"
              style={{
                backgroundColor: selectStatusClass(
                  checkes.map((el) => el.complete)
                ),
              }}
            >
              {percentAmount(checkes.map((el) => el.complete))}%
            </div>

            <ul className="event-field-aside-people">
              {people &&
                length > 2 &&
                people.slice(0, 4).map((elem, index) => {
                  return (
                    <li
                      key={`people-${index}`}
                      className="event-field-aside-image"
                    >
                      <img
                        src={`https://memetricsserver.onrender.com${elem.image}`}
                        alt="worker on task"
                      />
                    </li>
                  );
                })}
              {people &&
                length > 1 &&
                length <= 2 &&
                people.slice(0, 2).map((elem, index) => {
                  return (
                    <li
                      key={`people-${index}`}
                      className="event-field-aside-image"
                    >
                      <img
                        src={`https://memetricsserver.onrender.com${elem.image}`}
                        alt="worker on task"
                      />
                    </li>
                  );
                })}
              {people.length > 4 && length > 2 && (
                <li className="event-field-aside-image">
                  <p className="event-field-aside-text">+{people.length - 4}</p>
                </li>
              )}
              {people.length > 2 && length > 1 && length <= 2 && (
                <li className="event-field-aside-image">
                  <p className="event-field-aside-text">+{people.length - 2}</p>
                </li>
              )}
            </ul>
          </div>
        </div>
      );
    };

    return <div className="block">{renderRows(data)}</div>;
  };

  function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber);

    return date.toLocaleString("en-US", { month: "long" });
  }

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current.scrollTop > 10) {
        scrollRef.current.classList.add("scrolled");
      } else {
        scrollRef.current.classList.remove("scrolled");
      }
    };

    const element = scrollRef.current;

    element?.addEventListener("scroll", handleScroll);

    return () => {
      element?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [view, setView] = useState("current"); // Начальное состояние - отображение графика

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="timeline-dashboard">
      <div className="timeline-dashboard-header">
        <div className="timeline_view">
          <button
            className={`timeline_view-item current ${
              view === "current" ? "active_btn" : ""
            }`}
            onClick={() => handleViewChange("current")}
          ></button>
          <button
            className={`timeline_view-item finish ${
              view === "finish" ? "active_btn" : ""
            }`}
            onClick={() => handleViewChange("finish")}
          ></button>
        </div>
        {/* <ul className="timeline_sort">
          <li className="timeline_sort-item active">All</li>
          <li className="timeline_sort-item">Outgoing</li>
          <li className="timeline_sort-item">Incoming</li>
        </ul> */}
        <button
          className="timeline_add"
          onClick={() => {
            handleAddEvent();
          }}
        >
          <img src={PlusIcon} alt="icon plus" />
          Add event
        </button>
      </div>
      {view === "current" ? (
        <div className="timeline-calendar">
          <div className="calendar-header">
            <div className="calendar-header-control">
              <div className="year_selector">
                <button className="prev-month-button"></button>
                <p>{currentDate.getFullYear()}</p>
                <button className="next-month-button"></button>
              </div>
              <div className="month_selector">
                <ul className="month_selector__list">
                  {monthNamesShort.map((el, index) => (
                    <li
                      className={`month_selector__list-element ${
                        currentMonth === index ? "active" : ""
                      }`}
                      onClick={() => setCurrentMonth(index)}
                    >
                      {el}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              id="current-month-button__id"
              style={{ display: "none" }}
              className="current-month-button"
              onClick={handleCurrentMonth}
            >
              Today
            </button>
          </div>
          <div className="calendar-days" ref={scrollRef}>
            <div className="calendar-scroll">{renderCalendar()}</div>
            {console.log(eventsArray)}
            {eventsArray.length > 0 && (
              <Block data={generateEventRows(eventsArray)} />
            )}
          </div>
        </div>
      ) : (
        <div className="timeline_list">
          <h1 className="timeline_list-title">Completed events</h1>
          <ul className="timeline_list-container">
            {eventsArray
              .filter((item) => {
                return item.checkes.every((obj) => obj.complete === true);
              })
              .map((el) => (
                <li className="timeline_list-container-item">
                  <div
                    className="event-field"
                    style={{
                      width: "100%",
                      gap: "30px",
                    }}
                    onClick={() =>
                      handleIsOpen({
                        title: el.title,
                        description: el.description,
                        checkes: el.checkes,
                        people: el.people,
                        start: el.start,
                        end: el.end,
                        tags: el.tags,
                        stages: el.stages,
                        files: el.files,
                        owner: el.owner,
                        id: el.id,
                        short: true
                      })
                    }
                  >
                    {/* <div className='event-field-status'></div> */}
                    <div className="event-field-info">
                      <div className="event-field-info-title">
                        {el.title.slice(0, 24) +
                          (el.title.length > 24 ? "..." : "")}
                      </div>
                      <ul className="event-field-info-tags">
                        {el.tags.map((el) => (
                          <li
                            className="event-field-info-tag green"
                            style={{
                              backgroundColor: el.color,
                              color: getContrastColor(el.color),
                            }}
                          >
                            {el.title}
                          </li>
                        ))}
                      </ul>
                      <div
                        className="event-field-info-dates"
                        style={{ display: "flex" }}
                      >
                        {`${formatMonthAndDate(
                          el.start
                        )} - ${formatMonthAndDate(el.end)}`}
                      </div>
                    </div>

                    <div className="event-field-aside">
                      <div
                        onClick={(e) => {
                          e.stopPropagation(); // Предотвращение всплытия события
                          // Другие действия, связанные с дропдауном
                        }}
                      >
                        <Dropdown
                          imageUrl={dottedMenu}
                          dropContent={[
                            {
                              icon: DeleteIcon,
                              text: "Delete",
                              handler: async (e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                const isDelete = await showCustomConfirm(
                                  "You sure, you want to delete this event?",
                                  "Delete",
                                  "Delete event"
                                );
                                if (isDelete) {
                                  dispatch(deleteTask(el.id));
                                }
                              },
                            },
                          ]}
                          width={"24px"}
                          height={"24px"}
                          dropClass={"file-menu"}
                        />
                      </div>

                      <div
                        className="event-field-aside-score"
                        style={{
                          backgroundColor: selectStatusClass(
                            el.checkes.map((el) => el.complete)
                          ),
                        }}
                      >
                        {percentAmount(el.checkes.map((el) => el.complete))}%
                      </div>

                      <ul className="event-field-aside-people">
                        {el.people &&
                          el.people.slice(0, 4).map((elem, index) => {
                            return (
                              <li
                                key={`people-${index}`}
                                className="event-field-aside-image"
                              >
                                <img
                                  src={`https://memetricsserver.onrender.com${elem.image}`}
                                  alt="worker on task"
                                />
                              </li>
                            );
                          })}
                        {el.people.length - 2 !== 0 && (
                          <li className="event-field-aside-image">
                            <p className="event-field-aside-text">
                              +{el.people.length - 2}
                            </p>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
      {isOpen && (
        <EventInspect
          title={viewData.title}
          start={viewData.start}
          end={viewData.end}
          description={viewData.description}
          checkes={viewData.checkes}
          stages={viewData.stages}
          handleClose={handleIsOpen}
          tags={viewData.tags}
          people={viewData.people}
          files={viewData.files}
          owner={viewData.owner}
          id={viewData.id}
          short={viewData.short}
        />
      )}
    </div>
  );
};

export default HorizontalCalendar;
