import React from "react";

export const ButtonArea = ({
    onClick,
    title,
    borderColor,
    children
}) => (
    <div className={`rounded-xl border-2 border-dashed border-slate-400 flex flex-col justify-center h-20 ${borderColor?borderColor: "border-slate-600"}`} onClick={onClick}>
        <div className="text-center text-slate-500">
            {title}
        </div>
        {children}
    </div>
)