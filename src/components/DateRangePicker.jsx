import Flatpickr from "react-flatpickr";
import React from "react";
import { CLASS_TEXTFIELD } from "../constants/Styles";
import { format, parse} from "date-fns";

export const DATE_PATTERN_SQL = "y-MM-dd HH:mm:ss";
export const DATE_PATTERN_VIEW = "dd MMM yyyy";

export const DateRangePicker = ({dateFrom, dateTo, separator, onDateChange}) => {

    const parseDate = (date) => {
        return parse(date, DATE_PATTERN_SQL, new Date());
    }

    const formatDate = (from, to) => {
        if(!from){
            return "";
        }
        const dtFromStr = format(parseDate(from), DATE_PATTERN_VIEW);
        if(!to){
            return dtFromStr;
        }
        const dtToStr = format(parseDate(to), DATE_PATTERN_VIEW);
        return `${dtFromStr} ${separator?separator: "-"} ${dtToStr}`;
    }

    return(
        <Flatpickr
            options={{
                mode: "range",
                defaultDate: (dateFrom && dateTo)? [parseDate(dateFrom), parseDate(dateTo)] : undefined,
                onChange: (dates) => {
                    const fromDate = new Date(dates[0]);
                    fromDate.setHours(0, 0, 1);
                    if (dates.length < 2) {
                        onDateChange(format(fromDate, DATE_PATTERN_SQL), null)    
                        return;
                    }
                    const toDate = new Date(dates[1]);
                    toDate.setHours(23, 59, 59);
                    onDateChange(format(fromDate, DATE_PATTERN_SQL), format(toDate, DATE_PATTERN_SQL));
                },
                dateFormat:"d/m/Y",
                locale:{
                    rangeSeparator: " s.d "
                }
            }}
            className={CLASS_TEXTFIELD}
        />
    )
}