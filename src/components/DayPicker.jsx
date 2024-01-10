import { useState } from 'react';
import { format } from 'date-fns';

import { convertDateFromString } from '../utils/date';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function DayPickerSimple({handleDaySelect, selectedArg = null}) {
  const [selected, setSelected] = useState(convertDateFromString(selectedArg) ?? '');

  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={(e) => {
        if(e){
          setSelected(e);
          handleDaySelect(e)
        }
      }}
      captionLayout="dropdown-buttons"
      fromYear={1970} 
      toYear={2024}
      showOutsideDays
      ISOWeek
    />
  );
}