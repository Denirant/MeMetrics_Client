import React from 'react';
import { Checkbox, CheckboxGroup } from 'rsuite';

import './style.css'

const CheckboxPicker = ({array, valueChange}) => {
    const [value, setValue] = React.useState([array[0]]);

    const data = array;

    const handleCheckAll = (value, checked) => setValue(checked ? data : []);
    const handleChange = value => {
        setValue(value);
        valueChange(value);
    }

    const checkStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'flex-start'
    }

    return (
        <div style={checkStyle}>
        <div className="checkBoxAll">
            <Checkbox
                
                indeterminate={value.length > 0 && value.length < data.length}
                checked={value.length === data.length}
                onChange={handleCheckAll}
            >
                All
            </Checkbox>
        </div>

        <CheckboxGroup name="checkboxList" value={value} onChange={handleChange}>
            {data.map(item => (
            <Checkbox key={item} value={item}>
                {item}
            </Checkbox>
            ))}
        </CheckboxGroup>
        </div>
    );
};

export default CheckboxPicker;