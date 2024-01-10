import "./CircleChart.css";
import 'chart.js/auto';
import React, { useState, useRef } from "react";
import { Chart, getElementAtEvent } from 'react-chartjs-2';

import arrowUp from '../../assets/img/Arrow-up.svg';
import All from '../../assets/img/FileType/all.svg';
import Image from '../../assets/img/FileType/jpg.svg';
import Video from '../../assets/img/FileType/mov.svg';
import Audio from '../../assets/img/FileType/mp3.svg';
import PDF from '../../assets/img/FileType/pdf.svg';
import PPT from '../../assets/img/FileType/ppt.svg';
import Text from '../../assets/img/FileType/txt.svg';
import Document from '../../assets/img/FileType/word.svg';
import Excel from '../../assets/img/FileType/xlsx.svg';
import Archive from '../../assets/img/FileType/zip.svg';
import { useDispatch } from "react-redux";

import {showAllGroupFiles} from '../../actions/file'

export default function CircleChart({dataProp, usedSpace}) {

  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [isAnalyticMinimal, setIsAnalyticMinimal] = useState(true);

  const dispatch = useDispatch()

  const chartRef = useRef();
  const onClick = (event, elName = null) => {
    let name = elName;
    const index = getElementAtEvent(chartRef.current, event)[0]?.index;

    if(index !== null && name === null){
      name = dataProp[index].name;
    }

    if(name !== 'Empty'){
      dispatch(showAllGroupFiles(name))
    }
  }



  const state = {
    datasets: [
      {
        data: dataProp.map(el => el.size),
        backgroundColor: dataProp.map(el => el.color),
        offset: 0,
        borderRadius: 8,
        borderWidth: 4,
        hoverBorderWidth: 4
      }
    ]
  };
  const options = {
    cutout: 60,
    responsive: true,
    plugins: {
      tooltip: {
        enabled: false 
      },
      legend: {
        display: false
      }
    },
    onHover: (event, activeElements) => {
      const chartContainer = document.querySelector(".chart--analytic"); 
      if (activeElements && activeElements.length > 0) {
        setHoveredSegment(activeElements[0].index);
        chartContainer.children[0].style.cursor = "pointer";
      } else {
        setHoveredSegment(null);
        chartContainer.children[0].style.cursor = "default";
      }
    }
  };


  function selectIconByGroupName(groupName){
    switch (groupName) {
      case 'Image':
        return Image;
      case 'Document':
        return Document;
      case 'Excel':
        return Excel;
      case 'PDF':
        return PDF;
      case 'Text':
        return Text;
      case 'Archive':
        return Archive;
      case 'Audio':
        return Audio;
      case 'Video':
        return Video;
      case 'Presentation':
        return PPT;
      default:
        return All;
    }
  }


  const segmentBackgroundColors = state.datasets[0].backgroundColor.map(
    (color, index) => {
      if (hoveredSegment === null || hoveredSegment === index) {
        return color;
      } else {
        return `${color}80`;
      }
    }
  );

  const stateWithBackgroundColors = {
    ...state,
    datasets: [
      {
        ...state.datasets[0],
        backgroundColor: segmentBackgroundColors
      }
    ]
  };

  function handleToggleAnalyric(e){
    setIsAnalyticMinimal(!isAnalyticMinimal);
  }
  
  return (
    <div className="chart" onMouseLeave={() => setHoveredSegment(null)}>
      <div className="analytic--header" onClick={handleToggleAnalyric}>
        <h1 className="chart--title">Cloud space</h1>
        <img 
          width={16}
          height={16}
          src={arrowUp} 
          alt="" 
          className={`analytic_arrow ${!isAnalyticMinimal ? 'down' : ''}`}
        />
      </div>
      <div className="chart--analytic">
        <Chart 
          ref={chartRef}
          data={stateWithBackgroundColors} 
          options={options} 
          type={'doughnut'} 
          onClick={onClick}
        />
        <div className="disk_analytics">
          {hoveredSegment === null ? (
            <div className="disk_analytics--unhover">
              <p className="disk_analytics_title">Used</p>
              <h2 className="disk_analytics_space">{(usedSpace === '0.00 B') ? '0 GB' : usedSpace}</h2>
              <p className="disk_analytics_all">5 GB</p>
            </div>
          ) : (
            <div className="disk_analytics--hover">
              <h2 className="disk_analytics_space">{dataProp[hoveredSegment].label}</h2>
              <p className="disk_analytics_all">{dataProp[hoveredSegment].name}</p>
            </div>
          )}
        </div>
      </div>
      <p className="chart--info">Hover on circle</p>
      <ul className={`analytic--list ${!isAnalyticMinimal ? 'open' : ''}`} style={{height: (!isAnalyticMinimal) ? `${56 * dataProp.length}px` : '0px' }}>
        {dataProp.map((el, index) => (
          <li className="analytic--item" onClick={(e) => onClick(e, el.name)}>
            <img
              className="analytic--item_image" 
              src={selectIconByGroupName(el.name)} 
              alt="analytic_icon"
            />
            <h3 className="analytic--item_name">{el.name}</h3>
            <p className="analytic--item_size">{el.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
