import React, { useState } from 'react';
import { numberToCurrency } from '../helper/Formatter';
import DynamicIcon from './DynamicIcon';

export const CardBiaya = ({title, icon, biayaCount, biayaTotal, children}) => {
    const [expanded, setExpanded] = useState(false);
    return(
        <div className={`rounded-xl overflow-hidden border-2 mb-4 ${biayaCount>0 ? "border-green-600" : "border-slate-300"}`}>
            <div className={`flex items-center h-14 ${biayaCount>0 ? "bg-green-600" : "bg-slate-300"}`} onClick={()=>setExpanded(!expanded)}>
                <div className="h-14 mx-2 flex flex-col justify-center">
                    <DynamicIcon name={icon} className="h-8 w-8 m-auto text-white"/>
                </div>
                <div className="flex-grow text-white">
                    <div className="font-bold">
                        {title}
                    </div>
                    <div className="flex text-xs">
                        <div className="text-grow mr-2">
                            Jumlah biaya: {biayaCount}
                        </div>
                        <div className="font-bold w-1/2">
                            Total: {numberToCurrency(biayaTotal)}
                        </div>
                    </div>
                </div>
                <DynamicIcon name={expanded? "IoChevronUp":"IoChevronDown"} className="w-5 h-5 text-white mx-2"/>
            </div>
            {
                !expanded? null:
                <div className="p-4 bg-white">
                    {children}
                </div>
            }
        </div>
    )
}