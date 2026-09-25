import React from "react";
import { useState } from 'react';
import { months, yearList } from "../constants/Entities";
import { SelectSimple } from "./SelectSimple";
export const MonthPicker = ({month, year, onMonthChange, onYearChange}) => {
    const [years] = useState(yearList());
    return(
        <div className="flex items-center">
            <div className="flex-grow mr-2">
                <SelectSimple unclearable
                    onChange={(obj)=>onMonthChange(obj.value)}
                    selected={
                        month? months.find(m => m.value === month ) :
                        months.find(m => parseInt(m.value) === ((new Date()).getMonth() + 1)) 
                    }
                    options={months}
                />
            </div>
            <div className="flex-grow mr-2">
                <SelectSimple unclearable
                    onChange={(obj)=>onYearChange(obj.value)}
                    selected={
                        year? years.find(y => y.value === year ) :
                        years.find(y => parseInt(y.value) === (new Date()).getFullYear()) 
                    }
                    options={years}
                />
            </div>
        </div>
    )
}