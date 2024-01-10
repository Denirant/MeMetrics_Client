import { useDispatch } from "react-redux";
import { deleteTask, toggleComplete } from "../../../../reducers/todoSlice";
import deleteIcon from "../../../../assets/img/Close.svg";
import editIcon from '../../../../assets/img/Edit.svg'

import { convertDateToString } from "../../../../utils/date";
import { deleteTodoApi, markTodoAsComplateApi } from "../../../../actions/todo";

function Todo({ id, title, completed, start, end, handleEdit}) {
	const dispatch = useDispatch();

	const handleDelete = async () => {
		deleteTodoApi(id);
		dispatch(deleteTask(id));
	};

	return (
		<li className={`todo-item${completed ? " completed" : ""}`}>
			<div className="todo-title" onClick={async () => {
				await markTodoAsComplateApi(id)
				dispatch(toggleComplete(id))
			}}>
				<div
					className="checkbox"
					role="checkbox"
					aria-checked={completed}
					tabIndex="0"
				></div>
				<span>
					<span>
						{title}
					</span>
					<p>{convertDateToString(start)} - {convertDateToString(end)}</p>	
				</span>
				
			</div>

			<button onClick={(e) => handleEdit(id)} className="todo_icon edit">
				<img width={20} height={20} src={editIcon} alt="todo-icon" />
			</button>
			<button onClick={handleDelete} className="todo_icon delete">
				<img width={20} height={20} src={deleteIcon} alt="todo-icon" />
			</button>
		</li>
	);
}

export default Todo;