import React from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

const boxStyle = {
  border: "grey solid 2px",
  borderRadius: "10px",
  padding: "5px",
  cursor: "pointer",
  height: '65px',
  backgroundColor: 'black',
  color: 'white'
};

const DraggableBox = ({ id }) => {
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div id={id} style={boxStyle}>
        {id}

        <div
          style={{ width: "25px", height: "25px", backgroundColor: "grey" }}
        ></div>
      </div>
    </Draggable>
  );
};

const V2Example = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        width: "100%",
        background: "radial-gradient(circle, #e1e1e1 10%, transparent 10%)",
        backgroundSize: "1em 1em",
        backgroundColor: "#ffffff",
        opacity: "0.75",
        height: '100%'
      }}
    >
      <Xwrapper>
        <DraggableBox id={"parent"} />
        <DraggableBox id={"child_1"} />
        <Xarrow color="black" start={"parent"} end={"child_1"} />
      </Xwrapper>
    </div>
  );
};
export default V2Example;


