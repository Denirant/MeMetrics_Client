import React, { useEffect, useRef, useState } from 'react';
import './style.css';

const BarChart = ({ data }) => {
  const maxBarValue = Math.max(...data.map(item => item.value));
  const [bars, setBars] = useState(data.map(item => ({
    name: item.name,
    value: 0, // Начальное значение
  })));
  const [tooltip, setTooltip] = useState(null);
  const chartRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [currentBar, setCurrentBar] = useState(null);

  const horizontalLinesCount = 5;

  useEffect(() => {
    const animationDuration = 1000; // Длительность анимации в миллисекундах
    const animationSteps = 60; // Количество шагов анимации
    const stepValue = maxBarValue / animationSteps;

    let step = 0;
    const animationInterval = setInterval(() => {
      step += 1;
      const newBars = bars.map(bar => ({
        ...bar,
        value: Math.min(bar.value + stepValue, data.find(item => item.name === bar.name).value),
      }));

      setBars(newBars);

      if (step === animationSteps) {
        clearInterval(animationInterval);
      }
    }, animationDuration / animationSteps);

    return () => clearInterval(animationInterval);
  }, [data, bars, maxBarValue]);

  const handleMouseEnter = (barName) => {
    const value = data.find(item => item.name === barName).value;

    setIsHovering(true);
    setCurrentBar(barName);

    setTooltip({
      x: tooltip.x,
      y: tooltip.y,
      value: value,
    });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setCurrentBar(null);
  };

  const handleMouseMove = (event) => {

    const chartRect = chartRef.current.getBoundingClientRect();
    const offsetX = event.clientX - chartRect.left + 15;
    const offsetY = event.clientY - chartRect.top - 20;

    let value = '';

    if (event.target.closest('.bar')) {
      value = data.find(item => item.name === currentBar)?.value;
    }

    setTooltip({
      x: offsetX,
      y: offsetY,
      value: value,
    });
  };

  const drawHorizontalLines = () => {
    const lines = [];
    const maxHeight = Math.max(...bars.map(bar => bar.value));
    const minLabelValue = 0; // Минимальное значение для метки (в данном случае 0)
    const step = (maxHeight - minLabelValue) / horizontalLinesCount; // Вычисляем шаг между линиями
  
    for (let i = 0; i <= horizontalLinesCount; i++) {
      const labelValue = minLabelValue + i * step; // Значение линии с учетом шага
      const label = labelValue >= 1000000 ? `${(labelValue / 1000000).toFixed(0)}M` : labelValue >= 1000 ? `${(labelValue / 1000).toFixed(0)}K` : Math.round(labelValue);
  
      lines.push(
        <div
          key={i}
          className="horizontal-line"
          style={{
            bottom: `${(i / horizontalLinesCount) * 100}%`, // Используйте процент для позиции
          }}
        ></div>
      );
  
      lines.push(
        <div
          key={`label-${i}`}
          className="horizontal-line-label"
          style={{
            bottom: `${(i / horizontalLinesCount) * 100}%`, // Используйте процент для позиции
          }}
        >
          {label}
        </div>
      );
    }
  
    return lines.reverse();
  };
  

  return (
    <div className='bar_body'>
      <h1 className='calendar_name'>Transaction rate</h1>
      <div className="bar-chart" ref={chartRef} onMouseMove={handleMouseMove}>
        
        {bars.map((bar, index) => (
          <div
            className="bar-container"
            key={bar.name}
            onMouseLeave={handleMouseLeave}
          >
            {/* <p className='bar_value'>{() => setTimeout(() => {
              return bar.value
            }, 1000)}</p> */}
            <div className="bar" onMouseEnter={() => handleMouseEnter(bar.name)} style={{ height: `${(bar.value / maxBarValue) * 100}%` }}></div>
            <div className="bar-label">{bar.name}</div>
          </div>
        ))}
        {currentBar && isHovering && tooltip && (
          <div
            className="value-tooltip"
            style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, position: 'absolute' }}
          >
            Value: {tooltip.value}
          </div>
        )}
        <div className='bar-lines'>
          {drawHorizontalLines()}
        </div>
      </div>
    </div>
  );
};

export default BarChart;
