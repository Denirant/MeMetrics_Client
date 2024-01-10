import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import events from './events';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import './style.css'
import { useSelector } from 'react-redux';
import { ShortConvertDateToString } from '../../utils/date';

moment.updateLocale('en', { week: { dow: 1 } });

const localizer = momentLocalizer(moment);

const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToToday = () => {
    toolbar.onNavigate('TODAY');
  };

  const changeView = (view) => {
    toolbar.onViewChange(view);
  };

  return (
    <div className="custom-toolbar">
      <div className="custom-toolbar-section">
        <button onClick={goToBack} className='back'></button>
        <span>{toolbar.label}</span>
        <button onClick={goToNext} className='forward'></button>
      </div>
      <div className="custom-toolbar-section">
        <button className='today' onClick={goToToday}>Today</button>
      </div>
    </div>
  );
};

const CustomWeekHeader = ({ date }) => {
  const weekNumber = moment(date).isoWeek();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>{weekNumber}</div>
    </div>
  );
};

const CustomWeekNumber = ({ date }) => {
  const weekNumber = moment(date).isoWeek();
  return (
    <div style={{ margin: '5px 0', textAlign: 'center' }}>
      {weekNumber}
    </div>
  );
};

export default function ReactBigCalendar({handleShowActivity, eventList, handleEditByCalendar}) {

  const eventData = useSelector(state => state.todo).tasks

  // const formattedEvents = ;
  

  return (
    <Calendar
      views={['month']}
      selectable
      localizer={localizer}
      defaultDate={new Date()}
      defaultView="month"
      events={eventData.map(event => ({...event, title: event.title + ` - ${ShortConvertDateToString(event.start)}-${ShortConvertDateToString(event.end)}`}))}
      style={{ height: '100%' }}
      onSelectEvent={handleEditByCalendar}
      // onSelectSlot={handleSelect}
      components={{
        toolbar: CustomToolbar,
        week: {
          header: CustomWeekHeader,
          number: CustomWeekNumber,
        },
      }}
      formats={{
        dayFormat: (date, culture, localizer) =>
          localizer.format(date, 'ddd D', culture),
      }}
    />
  );
}


