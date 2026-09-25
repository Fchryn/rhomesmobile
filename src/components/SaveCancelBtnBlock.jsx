import React from "react";
import DynamicIcon from "./DynamicIcon";
import { Loading } from "./Loading";

export const SaveCancelBtnBlock = ({
    onSave,
    saveTitle,
    saveIcon,
    saveBgColor,
    saveBgHoverColor,
    onCancel,
    cancelTitle,
    cancelIcon,
    cancelTxtColor,
    cancelBorderColor,
    disabled,
    loading
}) => (
    <div className="fixed inset-x-0 bottom-0 p-4 shadow-2xl bg-white">
        <div className="flex space-x-4">
            <div className={`w-1/2 flex items-center justify-center rounded-full p-3 bg-white hover:bg-slate-200 border-2 font-bold
                ${cancelTxtColor? cancelTxtColor : "text-indigo-500"} 
                ${cancelBorderColor? cancelBorderColor : "border-indigo-500"}
                ${disabled? "opacity-50" : "cursor-pointer"}`
            }
                onClick={disabled? undefined: onCancel}
            >
                {
                    (cancelIcon? <DynamicIcon name={cancelIcon} className="w-5 h-5 mr-2"/> : null)
                }
                {cancelTitle}
            </div>
            
            <div className={`w-1/2 flex items-center justify-center rounded-full p-3 text-white font-bold
                ${saveBgColor?saveBgColor : "bg-indigo-500"} 
                ${saveBgHoverColor? saveBgHoverColor : "hover:bg-indigo-600"}
                ${disabled? "opacity-50" : "cursor-pointer"}`
            }
                onClick={disabled? undefined: onSave}
            >
                {
                    loading? <div className="mr-12"><Loading/></div> :
                    (saveIcon? <DynamicIcon name={saveIcon} className="w-5 h-5 mr-2"/> : null)
                }
                {saveTitle}
            </div>
        </div>
    </div>
)