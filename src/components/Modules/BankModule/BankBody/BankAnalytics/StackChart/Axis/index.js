import React, { Component } from 'react'
import * as d3Axis from 'd3-axis'
import { select as d3Select } from 'd3-selection'

import './Axis.css'

export default class Axis extends Component {
  componentDidMount() {
    this.renderAxis()
  }

  componentDidUpdate() {
    this.renderAxis()
  }
  
  getTickValues(maxValue){
    console.log(maxValue)
    return [...Array(5).keys()].map(i => i * (maxValue/4))
  }

  renderAxis() {
    const axisType = `axis${this.props.orient}`
    let axis = d3Axis[axisType]()
      .scale(this.props.scale)
      .tickArguments([5,"s"])
      .tickPadding([20])
    
    if (this.props.orient === 'Left'){
      const values = this.getTickValues(this.props.maxValue)
      axis = axis.tickSizeInner(-this.props.tickSize)
      axis.tickValues(values)
      console.log(values)
    }

    d3Select(this.axisElement).call(axis);
  }

  render() {
    return (
      <g
        className={`Axis Axis-${this.props.orient}`}
        ref={(el) => { this.axisElement = el; }}
        transform={this.props.translate}
      />
    )
  }
}
