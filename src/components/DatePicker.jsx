import Flatpickr from "react-flatpickr";
import React,{useEffect, useRef} from "react";
import { CLASS_TEXTFIELD } from "../constants/Styles";
import { format, parse } from "date-fns";

export const DatePicker = ({dateValue, onDateChange}) => {
    return(
        <Flatpickr
            options={{
                altInput: true,
                altFormat: "j F Y",
                dateFormat: "dd/mmm/Y",
                defaultDate: dateValue? parse(dateValue, "MM/dd/y", new Date()) : undefined,
                onChange:(dates)=>{
                    onDateChange(format(new Date(dates[0]), "MM/dd/y"));
                }
            }}
            className={CLASS_TEXTFIELD}
        />
    )
}