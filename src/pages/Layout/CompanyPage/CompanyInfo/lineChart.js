import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { addDays, format } from "date-fns";


const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Генерация массива с 50 значениями
let Data = Array.from({ length: 31 }, (_, index) => {
  const date = 20231201 + index; // Увеличиваем дату на каждой итерации
  const impressions = getRandomNumber(10, 40);
  return { date, impressions };
});


// *********************************************************************
// Data.date must be provided in ASC order (ascending, oldest to newest)
// *********************************************************************
const LineChart = ({ data_type = 'impressions' }) => {
  // Element References
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const svgContainer = useRef(null); // The PARENT of the SVG 

  console.log(Data)

  // State to track width and height of SVG Container
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();

  // This function calculates width and height of the container
  const getSvgContainerSize = () => {
    const newWidth = svgContainer.current.clientWidth;
    setWidth(newWidth);

    const newHeight = svgContainer.current.clientHeight;
    setHeight(newHeight);
  };

  useEffect(() => {
    // detect 'width' and 'height' on render
    getSvgContainerSize();
    // listen for resize changes, and detect dimensions again when they change
    window.addEventListener("resize", getSvgContainerSize);
    // cleanup event listener
    return () => window.removeEventListener("resize", getSvgContainerSize);
  }, []);

  useEffect(() => {
    // D3 Code

    // data_type variables switch
    let xAccessor;
    let yAccessor;
    let yAxisLabel;
    let parseDate;

    // variable accessor depending on datatype
    switch (data_type) {
      case "test":
        parseDate = d3.timeParse("%Y%m%d");
        xAccessor = (d) => parseDate(d.date);
        yAccessor = (d) => d.impressions;
        yAxisLabel = "Test Label";
        break;
      case "impressions":
        parseDate = d3.timeParse("%Y%m%d");
        xAccessor = (d) => parseDate(d.date);
        yAccessor = (d) => d.impressions;
        yAxisLabel = "";
        break;
      default:
        throw new Error(`${data_type} is an unknown data_type prop`);
    }

    // Dimensions
    let dimensions = {
      width: width, // width from state
      height: height, // height from state
      margins: 50,
    };

    dimensions.containerWidth = dimensions.width - 50;
    dimensions.containerHeight = dimensions.height - 40;

    // Selections
    const svg = d3
      .select(svgRef.current)
      .classed("line-chart-svg", true)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    // clear all previous content on refresh
    const everything = svg.selectAll("*");
    everything.remove();

    const container = svg
      .append("g")
      .classed("container", true)
      .attr("transform", `translate(${20}, ${20})`);

    const tooltip = d3.select(tooltipRef.current);
    const tooltipDot = container
      .append("circle")
      .classed("tool-tip-dot", true)
      .attr("r", 6)
      .attr("fill", "#4876F9")
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .style("opacity", 0)
      .style("pointer-events", "none");

      const tooltipDotBorder = container
      .append("circle")
      .classed("tool-tip-dot", true)
      .attr("r", 9)
      .attr('fill', 'none')
      .attr('stroke', '#7093F9')
      .attr("stroke-width", 5)
      .style("opacity", 0)
      .style("pointer-events", "none");


    // Scales
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(Data, yAccessor)])
      .range([dimensions.containerHeight, 0])
      .nice();
    const xScale = d3.scaleTime().domain(d3.extent(Data, xAccessor)).range([0, dimensions.containerWidth]);

    // Line Generator
    const lineGenerator = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)))
      .curve(d3.curveBumpX)

    // Axis
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => `${d}`)
    const yAxisGroup = container.append("g").classed("yAxis", true).call(yAxis).call(g => g.select(".domain").remove()).call(g => g.select(".yAxis text").remove()).call(g => g.selectAll(".tick line").remove());;
    const xAxis = d3.axisBottom(xScale);

    container
      .append("g")
      .classed("xAxis", true)
      .style("transform", `translateY(${dimensions.containerHeight}px)`)
      .call(xAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").remove())


    const trackerLine = container
  .append("line")
  .classed("tracker-line", true)
  .attr("x1", 0)
  .attr("x2", 0)
  .attr("y1", 0)
  .attr("y2", dimensions.containerHeight)
  .style("stroke", "#4876F9")
  .style("stroke-width", 1)
  .style("stroke-dasharray", "5.5")
  .style("opacity", 0);

  // Tiks
  const yTicks = yAxisGroup.selectAll(".tick");

  yTicks.each(function (d, i) {
    const tick = d3.select(this);
    const tickY = parseFloat(tick.attr("transform").split(",")[1].slice(0, -1));

    // Убираем линии и значения на минимальном значении
    if (i > 0) {
      container
        .append("line")
        .attr("x1", 0)
        .attr("x2", dimensions.containerWidth)
        .attr("y2", tickY)
        .attr("y1", tickY)
        .style("stroke", "#ccc") // Цвет линии
        .style("stroke-dasharray", "13 5"); // Пунктирный стиль
    }
  });

  /* Area */
  const areaGenerator = d3
        .area()
        .x((d) => xScale(xAccessor(d)))
        .y1((d) => yScale(yAccessor(d)))
        .y0(dimensions.height)
        .curve(d3.curveBumpX);

        const area = container.append('path').datum(Data).attr('d', areaGenerator);

        const gradient = container
        .append('linearGradient')
        .attr('id', 'area-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', dimensions.height)
        .attr('x2', 0)
        .attr('y2', 20);

  gradient
    .selectAll('stop')
    .data([
      { offset: '30%', color: '#CFDFF700' },
      { offset: '100%', color: '#CFDFF7' },
    ])
    .enter()
          .append('stop')
          .attr('offset', (d) => d.offset)
          .attr('stop-color', (d) => d.color);

          area.attr('fill', 'url(#area-gradient)');

  // Draw Line
  container
  .append("path")
  .datum(Data)
  .attr("d", lineGenerator)
  .attr("fill", "none")
  .attr("stroke", "#4876F9")
  .attr("stroke-width", 6)
  .attr('stroke-linejoin', 'round')
  .attr('stroke-linecap', 'round')


  

    // Tooltip
    container
      .append("rect")
      .classed("mouse-tracker", true)
      .attr("width", dimensions.containerWidth)
      .attr("height", dimensions.containerHeight)
      .style("opacity", 0)
      .on("touchmouse mousemove", function (event) {
        const mousePos = d3.pointer(event, this);

        // x coordinate stored in mousePos index 0
        const date = xScale.invert(mousePos[0]);

        // Custom Bisector - left, center, right
        const dateBisector = d3.bisector(xAccessor).center;

        const bisectionIndex = dateBisector(Data, date);
        //console.log(bisectionIndex);
        // math.max prevents negative index reference error
        const hoveredIndexData = Data[Math.max(0, bisectionIndex)];

        // Update Image
        tooltipDot
          .style("opacity", 1)
          .attr("cx", xScale(xAccessor(hoveredIndexData)))
          .attr("cy", yScale(yAccessor(hoveredIndexData)))
          .raise();

        tooltipDotBorder
            .style("opacity", 1)
            .attr("cx", xScale(xAccessor(hoveredIndexData)))
            .attr("cy", yScale(yAccessor(hoveredIndexData)))
            .raise();

        tooltip
          .style("display", "block")
          .style("top", `${yScale(yAccessor(hoveredIndexData)) - 50}px`)
          .style("left", `${xScale(xAccessor(hoveredIndexData))}px`);

        tooltip.select(".data").text(`${yAccessor(hoveredIndexData)}`);

        const dateFormatter = d3.timeFormat("%B %-d, %Y");

        tooltip.select(".date").text(`${dateFormatter(xAccessor(hoveredIndexData))}`);

        trackerLine
      .attr("x1", xScale(xAccessor(hoveredIndexData)))
      .attr("x2", xScale(xAccessor(hoveredIndexData)))
      .attr("y1", 0)
      .attr("y2", dimensions.containerHeight)
      .style("opacity", 1);

    })
      .on("mouseleave", function () {
        tooltipDot.style("opacity", 0);
        tooltip.style("display", "none");
        tooltipDotBorder.style("display", "none");
      });

      
  }, [Data, data_type, width, height]); // redraw chart if data or dimensions change

  return (
    <div ref={svgContainer} className="line-chart">
      <svg ref={svgRef} />
      <div ref={tooltipRef} className="lc-tooltip">
        <div className="data"></div>
        <div className="date"></div>
      </div>
    </div>
  );
};

export default LineChart;