import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTodos, setInput, setNewTask } from "../../../../reducers/todoSlice";
import { createTodoApi } from "../../../../actions/todo";

function Input({ setLocalTasks }) {
	const [message, setMessage] = useState("");
	const dispatch = useDispatch();

	const handleOnChange = (e) => {
		const currentMessage = e.target.value;
		setMessage(currentMessage);
		dispatch(setInput(currentMessage));
	};

	const handleKeyDown = async (event) => {
		if (event.key === "Enter") {
			const res = await createTodoApi(message, new Date(), new Date());
			dispatch(setNewTask({
				id: res._id,
				title: message,
				start: new Date(),
				end: new Date(),
				completed: false
			}));
			setMessage("");
		}
	};

    async function handleAddItem(e){
        if (message) {
			const res = await createTodoApi(message, new Date(), new Date());

			dispatch(setNewTask({
				id: res._id,
				title: message,
				start: new Date(),
				end: new Date(),
				completed: false
			}));
			setMessage("");
		}
    }

	return (
		<div className="add-new">
			<input
				placeholder="Create a new todo..."
				onChange={handleOnChange}
				onKeyDown={handleKeyDown}
				type="text"
				className="input-todo"
				value={message}
			/>
            <div className="add-icon" onClick={handleAddItem}>
            </div>
		</div>
	);
}

export default Input;