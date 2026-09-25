import React from "react";
import * as IonIcons from 'react-icons/io5';

export const IconButton = ({
    icon,
    title,
    onClick,
    color,
    bgColor,
    bgHoverColor,
    customClass,
    bigger
}) => {
    const {...icons} = IonIcons;
    const TheIcon = icons[icon];
    return(
        <div className={`flex flex-col justify-center ${bigger? "w-10 h-10" : "w-8 h-8"} rounded-full ${bgColor?bgColor : ""} ${bgHoverColor? bgHoverColor : "hover:bg-green-700"} cursor-pointer ${color? color : "text-white" } ${customClass?customClass:""}`}
            onClick={onClick} title={title}
        >
            <TheIcon className={`m-auto ${bigger? "w-6 h-6": "w-5 h-5"}`}/>
        </div>
    )
}