import React from "react";
import Cleave from 'cleave.js/react';
import { CLASS_TEXTFIELD } from "../constants/Styles";
import { formatPhone } from "../helper/Formatter";

export const PhoneInput = ({value, onChange})=>{
    return (
        <Cleave 
            options={{
                phone: true,
                phoneRegionCode: "ID",
                prefix: "+62",
                delimiter: ""
            }}
            className={CLASS_TEXTFIELD}
            value={formatPhone(value)}
            onChange={onChange}
        />
    )
}