import React, { Component } from 'react'
import { stack } from 'd3-shape'
import './Stack.css'



const stacked = stack()
      .keys(["Programmed", "onRoute", "Delivered", "Canceled"])

export default class Stack extends Component {
  constructor(props) {
    super(props)

      this.state = {
        current: 4,
        active: 1
      };
  }

  transformData(data){
    return stacked(data)
  }

  createRect(data, j, status, margins, color, yValue, height, scales, plusY){
    return <rect
      key={`${data.year}-${j}-${status}`}
      x={scales.xScale(data.year) + 6}
      y={yValue - plusY}
      height={(height - margins.bottom - scales.yScale(data[status]))}
      fill={color}
      width={16}
      rx={'4px'}
    />

  }

  render() {
    const { scales, data, margins, svgDimensions} = this.props
    const { xScale, yScale } = scales
    const { height } = svgDimensions
    const barData = data;

    const colors = ["#F9CF8F", "#99DFFF", "#8CECA8", "#FCAFA2"]

   const max = barData.map(el => (Number(el.Programmed) + Number(el.onRoute) + Number(el.Delivered) + Number(el.Canceled))).reduce((acc, cur) => Math.max(acc, cur), 0);

    const bars = barData.map((d, j) => {
        return <g className={('bar')}>
          <g >
            <rect
              className='rect'
              key={`${d.year}-${j}-HOVER`}
              x={xScale(d.year) - 4}
              y={yScale(max)}
              height={(height - margins.bottom - scales.yScale(max))}
              fill={'#F4F4F4'}
              width={xScale.bandwidth()+8}
            />
          </g>

          {this.createRect(d, j, 'Programmed', margins, colors[0], yScale(Number(d.Programmed)), height, scales, 0)}
          {this.createRect(d, j, 'onRoute', margins, colors[1], yScale(Number(d.onRoute)+Number(d.Programmed)), height, scales, 6)}
          {this.createRect(d, j, 'Delivered', margins, colors[2], yScale(Number(d.onRoute)+Number(d.Programmed)+Number(d.Delivered)), height, scales, 12)}
          {this.createRect(d, j, 'Canceled', margins, colors[3], yScale(Number(d.onRoute)+Number(d.Programmed)+Number(d.Delivered)+Number(d.Canceled)), height, scales, 18)}

        </g>;
        
        });
    return (
      <g>
      {bars}
      </g>
    )
  }
}
