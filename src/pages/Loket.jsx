import React, { useContext, useEffect, useState } from "react";
import {routes} from "../constants/Urls.js";
import { IconButton } from "../components/IconButton";
import { Link } from "react-router-dom";
import { CardMenu } from "../components/CardMenu";
import { AppContext } from "../App";
import { useNavigate } from "react-router";
import { getKlinikList } from "../apis/Layanan.js";
import { DEFAULT_ITEM_COUNT } from "../constants/Entities.js";
import { formatPhone } from "../helper/Formatter.js";
import { LoadingOverlay } from "../components/Loading.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { AppBar } from "../components/AppBar.jsx";

export const Loket = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    const init = () => {
        if(context.config){
            setLoading(true);
            getKlinikList({
                page,
                lok_id:context.user.currentLocation.lok_id,
                kun_statusbayar: "SEMUA", //TODO: perlu selectable
                rows: DEFAULT_ITEM_COUNT,
                onSuccess: (patients,count)=>{
                    console.log(patients)
                    setList(patients);
                    setLoading(false);
                    setTotalCount(count);
                }
            });
        }
    }

    useEffect(()=>{
        init();
    },[JSON.stringify(context.config), page]);
    
    function handlePeriksa(data){
        context.setPasienKlinik(data);
        setTimeout(()=>{
            navigate(routes.loketEdit);
        },500);
    }

    return( 
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar
                bgColor="bg-lime-500" 
                bgHoverColor="hover:bg-lime-600" 
                searchPlaceholder="Cari Pasien"
            >
               Loket
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
                                    {li.man_nama}
                                </div>
                                <div className="text-gray-600 w-1/3 mr-2 text-sm break-words">
                                    {li.yan_nama}
                                </div>
                                <div className="w-8">
                                    <div to={routes.loketEdit} className=" m-auto" onClick={()=>handlePeriksa(li)}>
                                        <IconButton bgColor="bg-white"
                                            bgHoverColor="hover:bg-gray-100"
                                            color="text-gray-600"
                                            icon="IoPencilOutline"
                                            title="Edit Loket"
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
                bgColor="bg-lime-500"
                bgHoverColor="hover:bg-lime-600"
                color="text-white"
                title="Daftar Pasien Loket"
                onClick={()=>navigate(routes.loketTambah)}
                customClass = "fixed z-10 bottom-4 right-4 shadow"
                icon="IoAddOutline"
            />
        </div>
    )
}