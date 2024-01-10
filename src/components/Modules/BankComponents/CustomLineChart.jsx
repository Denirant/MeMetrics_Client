import React, { useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import CubicSpline from 'cubic-spline';

const CustomLineChart = ({ dataFirst, dataSecond }) => {
  const canvasRef = useRef(null);
  const { width: containerWidth, height: containerHeight, ref: containerRef } = useResizeDetector();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeData, setActiveData] = useState(dataFirst);
  const [activeIndex, setActiveIndex] = useState(1);
  const [lineOpacity, setLineOpacity] = useState({ dataFirst: 1, dataSecond: 0.5 });
  const [shadowProgress, setShadowProgress] = useState(0);
  const [tooltipX, setTooltipX] = useState(null);

  const formatYValue = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(0) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K';
    } else {
      return Math.round(value / 5) * 5;
    }
  };

  let height = containerHeight || 200; // Добавьте это объявление
  const xAxisOffset = 10; // Объявление xAxisOffset

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = containerWidth || 300;
      const height = containerHeight || 200;
      const xAxisOffset = 10;
      const yAxisOffset = 20;
      const xAxisRightOffset = 40;

      canvas.width = width;
      canvas.height = height;

      const yMargin = 0.4 * (Math.max(...activeData.map((item) => item.y)) - Math.min(...activeData.map((item) => item.y)));

      const yValues = activeData.map((item) => item.y);
      const xStep = (width - 2 * (yAxisOffset + 20)) / (yValues.length - 1);
      const xValues = Array.from({ length: yValues.length }, (_, i) => i);
      const yMax = Math.max(...yValues) + yMargin;
      const yMin = Math.min(...yValues) - yMargin;
      const yRange = yMax - yMin;
      const yStep = (height - xAxisOffset) / yRange;

      const linearInterpolation = (data) => {
        const interpolatedData = [];
        for (let i = 0; i < data.length; i++) {
          const x = yAxisOffset + xValues[i] * xStep;
          const y = height - xAxisOffset - (data[i].y - yMin) * yStep;
          interpolatedData.push({ x, y });
        }
        return interpolatedData;
      };

      const cubicSplineInterpolation = (data) => {
        const xData = data.map((point) => point.x);
        const yData = data.map((point) => point.y);
        const spline = new CubicSpline(xData, yData, 1);
        const interpolatedData = [];

        for (let x = xData[0]; x <= xData[xData.length - 1]; x += 0.1) {
          interpolatedData.push({ x, y: spline.at(x) });
        }

        return interpolatedData;
      };

      const drawAxisLabels = () => {
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        for (let i = 0; i < xValues.length; i++) {
          const x = yAxisOffset + xValues[i] * xStep;
          const y = height - xAxisOffset;
          ctx.fillText(activeData[i].x, x, y - 5);
        }

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let i = 0; i <= 5; i++) {
          if (i > 0 && i < 5) {
            const yValue = yMin + (i / 5) * yRange;
            const x = yAxisOffset - 5;
            const y = height - xAxisOffset - (yValue - yMin) * yStep;
            ctx.fillText(formatYValue(yValue), x, y);

            ctx.beginPath();
            ctx.moveTo(30, y);
            ctx.lineTo(width - 30, y);
            ctx.strokeStyle = '#838383';
            ctx.lineWidth = 1;

            ctx.stroke();
          }
        }
      };

      const yMarginForShadow = 0.4 * (Math.max(...dataFirst.map((item) => item.y)) - Math.min(...dataFirst.map((item) => item.y)));
      const yMaxForShadow = Math.max(...dataFirst.map((item) => item.y)) + yMarginForShadow;
      const yMinForShadow = Math.min(...dataFirst.map((item) => item.y)) - yMarginForShadow;
      const yRangeForShadow = yMaxForShadow - yMinForShadow;
      const yStepForShadow = (height - xAxisOffset) / yRangeForShadow;

      const linearInterpolationForShadow = (data) => {
        const interpolatedData = [];
        for (let i = 0; i < data.length; i++) {
          const x = yAxisOffset + xValues[i] * xStep;
          const y = height - xAxisOffset - (data[i].y - yMinForShadow) * yStepForShadow;
          interpolatedData.push({ x, y });
        }
        return interpolatedData;
      };

      const smoothData = cubicSplineInterpolation(linearInterpolation(activeData));
      const smoothDataForShadow = cubicSplineInterpolation(linearInterpolationForShadow(dataFirst));

      const animationDuration = isAnimationComplete ? 0.1 : 2000;
      let startTime = null;
      let shadowStartTime = null;
      const shadowDuration = 3000;

      const animateLine = (timestamp) => {
        if (!startTime) {
          startTime = timestamp;
        }
        const progress = Math.min((timestamp - startTime) / animationDuration, 1);

        ctx.clearRect(0, 0, width, height);
        drawAxisLabels();

        const pointsToDraw = Math.floor(progress * smoothData.length);

        ctx.beginPath();
        ctx.lineJoin = 'round';
        ctx.moveTo(smoothData[0]?.x + yAxisOffset, smoothData[0]?.y);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = activeIndex === 1 ? '#3450E0' : '#FF5733';

        for (let i = 0; i <= pointsToDraw; i++) {
          ctx.lineTo(smoothData[i]?.x + yAxisOffset, smoothData[i]?.y);
        }

        ctx.globalAlpha = lineOpacity[activeIndex];
        ctx.stroke();

        if (progress >= 1) {
          if (shadowStartTime === null) {
            shadowStartTime = timestamp;
          }

          const shadowProgress = Math.min((timestamp - shadowStartTime) / shadowDuration, 1);

          if (shadowProgress > 0) {
            const shadowGradient = ctx.createLinearGradient(0, height, 0, height - 550);
            shadowGradient.addColorStop(1, `rgba(0, 0, 255, ${shadowProgress * 0.3})`);
            shadowGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = shadowGradient;

            ctx.beginPath();
            ctx.moveTo(smoothDataForShadow[0]?.x + yAxisOffset, height);

            for (let i = 0; i <= pointsToDraw; i++) {
              ctx.lineTo(smoothDataForShadow[i]?.x + yAxisOffset, smoothDataForShadow[i]?.y);
            }

            ctx.lineTo(width - xAxisRightOffset, smoothDataForShadow[Math.min(pointsToDraw, smoothDataForShadow.length - 1)]?.y);
            ctx.lineTo(width - xAxisRightOffset, height);
            ctx.closePath();

            ctx.globalAlpha = 1;
            ctx.fill();
          }
        }

        if (progress < 1 || shadowProgress < 1) {
          requestAnimationFrame(animateLine);
        } else {
          setIsAnimationComplete(true);
        }
      };

      const handleContainerMouseOver = () => {
        canvas.style.cursor = 'crosshair';
      };

      const handleContainerMouseLeave = () => {
        canvas.style.cursor = 'default';
        setHoveredPoint(null);
      };

      const handleContainerMouseMove = (event) => {
        if (isAnimationComplete) {
          const canvasRect = canvas.getBoundingClientRect();
          const mouseX = event.clientX - canvasRect.left;
          const mouseY = event.clientY - canvasRect.top;

          let closestIndex = null;
          let closestDistance = Number.MAX_VALUE;

          for (let i = 0; i < smoothData.length; i++) {
            const distance = Math.hypot(
              smoothData[i].x + yAxisOffset - mouseX,
              smoothData[i].y - mouseY
            );

            if (distance < closestDistance) {
              closestIndex = i;
              closestDistance = distance;
            }
          }

          const tooltipPosition = closestIndex !== null ? smoothData[closestIndex] : null;
          setHoveredPoint(tooltipPosition);

          if (tooltipPosition) {
            setTooltipX(tooltipPosition.x + yAxisOffset);
          } else {
            setTooltipX(null);
          }
        }
      };

      const handleChartClick = () => {
        setActiveIndex(activeIndex === 1 ? 2 : 1);
        setActiveData(activeIndex === 1 ? dataSecond : dataFirst);
        setLineOpacity({
          dataFirst: activeIndex === 1 ? 0.5 : 1,
          dataSecond: activeIndex === 2 ? 0.5 : 1,
        });
        setIsAnimationComplete(false);
        setShadowProgress(0);
        setHoveredPoint(null);
      };

      containerRef.current.addEventListener('mouseover', handleContainerMouseOver);
      containerRef.current.addEventListener('mouseleave', handleContainerMouseLeave);
      containerRef.current.addEventListener('mousemove', handleContainerMouseMove);
      containerRef.current.addEventListener('click', handleChartClick);

      requestAnimationFrame(animateLine);
    }
  }, [dataFirst, dataSecond, containerWidth, containerHeight, isAnimationComplete, activeData, activeIndex]);

  return (
    <div className="chart-container" style={{ width: '100%', height: '100%', flex: 'none', position: 'relative' }} ref={containerRef}>
      <canvas className="line-chart" ref={canvasRef} style={{ width: '100%', height: '92%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}></canvas>
      {hoveredPoint && isAnimationComplete && (
        <div
          className='tooltip'
          style={{
            position: 'absolute',
            top: 0,
            left: tooltipX,
            height: height - xAxisOffset,
            width: '1px',
            backgroundColor: '#ccc',
            pointerEvents: 'none',
          }}
        ></div>
      )}
      {hoveredPoint && isAnimationComplete && (
        <div
          className='tooltip'
          style={{
            position: 'absolute',
            top: hoveredPoint.y - 35,
            left: tooltipX,
            backgroundColor: 'white',
            padding: '4px 8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <div className="tooltip-content">
            <div className="tooltip-value">
              {hoveredPoint.y.toFixed(2)}
            </div>
            <div className="tooltip-label">
              {activeIndex === 1 ? 'Label 1' : 'Label 2'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomLineChart;
