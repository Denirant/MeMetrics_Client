import React from 'react';
import Axis from '../Axis';

export default ({ scales, maxValue, margins, svgDimensions }) => {
  const { height, width } = svgDimensions;

  const xProps = {
    orient: 'Bottom',
    scale: scales.xScale,
    translate: `translate(14, ${height - margins.bottom})`,
    tickSize: height - margins.top - margins.bottom,
  };

  const yProps = {
    orient: 'Left',
    scale: scales.yScale,
    translate: `translate(${margins.left}, 0)`,
    tickSize: width - margins.left - margins.right,
  };

  console.log(maxValue);

  return (
    <g>
      <Axis {...xProps} />
      <Axis {...yProps} maxValue={maxValue} />
    </g>
  );
};
