import React, { useState } from 'react';
import { numberToCurrency } from '../helper/Formatter';

export const CardBiayaTitle = ({biayaTotal}) => {
    return(
        <div className="rounded-xl overflow-hidden border-2 mb-4 border-green-600">
            <div className="flex items-center h-14 bg-green-600">
                <div className="h-14 mx-2 flex flex-col text-white justify-center">
                    <div className="font-bold">
                        Total Keseluruhan
                    </div>
                    <div className="flex text-xs">
                        <div className="font-bold w-1/2">
                            {numberToCurrency(biayaTotal)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}