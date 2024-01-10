import React from 'react';
import types from '../_types';

const Fill = ({ fillBelow, path, calcHeight }) => {
  if (!path) {
    return null;
  }

  const fillAbove = "#FFFFFF00";
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg>
      <defs>
        {/* Определите линейный градиент вне элемента <path> */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={fillBelow} />
          <stop offset="90%" stopColor={fillAbove} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        stroke="none"
        d={`M0,0${path} V${calcHeight} H0 Z`}
      />
    </svg>
  );
};

Fill.propTypes = {
  fillBelow: types.fillBelow.isRequired,
  calcHeight: types.calcHeight.isRequired,
  path: types.path.isRequired,
};

export default Fill;