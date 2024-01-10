// import { useWindowSize } from "@uidotdev/usehooks";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCompleted } from "../../../../reducers/todoSlice";
import Sort from "./sort";

import deleteIcon from '../../../../assets/img/DropDown/Trash.svg'
import { deleteTodoApi } from "../../../../actions/todo";

function TodoFooter({ setSort, activeTasks, sort }) {
	const dispatch = useDispatch();
	// const { width } = useWindowSize();
	const isMobile = false;

	const sortComponent = () => (
		<Sort setSort={setSort} activeTasks={activeTasks} sort={sort} />
	);

	const data = useSelector(state => state.todo)

	return (
		<div className="todo-footer">
			<div className="footer">
				<p>Left: <br/> {activeTasks.length} item(s)</p>
				<button onClick={async () => {

					console.log(data.tasks)
					console.log(data.tasks.filter(el => el.completed).map(el => el.id))

					for(let id of data.tasks.filter(el => el.completed).map(el => el.id)){
						deleteTodoApi(id);
					}
					
					dispatch(clearCompleted())
				}}>
                    <img width={20} height={20}  src={deleteIcon} style={{filter: 'invert(100%)'}} alt="clear_icon"/>
					Clear Completed
				</button>
			</div>
		</div>
	);
}

export default TodoFooter;