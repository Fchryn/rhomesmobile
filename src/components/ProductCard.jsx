import React from "react";
import { numberToCurrency } from "../helper/Formatter";

export const ProductCard = ({
    image, 
    title, 
    stock, 
    priceDiscount, 
    price, 
    unit,
    onClick  
}) => {
    return(
        <div className="border rounded-xl p-3 overflow-hidden" onClick={onClick}>
            <div className="w-40 h-40 flex flex-col justify-center">
                {
                    image?
                    <img src={image} alt={title.substring(0,3)} className="object-cover"/>:
                    <div className="h-full bg-gray-300 text-center">
                        <ion-icon name="camera-outline" class="text-3xl text-gray-400"></ion-icon>
                    </div>
                }
            </div>  
            <div className="pt-3">
                <div className="mb-3">
                    {title}
                </div>
                <div className="flex items-center mb-3">
                    {
                        !priceDiscount?
                        <div className="text-lg font-bold">{numberToCurrency(price)}</div>:
                        <React.Fragment>
                            <div className="text-xs font-bold line-through">{numberToCurrency(price)}</div>
                            <div className="text-lg font-bold">{numberToCurrency(priceDiscount)}</div>
                        </React.Fragment>
                    }
                    <div className="text-gray-400 text-xs">/{unit}</div>
                </div>
                <div className={`text-right ${stock<10 ? "text-red-600" :"text-green-600"}`}>
                    Stok ~ {stock}{unit}
                </div>
            </div>
        </div>
    )
}