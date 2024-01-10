import React, { useEffect, useState } from "react";
import ReactBigCalendar from "../../../components/BigCalendar/ReactBigCalendar";

import Input from "./todoList/input";
import TodoFooter from "./todoList/todoFooter";
import TodoList from "./todoList/todoList";

import Sort from "./todoList/sort";

import { useSelector, useDispatch } from "react-redux";

import "./style.css";
import TodoEdit from "./EditTodo";

import { setNewTask, deleteTask } from "../../../reducers/todoSlice";

import { getAllTodoApi } from "../../../actions/todo";

import LineChartCustom from "../../../components/lineChartd3";
import BarStashed from "../../../components/barChartGroup";

import GradientLineChart from "../../../components/Charts/LineChart";
import WeeklyDownloadsChart from "../../../components/SmallLineChart";

// const gradientLineChartData = {
//   labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//   datasets: [
//     {
//       label: "Mobile apps",
//       color: "info",
//       data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
//     },
//     {
//       label: "Websites",
//       color: "dark",
//       data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
//     },
//   ],
// };



const HomePage = () => {
  const [sort, setSort] = useState({
    All: true,
    Active: false,
    Completed: false,
  });

  const sortComponent = () => (
    <Sort setSort={setSort} activeTasks={activeTasks} sort={sort} />
    );  

  const dispatch = useDispatch();
  const [dataLoaded, setDataLoaded] = useState(false); 

  useEffect(() => {

    async function setAllTodo(){
    
      const data = await getAllTodoApi();

      for(let item of data){
        dispatch(deleteTask(item._id));
      }

      for(let item of data){
        dispatch(setNewTask({
          id: item._id,
          title: item.title,
          start: item.start,
          end: item.end,
          completed: item.complete
        }));
      }

      console.log(data)
    }

    setAllTodo();
  }, [dispatch])

  const allTasks = useSelector((state) => state.todo);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  if (!allTasks.tasks) return;
  const activeTasks = allTasks.tasks.filter((task) => !task.completed);
  const completedTasks = allTasks.tasks.filter((task) => task.completed);

  const tasks = sort.All
    ? allTasks.tasks
    : sort.Active
    ? activeTasks
    : completedTasks;


  function handleEditByCalendar(e){
    const editId = e.id;

    setIsEdit(!isEdit);

    if(editId){
      const editedIndex = tasks.findIndex(
        (task) => task.id === editId
      );

      setEditData(tasks[editedIndex])
    }else{
      setEditData(null)
    }
  }

  function handleEdit(editId){
    setIsEdit(!isEdit);

    if(editId){
      const editedIndex = tasks.findIndex(
        (task) => task.id === editId
      );

      setEditData(tasks[editedIndex])
    }else{
      setEditData(null)
    }
  }

  return (
    <div className="dashboard_page">
      {/* <BarStashed/> */}
      {/* <LineChartCustom/> */}
      {/* <GradientLineChart
                title="Sales Overview"
                description={
                  'Description chart'
                }
                height="450px"
                chart={gradientLineChartData}
              /> */}
      {/* <WeeklyDownloadsChart/> */}
      <h1 className="worker_container__activity_title">Todo planner</h1>
      <div className="planner">
        <div className="todo_list">
            {sortComponent()}
          <Input />
          <div className="todo-container">
            <TodoList tasks={tasks} handleEdit={handleEdit}/>
            <TodoFooter
              setSort={setSort}
              sort={sort}
              activeTasks={activeTasks}
            />
          </div>
        </div>
        <div className="worker_container__activity_calendar">
          <ReactBigCalendar handleShowActivity={() => {}} eventList={tasks} handleEditByCalendar={handleEditByCalendar}/>
        </div>
      </div>
      {isEdit && <TodoEdit {...editData} handleClose={handleEdit} />}
    </div>
  );
};

export default HomePage;
