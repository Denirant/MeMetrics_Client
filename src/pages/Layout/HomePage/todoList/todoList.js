import { useDispatch, useSelector } from "react-redux";
import { selectTodos } from "../../../../reducers/todoSlice";
import Todo from "./todo";

function TodoList({ tasks, handleEdit }) {
	return tasks.length > 0 ? (
		<ul className="todo-list">
			{tasks.map((task) => {
				return <Todo key={task.id} {...task} handleEdit={handleEdit}/>;
			})}
		</ul>
	) : <p className="todo-placeholder">You don't have any assigned <br/> tasks, add something to display the list</p>;
}

export default TodoList;