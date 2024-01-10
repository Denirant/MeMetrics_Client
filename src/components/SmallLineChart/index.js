import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './style.css';

const WeeklyDownloadsChart = ({ isDrop = false, id, isMenu=true, handleHover = null, handleBlur = null}) => {


  useEffect(() => {
    const dimensions = {
      width: 300,
      height: 100,
      marginTop: 8,
    };

    const xAccessor = (d) => d.date;
    const yAccessor = (d) => d.downloads;

    const formatDate = d3.timeFormat('%Y-%m-%d');

    const getText = (data, d) => {
      const to = xAccessor(d);
      const from = d3.timeDay.offset(to, -7);

      return `${formatDate(from)} to ${formatDate(to)}`;
    };

    const draw = (data) => {
      const wrapper = d3.select(`[data-wrapper="${id}"]`);

      const chartWidthPercentage = isMenu ? 90 : 100; // Ширина графика в процентах
      const labelsWidthPercentage = isMenu ? 10 : 0; // Ширина лейблов в процентах
      const gapWidth = isMenu ? 8 : 0; // Отступ между графиком и лейблами

      const chartWidth = (dimensions.width * (chartWidthPercentage / 100)) - gapWidth;
      const labelsWidth = dimensions.width * (labelsWidthPercentage / 100);

      const svgContainer = wrapper
  .select(`[data-chart="${id}"]`)
  .append('svg')
  .attr('width', `${chartWidth + labelsWidth + gapWidth}%`)
  .attr('height', '100%')
  .attr('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);

      const labelsSvg = svgContainer.append('g').attr('class', 'labels-svg');
      const chartSvg = svgContainer.append('g').attr('class', 'chart-svg');

      if(isMenu){
        chartSvg.attr('transform', `translate(${labelsWidth + gapWidth}, 0)`);
        labelsSvg.attr('transform', `translate(${- chartWidth - gapWidth}, 0)`);
      }else{
        chartSvg.attr('transform', `translate(${0}, 0)`);
        labelsSvg.attr('transform', `translate(${0}, 0)`);
      }



      const xDomain = d3.extent(data, xAccessor);
      const yDomain = [0, d3.max(data, yAccessor)];

      const xScale = d3.scaleTime().domain(xDomain).range([0, chartWidth]);

      const yScale = d3.scaleLinear().domain(yDomain).range([dimensions.height, dimensions.marginTop]);

      /* Area */
      const areaGenerator = d3
        .area()
        .x((d) => xScale(xAccessor(d)))
        .y1((d) => yScale(yAccessor(d)))
        .y0(dimensions.height)
        .curve(d3.curveBumpX);

      const area = chartSvg.append('path').datum(data).attr('d', areaGenerator);

      const gradient = chartSvg
        .append('linearGradient')
        .attr('id', 'area-gradient' + id)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', dimensions.height)
        .attr('x2', 0)
        .attr('y2', dimensions.marginTop);

      if (!isDrop) {
        gradient
          .selectAll('stop')
          .data([
            { offset: '30%', color: '#2EBDAB00' },
            { offset: '100%', color: '#2EBDAB66' },
          ])
          .enter()
          .append('stop')
          .attr('offset', (d) => d.offset)
          .attr('stop-color', (d) => d.color);
      } else {
        gradient
          .selectAll('stop')
          .data([
            { offset: '30%', color: '#FDEDED00' },
            { offset: '100%', color: '#FDEDED' },
          ])
          .enter()
          .append('stop')
          .attr('offset', (d) => d.offset)
          .attr('stop-color', (d) => d.color);
      }

      area.attr('fill', 'url(#area-gradient' + id + ')');

      /* Line */
      const lineGenerator = d3
        .line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor(d)))
        .curve(d3.curveBumpX);

        const line = chartSvg
        .append('path')
        .datum(data)
        .attr('d', lineGenerator)
        .attr('stroke', !isDrop ? '#2EBDAB' : '#DB371F')
        .attr('stroke-width', 5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('fill', 'none');
      

      /* Markers */
      const markerLine = chartSvg
        .append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', dimensions.height)
        .attr('stroke-width', 2)
        .attr('stroke', `var(--marker, ${!isDrop ? '#2EBDAB' : '#DB371F'})`)
        .attr('opacity', 0)
        .attr('stroke-dasharray', '7,5');

      const markerDot = chartSvg
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 8)
        .attr('fill', `var(--marker, ${!isDrop ? '#2EBDAB' : '#DB371F'})`)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('opacity', 0);

      const markerDotBackground = chartSvg
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 8 + 2)
        .attr('fill', 'none')
        .attr('stroke', !isDrop ? '#2EBDAB66' : '#FDEDED')
        .attr('stroke-width', 4)
        .attr('opacity', 0);


        const stripes = chartSvg
        .append('g')
        .attr('class', 'stripes')
        .selectAll('.stripe')
        .data(yScale.ticks(5))
        .enter()
        .append('line')
        .attr('class', 'stripe')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', (d) => yScale(d))
        .attr('y2', (d) => yScale(d))
        .attr('stroke', 'rgba(0, 0, 0, 0.1)')
        .attr('stroke-dasharray', '5,5');
      

        if(isMenu){
          const labels = labelsSvg
          .append('g')
          .attr('class', 'labels')
          .selectAll('.label')
          .data(yScale.ticks(5))
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', chartWidth + gapWidth)
          .attr('y', (d) => yScale(d))
          .attr('dy', '0.35em')
          .style('text-anchor', 'start')
          .text((d) => d);
        }
      

      const bisect = d3.bisector(xAccessor);

      svgContainer.on('mousemove', (e) => {
        const [posX, posY] = d3.pointer(e);
        const date = xScale.invert(posX - labelsWidth - gapWidth); // Adjusting for the transformed coordinates
      
        const index = bisect.center(data, date);
        const d = data[index];
      
        const x = xScale(xAccessor(d)); // Adjusting for the transformed coordinates
        const y = yScale(yAccessor(d));
      
        markerLine.attr('x1', x).attr('x2', x).attr('opacity', 1);
        markerDot.attr('cx', x).attr('cy', y).attr('opacity', 1);
        markerDotBackground.attr('cx', x).attr('cy', y).attr('opacity', 1);
      
        d3.select('[data-heading]').text(getText(data, d));
        d3.select('[data-total]').text(yAccessor(d));

        if(handleHover){
          // console.log(d.downloads)
          const value = d.downloads;
          handleHover(value, id)
        }
      });
      
      svgContainer.on('mouseleave', () => {
        const lastDatum = data[data.length - 1];
      
        markerLine.attr('opacity', 0);
        markerDot.attr('opacity', 0);
        markerDotBackground.attr('opacity', 0);
      
        d3.select('[data-heading]').text('Weekly downloads');
        d3.select('[data-total]').text(yAccessor(lastDatum));

        if(handleBlur){
          handleBlur(id)
        }
      });
      
    };

    const sortData = (data) => {
      return data.map((d) => {
        return {
          ...d,
          date: new Date(d.date),
        };
      }).sort((a, b) => d3.ascending(a.date, b.date));
    };

    d3.json('https://api.npoint.io/9f3edee2d00c8ade835c')
      .then((data) => {
        const sortedData = sortData(data);
        draw(sortedData);
      })
      .catch((error) => console.log(error));

    const inputs = d3.selectAll('input[type="radio"]');

    const colors = inputs.nodes().map((input) => {
      return input.value;
    });

    d3.select('.controls-list').on('click', (e) => {
      const { value, checked } = e.target;

      if (!value || !checked) return;

      document.body.classList.remove(...colors);
      document.body.classList.add(value);
    });
  }, []);

  return (
    <div className='small-linechart'>
      <div className="chart-wrapper" data-wrapper={id}>
        {/* <h3 data-heading>Weekly downloads</h3>
        <div className="chart-info">
          <p data-total>200,000</p>
        </div> */}
        <figure data-chart={id}></figure>
      </div>
    </div>
  );
};

export default WeeklyDownloadsChart;
