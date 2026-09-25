import React from "react";
export const RadioButton = ({borderColor, checkedColor, onClick, isChecked}) => (
    <div className={`cursor-pointer relative w-5 h-5 mr-3 border-2 ${borderColor?borderColor : "border-indigo-500"} rounded-full flex flex-col justify-center`}
        onClick={onClick}
    >
        <div className="absolute w-full text-center cursor-pointer">
            <input type="radio" className={`appearance-none rounded-full ${checkedColor?checkedColor : "checked:bg-indigo-500"} w-3 h-3 cursor-pointer`}
                checked={isChecked}
                onChange={()=>{}}
            />
        </div>
    </div>
)