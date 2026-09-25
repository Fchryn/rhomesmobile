import React from "react";

const dots = [1,2,3,4];

export const Loading = ({color}) => (
    <div className="lds-ellipsis">
        {
            dots.map(d=>(
                <div className={color?color: "bg-white"} key={d}/>
            ))
        }
    </div>
)

export const LoadingOverlay = (props) => (
    <div className="fixed top-0 h-screen w-full z-40">
        <div className="absolute bg-black bg-opacity-60 w-full h-screen flex flex-col justify-center">
            <div className="text-center">
                <Loading {...props}/>
            </div>
        </div>
    </div>
)