import React, { useCallback } from "react";
import { Handle } from "reactflow";

const handleStyle = { left: 10 };

const CustomNodeTest = ({ data, sourcePosition, targetPosition }) => {
  const onChange = useCallback((e) => {
    if(e.target.checked){
      data?.action({
        department: {
          name: data.name,
        },
        manager: {
          name: data.head
        }
      })
    }
  }, []);

  return (
    <div className="flow-node">
      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />

      <label
        style={{ pointerEvents: "auto", cursor: "pointer" }}
        className="flow_node"
        htmlFor={data.type === "radio" ? data.id : ""}
      >
        {data.type === "radio" && data.isSelectable &&  (
          <input id={data.id} name="flow_structure" type="radio" onChange={onChange}/>
        )}
        <div className="flow_node-info">
          <p>{data.name}</p>
          {data.head && <p>{data.head}</p>}
        </div>
      </label>
    </div>
  );
};

export default CustomNodeTest;
