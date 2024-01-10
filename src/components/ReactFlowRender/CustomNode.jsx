import React, { memo } from "react";

import { Handle } from "react-flow-renderer";

export default memo(({ data, isConnectable }) => {
  const handleClick = () => {
    console.log("node click");
  };
  return (
    <>
      <Handle
        id="1"
        position="top"
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div
        onClick={handleClick}
        style={{ border: "1px solid #eee", padding: 20 }}
      >
        <strong style={{ color: "#e00" }}>{data.label}</strong>
      </div>

      <Handle
        id="2"
        position="bottom"
        style={{ background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
});
