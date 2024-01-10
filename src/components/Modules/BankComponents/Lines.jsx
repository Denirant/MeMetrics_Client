import React, { useState, useEffect } from "react";

function Lines({ dataArray, withoutTitle = false }) {
  const [lines, setLines] = useState([]);
  const maxLineValue = Math.max(...dataArray.map((item) => item.value)) + Math.max(...dataArray.map((item) => item.value)) * .15;

  useEffect(() => {
    const animationDuration = 1000; // Длительность анимации в миллисекундах
    const animationSteps = 60; // Количество шагов анимации
    const stepValue = maxLineValue / animationSteps;

    let step = 0;
    const animationInterval = setInterval(() => {
      step += 1;
      const newLines = dataArray.map((item) => ({
        name: item.name,
        value: Math.min(item.value, step * stepValue),
        color: item.color,
      }));

      setLines(newLines);

      if (step === animationSteps) {
        clearInterval(animationInterval);
      }
    }, animationDuration / animationSteps);

    return () => clearInterval(animationInterval);
  }, [dataArray, maxLineValue]);

  const handleMouseEnter = (name) => {
    // Обработка события onMouseEnter
    // Напишите здесь код, который будет выполняться при наведении на элемент line
  };

  const handleMouseLeave = () => {
    // Обработка события onMouseLeave
    // Напишите здесь код, который будет выполняться при уходе курсора с элемента line
  };

  return (
    <div className="lines_container">
      {!withoutTitle && <h1 className="calendar_name">Price comparison</h1>}
      <div className={`line-chart ${withoutTitle ? 'huge' : ''}`}>
        {lines.map((line, index) => (
          <div
            key={index}
            className="line"
            onMouseEnter={() => handleMouseEnter(line.name)}
            onMouseLeave={handleMouseLeave}
          >
            {withoutTitle && <div className="line-header">
                <div className="line-label">{line.name}</div>
                <div className="line-value" style={{whiteSpace: 'nowrap'}}>$100,838 (38%)</div>
            </div>}

            {!withoutTitle && <div className="line-label">{line.name}</div>}
            <div className="line-body" style={{backgroundColor: line.color + '2e'}}>
              <div
                className="line-inspect"
                style={{
                  backgroundColor: line.color,
                  width: `${(line.value / maxLineValue) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lines;
