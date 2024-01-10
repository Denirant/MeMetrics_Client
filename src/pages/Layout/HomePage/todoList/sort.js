import React from "react";

function Sort({ setSort, sort }) {
	const handleSort = (e) => {
		const sortType = e.target.innerHTML;
		setSort(() => ({
			All: false,
			Active: false,
			Completed: false,
			[sortType]: true,
		}));
	};

	return (
		<div className="sort-buttons">
			{Object.entries(sort).map(([key, value]) => (
				<button
					key={key}
					className={value ? "active" : ""}
					onClick={handleSort}
				>
					{key}
				</button>
			))}
		</div>
	);
}

export default Sort;