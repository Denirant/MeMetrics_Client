import React, { Component } from 'react';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { stack } from 'd3-shape';
import Axes from './Axes';
import Stack from './Stacked';

class ChartStacked extends Component {
  constructor() {
    super();
    this.xScale = scaleBand();
    this.yScale = scaleLinear();
    this.state = {
      svgDimensions: {
        width: 800,
        height: 600
      }
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    // Get the container size and update the state
    const container = this.chartContainer;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.setState({
      svgDimensions: { width, height }
    });
  };

  render() {
    var barData = [
      { year: "2006", Programmed: "10", onRoute: "15", Delivered: "9", Canceled: "6" },
      { year: "2007", Programmed: "12", onRoute: "18", Delivered: "9", Canceled: "4" },
      { year: "2008", Programmed: "05", onRoute: "20", Delivered: "8", Canceled: "2" },
      { year: "2009", Programmed: "01", onRoute: "15", Delivered: "5", Canceled: "4" },
      { year: "2010", Programmed: "02", onRoute: "10", Delivered: "4", Canceled: "2" },
      { year: "2011", Programmed: "03", onRoute: "12", Delivered: "6", Canceled: "3" },
      { year: "2012", Programmed: "04", onRoute: "15", Delivered: "8", Canceled: "1" },
      { year: "2013", Programmed: "06", onRoute: "11", Delivered: "9", Canceled: "4" },
      { year: "2014", Programmed: "10", onRoute: "13", Delivered: "9", Canceled: "5" },
      { year: "2015", Programmed: "16", onRoute: "19", Delivered: "6", Canceled: "9" },
      { year: "2016", Programmed: "19", onRoute: "17", Delivered: "5", Canceled: "7" },
    ];
    const stacked = stack().keys(["Programmed", "onRoute", "Delivered", "Canceled"]);
    const stackedData = stacked(barData);
    const xDomain = barData.map(d => d.year);

    const { svgDimensions } = this.state;
    const margins = { top: 20, right: 20, bottom: 40, left: 40 };
    let maxValue = Math.max(...stackedData[stackedData.length - 1].map(array => array[1]));

    const xScale = this.xScale
      .padding(0.5)
      .domain(xDomain)
      .rangeRound([margins.left, svgDimensions.width - margins.right], 0.02);

    const yScale = this.yScale
      .domain([0, Math.ceil(maxValue * 1.03)])
      .range([svgDimensions.height - margins.bottom, margins.top]);

    return (
      <div
        className="teste"
        style={{ width: '100%', height: 'calc(100% - 24px)' }}
        ref={el => (this.chartContainer = el)}
      >
        <svg width={svgDimensions.width} height={svgDimensions.height}>
          <Axes
            scales={{ xScale, yScale }}
            maxValue={maxValue}
            margins={margins}
            svgDimensions={svgDimensions}
          />
          <Stack
            scales={{ xScale, yScale }}
            margins={margins}
            data={barData}
            maxValue={maxValue}
            svgDimensions={svgDimensions}
          />
        </svg>
      </div>
    );
  }
}

export default ChartStacked;