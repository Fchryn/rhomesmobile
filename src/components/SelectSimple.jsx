import React from "react";
import Select from "react-select";
export const SelectSimple = ({options, selected, onChange, unclearable, placeholder, menuPlacement, disabled})=>{
    const handleChange = (evt) => {
        if(!evt){
            onChange({label:null, value:null});
        }else{
            onChange(evt);
        }
    }
    return (
        <Select options={options}
            styles={{
                control: (base) => ({
                    ...base,
                    borderWidth: "1px",
                    borderRadius:"0.5rem",  
                    cursor: "text",
                    boxShadow:0,
                    borderColor: "rgb(209, 213, 219)",
                    padding: "0.4rem 0"
                })
            }}
            value={selected}
            onChange={handleChange}
            isClearable={!unclearable}
            placeholder={placeholder}
            menuPlacement={menuPlacement}
            isDisabled={disabled}
        />
    )
}