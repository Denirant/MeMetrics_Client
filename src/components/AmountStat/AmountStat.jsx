import React from 'react';
import ArrowStatUp from '../../assets/img/StatInfo/Arrow up.svg';
import ArrowStatDown from '../../assets/img/StatInfo/Arrow down.svg';

import './AmountStat.css';

function determiningDirection(current, past){
    return current >= past;
}

function formatNumberWithCommas(number) {
    const parts = number.toFixed(2).toString().split('.');
    const integerPartWithCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedNumber = parts.length > 1 ? `${integerPartWithCommas}.${parts[1]}` : integerPartWithCommas;
    return formattedNumber;
}

function calculatePercentageChange(currentValue, previousValue) {
    if (previousValue === 0) {
        return Infinity;
    }
    
    const difference = currentValue - previousValue;
    const percentageChange = (difference / Math.abs(previousValue)) * 100;
    const sign = percentageChange > 0 ? '+' : percentageChange < 0 ? '-' : '';
    
    return sign + Math.abs(percentageChange).toFixed(2) + '%';
}

function AmountStat({titleValue, currentValue, prevValue, prefixValue, imageWidth, imageHeight, titleStyle, currentStyle, percentStyle }) {
  return (
    <div className='amountAnalytic'>
      <h2 className='amountAnalytic_title' style={titleStyle}>{titleValue}</h2>
      <div className='amountAnalytic_content'>
        <p className='amountAnalytic_content--main' style={currentStyle}>{prefixValue}{formatNumberWithCommas(currentValue)}</p>
        <p style={percentStyle} className={`amountAnalytic_content--value ${(calculatePercentageChange(currentValue, prevValue)[0] === '-') ? 'negative' : 'positive'}`}>
            <img width={imageWidth} height={imageHeight} src={(determiningDirection(currentValue, prevValue)) ? ArrowStatUp : ArrowStatDown} alt="stat_info" />
            {calculatePercentageChange(currentValue, prevValue)}
        </p>
      </div>
    </div>
  )
}

export default AmountStat
