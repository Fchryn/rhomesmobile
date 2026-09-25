import React, { useContext, useEffect, useState } from "react";
import {routes} from "../constants/Urls.js";
import { IconButton } from "../components/IconButton";
import { Link } from "react-router-dom";
import { CardMenu } from "../components/CardMenu";
import { AppContext } from "../App";
import { useNavigate } from "react-router";
import { DEFAULT_ITEM_COUNT } from "../constants/Entities.js";
import { formatPhone, numberToCurrency } from "../helper/Formatter.js";
import { LoadingOverlay } from "../components/Loading.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { AppBar } from "../components/AppBar.jsx";
import { getMasterKamarList } from "../apis/Master.js";


export const Kamar = ()=> {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    const init = () => {
        if(context.config){
            setLoading(true);
            getMasterKamarList({
                page,
                lok_id:context.user.currentLocation.lok_id,
                rows: DEFAULT_ITEM_COUNT,
                onSuccess: (patients,count)=>{
                    console.log(patients)
                    setList(patients);
                    setLoading(false);
                    setTotalCount(count);
                },
            });
        }
    }

    useEffect(()=>{
        init();
    },[JSON.stringify(context.config), page]);
    
    function handleEdit(data){
        context.setMaster(data);
        context.setCanEdit(true);
        setTimeout(()=>{
            navigate(routes.kamarDetail);
        },500);
    }

    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar 
                bgColor="bg-red-500" bgHoverColor="hover:bg-red-600"  >
                Kamar
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
                                    {li.kmr_ruang}
                                </div>
                                <div className="text-gray-600 w-36 mr-2 text-sm break-words">
                                    {"KAMAR NO. "+li.kmr_nomorbed}
                                </div>
                                <div className="text-gray-600 w-24 mr-2 text-sm break-words">
                                    {numberToCurrency(li.kmr_tarif_ruang)}
                                </div>
                                <div className="text-gray-600 w-36 mr-2 text-sm break-words">
                                    {"BANGSAL "+li.kmr_bangsal}
                                </div>
                                <div className="w-8">
                                <div to={routes.pegawaiDetail} className=" m-auto" onClick={()=>handleEdit(li)}>
                                        <IconButton bgColor="bg-white"
                                            bgHoverColor="hover:bg-gray-100"
                                            color="text-gray-600"
                                            icon="IoPencilOutline"
                                            title="Edit Kamar"
                                        />
                                    </div>
                                </div>
                            </div>  
                        </div>
                    ))
                }
                <Pagination current={page} total={Math.ceil(totalCount/DEFAULT_ITEM_COUNT)} 
                    onGoTo={setPage} onNext={()=>setPage(page+1)} onPrev={()=>setPage(page-1)}
                />
            </div>
            <IconButton bigger
                bgColor="bg-red-500"
                bgHoverColor="hover:bg-red-600"
                color="text-white"
                title="Buat Kamar Baru"
                onClick={()=>navigate(routes.kamarDetail)}
                customClass = "fixed z-10 bottom-4 right-4 shadow"
                icon="IoAddOutline"
            />
        </div>
    )
}