import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import './index.css'

function DNDList({ dataList }) {
  const [dragDropList, setDragDropList] = useState(dataList);

  const onDragComplete = (result) => {
    if (!result.destination) return;

    const arr = [...dragDropList];

    //Changing the position of Array element
    let removedItem = arr.splice(result.source.index, 1)[0];
    arr.splice(result.destination.index, 0, removedItem);

    //Updating the list
    setDragDropList(arr);
  };

  return (
    <div className="container-dnd">
      <div className="card-dnd">
        <div className="header-dnd">Drag and Drop List</div>

        <DragDropContext onDragEnd={onDragComplete}>
          <Droppable droppableId="drag-drop-list">
            {(provided, snapshot) => (
              <div
                className="drag-drop-list-container-dnd"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {dragDropList.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.label}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="item-card-dnd"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <span className="material-symbols-outlined-dnd">
                          
                        </span>
                        <p className="label-dnd">{item.label}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default DNDList;
