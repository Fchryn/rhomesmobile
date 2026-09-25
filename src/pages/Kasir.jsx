import React, { useContext, useEffect, useState } from "react";
import {routes} from "../constants/Urls.js";
import { IconButton } from "../components/IconButton";
import { AppContext } from "../App";
import { useNavigate } from "react-router";
import { getKlinikList } from "../apis/Layanan.js";
import { DEFAULT_ITEM_COUNT } from "../constants/Entities.js";
import { LoadingOverlay } from "../components/Loading.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { AppBar } from "../components/AppBar.jsx";

export const Kasir = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    const [keyword, setKeyword] = useState("");
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
                },
                q: keyword
            });
        }
    }

    useEffect(()=>{
        init();
    },[JSON.stringify(context.config), page, keyword]);
    
    function handlePeriksa(data){
        context.setPasienKlinik(data);
        setTimeout(()=>{
            navigate(routes.kasirDetail);
        },500);
    }

    const handleSearch = (searchKey) =>{
        setPage(1);
        setKeyword(searchKey);
    }
    return( 
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar
                bgColor="bg-orange-400" 
                bgHoverColor="hover:bg-orange-500" 
                searchPlaceholder="Cari Pasien"
                onSearch={handleSearch}
            >
               Kasir
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
                                    <div to={routes.kasirDetail} className=" m-auto" onClick={()=>handlePeriksa(li)}>
                                        <IconButton bgColor="bg-white"
                                            bgHoverColor="hover:bg-gray-100"
                                            color="text-gray-600"
                                            icon="IoReceiptOutline"
                                            title="Detail Kasir"
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
        </div>
    )
}