import React from "react";
import { Radio, RadioGroup } from 'rsuite';

const RadioPicker = ({text, handleChange, data}) => {

    const styles = {
        radioGroupLabel: {
          padding: '8px 2px 8px 10px',
          display: 'inline-block',
          verticalAlign: 'middle'
        }
    };
    
    return (
        <div>
            <RadioGroup name="radioList" onChange={(event) => handleChange(event)} inline appearance="picker" defaultValue={data[0].value}>
                <span style={styles.radioGroupLabel}>{text}: </span>
                {data.map((el, index) => <Radio key={`radioType${index}`} value={el.value} disabled={el.disabled}>{el.value}</Radio>)}
            </RadioGroup>
        </div>
    )
}

export default RadioPicker;