import React from "react";
import DynamicIcon from "./DynamicIcon";
import { Loading } from "./Loading";

export const ButtonBlock = ({
    onClick,
    title,
    icon,
    bgColor,
    bgHoverColor,
    disabled,
    loading
}) => (
    <div className="fixed inset-x-0 bottom-0 p-4 shadow-2xl bg-white">
        <div className={`flex items-center justify-center rounded-full w-full p-3 text-white font-bold
            ${bgColor?bgColor : "bg-indigo-500"} 
            ${bgHoverColor? bgHoverColor : "hover:bg-indigo-600"}
            ${disabled? "opacity-50" : "cursor-pointer"}`
        }
            onClick={disabled? undefined: onClick}
        >
            {
                loading? <div className="mr-12"><Loading/></div> :
                (icon? <DynamicIcon name={icon} className="w-5 h-5 mr-2"/> : null)
            }
            {title}
        </div>
    </div>
)