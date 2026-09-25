import React, { useContext, useEffect, useState } from "react";
import {routes} from "../constants/Urls.js";
import { IconButton } from "../components/IconButton";
import { AppContext } from "../App";
import { useNavigate } from "react-router";
import { DEFAULT_ITEM_COUNT } from "../constants/Entities.js";
import { formatPhone } from "../helper/Formatter.js";
import { LoadingOverlay } from "../components/Loading.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { AppBar } from "../components/AppBar.jsx";
import { initLokasi } from "../apis/Lokasi.js";

export const Lokasi = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    const [keyword, setKeyword] = useState("");
    const init = () => {
        setLoading(true);
        initLokasi({
            page,
            rows: DEFAULT_ITEM_COUNT,
            q:keyword?keyword: null,
            onSuccess: (locs,count)=>{
                setList(locs);
                setLoading(false);
                setTotalCount(count);
            },
            onError: (err)=>window.pushToast(err, "error")
        });
    }

    useEffect(()=>{
        init();
    },[page, keyword]);
    
    
    const handleSearch = (searchKey) =>{
        setPage(1);
        setKeyword(searchKey);
    }

    const handleSelect = (location) => {
        context.setUserWithLocation(location);
        navigate("/");
    }

    return( 
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar onSearch={handleSearch}
                bgColor="bg-indigo-500"
                searchPlaceholder="Cari Lokasi"
            >
                Pilih Lokasi
            </AppBar>
            <div className="py-14">
                {
                    !loading? null : 
                    <LoadingOverlay/>
                }
                {
                    list.map((li) => (
                        <div key={li.lok_id} className="rounded-lg shadow bg-white p-3 m-3">
                            <div className="flex items-center">
                                <div className="font-bold text-gray-600 flex-1 mr-2 break-words hover:text-indigo-700 cursor-pointer"
                                    onClick={()=>handleSelect(li)}
                                >
                                    {li.lok_nama}
                                </div>
                                <div className="text-gray-600 w-1/3 mr-2 text-sm break-words">
                                    {li.lok_alamat}
                                </div>
                                {
                                    !li.lok_telpon? <div className="w-8"/>:
                                    <a className="w-8" href={`tel:${formatPhone(li.lok_telpon)}`}>
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
        </div>
    )
}