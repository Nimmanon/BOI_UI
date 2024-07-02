import { useState, useEffect } from "react";
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = (props) => {
    const {
        placeholder,
        format,
        value,
        error,
        required = false,
        readOnly = false,
        onChange,
        showLabel = false,
        label = ""
    } = props;

    const [dateSelected, setDateSelected] = useState();

    useEffect(() => {
        //console.log('value=> ',value);
        setDateSelected(value);
    }, [value]);

    // useEffect(() => {
    //     console.log('error=> ',error);       
    // }, [error]);

    const setDate = value => {
        setDateSelected(value);
        onChange(value);
    }

    return (
        <>
            {showLabel && (
                <label>&nbsp;{`${label} ${required ? "*" : ""}`}</label>
            )}
            <ReactDatePicker
                showIcon
                selected={dateSelected}
                onChange={(date) => setDate(date)}
                isClearable
                dateFormat={format}
                wrapperClassName='date_picker full-width'
                className={`form-control ${error ? 'is-invalid' : ''} ${readOnly ? 'readOnly' : 'bg-yellow-100'}`}
                placeholderText={placeholder}
                required={required}
            />
        </>
    )
};

export default DatePicker;