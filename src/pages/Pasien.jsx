import React, { useContext, useEffect, useState } from "react";
import {routes} from "../constants/Urls.js";
import { IconButton } from "../components/IconButton";
import { AppContext } from "../App";
import { useNavigate } from "react-router";
import { getManusiaList } from "../apis/Manusia.js";
import { DEFAULT_ITEM_COUNT } from "../constants/Entities.js";
import { formatPhone } from "../helper/Formatter.js";
import { LoadingOverlay } from "../components/Loading.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { AppBar } from "../components/AppBar.jsx";

export const Pasien = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    const [keyword, setKeyword] = useState("");
    const init = () => {
        if(context.config && context.config.com_id){
            setLoading(true);
            getManusiaList({
                man_com_id: context.config.com_id,
                page,
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
    
    
    const handleSearch = (searchKey) =>{
        setPage(1);
        setKeyword(searchKey);
    }

    const handlePasienEdit = (data) =>{
        context.setPasienEdit(data);
        navigate(routes.pasienEdit);
    }

    return( 
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar onSearch={handleSearch} bgColor="bg-pink-500" bgHoverColor="hover:bg-pink-600" searchPlaceholder="Cari Pasien">
                Pasien
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
                                    <span className="hover:text-pink-500" onClick={()=>handlePasienEdit(li)}>
                                        {li.man_nama ? li.man_nama : "-"}
                                    </span>
                                </div>
                                <div className="text-gray-600 w-1/3 mr-2 text-sm break-words">
                                    {li.man_alamatskrng ? li.man_alamatskrng : "-"}
                                </div>
                                {
                                    !li.man_telpon? <div className="w-8"/>:
                                    <a className="w-8" href={`tel:${formatPhone(li.man_telpon)}`}>
                                        <IconButton bgColor="bg-white"
                                            bgHoverColor="hover:bg-gray-100"
                                            color="text-gray-600"
                                            icon="IoCallOutline"
                                            title="call"
                                        />
                                    </a>
                                }
                            </div>  
                        </div>
                    ))
                }
                <Pagination current={page} total={Math.ceil(totalCount/DEFAULT_ITEM_COUNT)} 
                    onGoTo={setPage} onNext={()=>setPage(page+1)} onPrev={()=>setPage(page-1)}
                />
            </div>
            <IconButton bigger
                bgColor="bg-pink-500"
                bgHoverColor="hover:bg-pink-600"
                color="text-white"
                title="Tambah Pasien"
                onClick={()=>navigate(routes.pasienTambah)}
                customClass = "fixed z-10 bottom-4 right-4 shadow"
                icon="IoAddOutline"
            />
        </div>
    )
}