import React from "react";
import AsyncSelect from "react-select/async";

export const SelectAsync = ({selected, onChange, onLoad, placeholder, disabled})=>{

    const callbackOptions = (inputValue, callback) => {
        onLoad({
            keyword: inputValue,
            onLoaded: (result)=>{
                callback(result);
            }
        });
    };

    const handleChange = (evt) => {
        if(!evt){
            onChange({label:null, value:null});
        }else{
            onChange(evt);
        }
    }
    
    return (
        <AsyncSelect
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
            isClearable
            autoComplete="something-unsupported" 
            cacheOptions
            loadOptions={callbackOptions}
            onChange={handleChange}
            placeholder={placeholder}
            value={selected? (selected.value ? selected : null) : null}
            isDisabled={disabled}
        />
    )
}
