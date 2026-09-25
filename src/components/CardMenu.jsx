import React from 'react';
import DynamicIcon from './DynamicIcon';

export const CardMenu = ({iconClassName, title, icon, bigger, disabled}) => (
    <div className={`rounded-xl shadow-xl bg-white ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} w-24 ${bigger?"h-28": "h-24"}`}>
        <div className="h-14 flex flex-col justify-center">
            <DynamicIcon name={icon} className={`h-8 w-8 m-auto ${disabled ? "text-gray-400" : (iconClassName?iconClassName:"")}`}/>
        </div>
        <div className={`text-center font-bold ${disabled ? "text-gray-400" : ""}`}>
            {title}
        </div>
    </div>
)