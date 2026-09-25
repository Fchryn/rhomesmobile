import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { LoadingOverlay } from "../components/Loading.jsx";
import { AppBar } from "../components/AppBar.jsx";
import { getMasterAgamaList } from "../apis/Master.js";

export const Agama = ()=> {
    const context = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const init = () => {
        if(context.config){
            setLoading(true);
            getMasterAgamaList({
                onSuccess: (response)=>{
                    setList(response);
                    setLoading(false);
                }
            });
            console.log(list)
        }
    }
    useEffect(()=>{
        init();
    },[JSON.stringify(context.config)]);

    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar
                bgColor="bg-red-500" 
                bgHoverColor="hover:bg-red-600" 
            >
                Agama
            </AppBar>
            <div className="py-14">
                {
                    !loading? null :
                    <LoadingOverlay/>
                }
                {
                    list.map((li, key) => (
                        <div key={key} className="rounded-lg shadow bg-white p-3 m-3">
                            <div className="flex items-center">
                                <div className="font-bold text-gray-600 flex-1 mr-2 truncate">
                                    {li.agm_nama}
                                </div>
                            </div>  
                        </div>
                    ))
                }
            </div>
        </div>
    )
}