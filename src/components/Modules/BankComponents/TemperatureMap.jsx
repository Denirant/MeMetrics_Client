import React, { useState } from 'react';

function HeatmapCalendar({ dataProp }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const sums = dataProp.map((item) => item.values.reduce((acc, val) => acc + val, 0));
  const max = Math.max(...sums);
  const min = Math.min(...sums);

  const getMonthData = () => {
    const year = selectedYear;
    const month = selectedMonth;
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const dataMap = new Map(dataProp.map((item) => [item.date, item.values]));

    const data = [];
    let currentWeek = [];

    if (firstDayOfMonth.getDay() !== 1) {
      const prevMonthLastDay = new Date(year, month, 0);
      const daysToAdd = firstDayOfMonth.getDay() - 1;

      for (let i = daysToAdd; i >= 1; i--) {
        const day = prevMonthLastDay.getDate() - i + 1;
        let cellClass = 'calendar-day prev-month';

        currentWeek.push(
          <div key={`prev-${day}`} className={cellClass}>
            {day}
          </div>
        );
      }
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const currentDay = new Date(year, month, day);
      const dateString = getDateString(currentDay);
      const isActiveCell = dataMap.has(dateString);
      const cellValues = dataMap.get(dateString);
      let cellClass = 'calendar-day current-month';

      if (isActiveCell) {
        const sum = cellValues.reduce((acc, val) => acc + val, 0);
        const percentage = (sum - min) / (max - min);

        if (percentage >= 0 && percentage < 0.125) {
          cellClass += ' active_cell grade_1';
        } else if (percentage >= 0.125 && percentage < 0.25) {
          cellClass += ' active_cell grade_2';
        } else if (percentage >= 0.25 && percentage < 0.375) {
          cellClass += ' active_cell grade_3';
        } else if (percentage >= 0.375 && percentage < 0.5) {
          cellClass += ' active_cell grade_4';
        } else if (percentage >= 0.5 && percentage < 0.625) {
          cellClass += ' active_cell grade_5';
        } else if (percentage >= 0.625 && percentage < 0.75) {
          cellClass += ' active_cell grade_6';
        } else if (percentage >= 0.75 && percentage < 0.875) {
          cellClass += ' active_cell grade_7';
        } else {
          cellClass += ' active_cell grade_8';
        }
        
      }

      currentWeek.push(
        <div key={`current-${day}`} className={cellClass}>
          {day}
        </div>
      );

      if (currentWeek.length === 7) {
        data.push(currentWeek);
        currentWeek = [];
      }
    }

    let nextMonthDay = 1;

    if (currentWeek.length > 0) {
      for (let i = currentWeek.length; i < 7; i++) {
        let cellClass = 'calendar-day next-month';

        currentWeek.push(
          <div key={`next-month-${nextMonthDay}`} className={cellClass}>
            {nextMonthDay}
          </div>
        );
        nextMonthDay++;
      }

      data.push(currentWeek);
    }

    if (data.length === 5) {
      currentWeek = [];
      for (let i = nextMonthDay; i < nextMonthDay + 7; i++) {
        let cellClass = 'calendar-day next-month';

        currentWeek.push(
          <div key={`next-month-${i}`} className={cellClass}>
            {i}
          </div>
        );
      }

      data.push(currentWeek);
    }

    return data;
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    setSelectedMonth(newDate.getMonth());
    setSelectedYear(newDate.getFullYear());
  };

  const monthName = currentDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' });

  const getDateString = (date, day) => {
    const dayStr = (day || date.getDate()).toString().padStart(2, '0');
    const monthStr = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${dayStr}.${monthStr}.${date.getFullYear()}`;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          <option value={0}>Январь</option>
          <option value={1}>Февраль</option>
          <option value={2}>Март</option>
          <option value={3}>Апрель</option>
          <option value={4}>Май</option>
          <option value={5}>Июнь</option>
          <option value={6}>Июль</option>
          <option value={7}>Август</option>
          <option value={8}>Сентябрь</option>
          <option value={9}>Октябрь</option>
          <option value={10}>Ноябрь</option>
          <option value={11}>Декабрь</option>
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {Array.from({ length: new Date().getFullYear() - 2019 }, (_, index) => (
            <option key={index} value={2020 + index}>
              {2020 + index}
            </option>
          ))}
        </select>
        <div className='heatmap_control'>
          <button onClick={prevMonth}></button>
          <button onClick={nextMonth}></button>
        </div>
      </div>
      <div className="calendar-grid">
        <div className="calendar-week">
          <div className="calendar-day">Mo</div>
          <div className="calendar-day">Tu</div>
          <div className="calendar-day">We</div>
          <div className="calendar-day">Th</div>
          <div className="calendar-day">Fri</div>
          <div className="calendar-day">Sa</div>
          <div className="calendar-day">Su</div>
        </div>
        {getMonthData().map((week, index) => (
          <div key={index} className="calendar-week">
            {week}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeatmapCalendar;
