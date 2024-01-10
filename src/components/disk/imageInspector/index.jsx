import React, { useState } from "react";
import "./style.css";
import ZoomIn from "../../../assets/img/NavigationIcons/Add.svg";
import ZoomOut from "../../../assets/img/NavigationIcons/Remove.svg";

function ImageInspector({ imagePath, handleClose }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(0.2, prevScale - 0.1));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });

    e.target.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setPosition((prevPosition) => ({
      x: prevPosition.x + dx,
      y: prevPosition.y + dy,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e) => {
    setIsDragging(false);
    e.target.style.cursor = "grab";
  };

  function handleWrapperClick(e) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  return (
    <div className="imageInspector-wrapper" onClick={handleWrapperClick}>
      <div className="imageInspector-close" onClick={handleClose}></div>
      <div
        className="imageInspector-body"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <img src={imagePath} alt="image_view" />
      </div>
      <div className="imageInspector-controls">
        <button onClick={handleZoomIn} className="inspect_btn plus">
          <img src={ZoomIn} alt="icon_zoom" /> Zoom in
        </button>
        <button onClick={handleZoomOut} className="inspect_btn minus">
          <img src={ZoomOut} alt="icon_zoom" /> Zoom out
        </button>
      </div>
    </div>
  );
}

export default ImageInspector;
