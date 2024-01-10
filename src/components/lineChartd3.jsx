import React from 'react';
// import {LineChartTime} from '@hh.ru/react-d3-chart-graphs';
import {timeFormat} from 'd3-time-format';

import LineChartTime from './LineChartTime';

const items = [
    {
        title: 'First',
        values: [
            {
                title: 'First bar',
                date: 'Fri, 30 Jun 2017 00:00:00 GMT',
                value: 0.04918032786885246,
            },
            {
                title: 'Second bar',
                date: 'Mon, 31 Jul 2017 00:00:00 GMT',
                value: 0.1111111111111111,
            },
            {
                title: 'Third bar',
                date: 'Thu, 31 Aug 2017 00:00:00 GMT',
                value: 0.05970149253731343,
            },
            {
                title: 'Four bar',
                date: 'Sat, 30 Sep 2017 00:00:00 GMT',
                value: 0.09615384615384616,
            },
            {
                title: 'Five bar',
                date: 'Thu, 30 Nov 2017 00:00:00 GMT',
                value: 0.12962962962962962,
            },
        ],
    },
];


const stackColors = {
    First: {
        color: '#607D8B',
        legend: 'some line 1',
    },
    Second: {
        color: '#4CAF50',
        legend: 'some line 2',
    },
};

const axesProps = {
    legend: {
        xAxis: '',
        yAxis: '',
    },
    padding: {
        xAxis: 0,
        yAxis: 20,
    },
    ticksCount: {
        xAxis: items[0].values.length
    },
    tickFormat: {
        xAxis: timeFormat('%d %B %y'),
    },
};

function LineChartCustom () {
    const handleBarHover = (item) => {
        console.log('hovered', item);
    };

    return (
        <LineChartTime
            axesProps={axesProps}
            data={items}
            stackColors={stackColors}
            handleCircleHover={handleBarHover}
            paddingMultiplier={0.24} />
    );
};

export default LineChartCustom;
