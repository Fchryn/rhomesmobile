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
import { getMasterTindakanList } from "../apis/Master.js";


export const Tindakan = ()=> {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    const [keyword, setKeyword] = useState("");
    const init = () => {
        console.log(context.user)
        if(context.config){
            setLoading(true);
            getMasterTindakanList({
                page,
                lok_jenis:context.user.currentLocation.lok_jenis,
                com_id:context.user.currentLocation.com_id,
                lok_id:context.user.currentLocation.lok_id,
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
    },[JSON.stringify(context.config), page, keyword]);
    
    function handleEdit(data){
        context.setMaster(data);
        context.setCanEdit(true);
        setTimeout(()=>{
            navigate(routes.tindakanDetail);
        },500);
    }
    function handleEditDks(data){
        context.setMaster(data);
        context.setCanEdit(true);
        setTimeout(()=>{
            navigate(routes.dkstindakanDetail);
        },500);
    }
    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar 
                bgColor="bg-red-500" bgHoverColor="hover:bg-red-600" >
                Tindakan
            </AppBar>
            <div className="py-14">
                {
                    !loading? null :
                    <LoadingOverlay/>
                }
                {
                    list.map((li, key) => (
                        <div key={key} className="rounded-lg shadow bg-white p-3 m-3">
                            {context.user.currentLocation.lok_jenis=='1'?
                            <div className="flex items-center">
                                <div className="font-bold text-gray-600 flex-1 mr-2 truncate">
                                    {li.dtin_nama}
                                </div>
                                <div className="text-gray-600 w-36 mr-2 text-sm break-words">
                                    {li.dgti_nama}
                                </div>
                                <div className="text-gray-600 w-24 mr-2 text-sm break-words">
                                    {li.dghr_nama}
                                </div>
                                <div className="text-gray-600 w-36 mr-2 text-sm break-words">
                                    {numberToCurrency(li.dhti_harga)}
                                </div>
                                <div className="w-8">
                                <div to={routes.dkstindakanDetail} className=" m-auto" onClick={()=>handleEditDks(li)}>
                                        <IconButton bgColor="bg-white"
                                            bgHoverColor="hover:bg-gray-100"
                                            color="text-gray-600"
                                            icon="IoPencilOutline"
                                            title="Edit Tindakan"
                                        />
                                    </div>
                                </div>
                            </div>  
                            :
                            <div className="flex items-center">
                                <div className="font-bold text-gray-600 flex-1 mr-2 truncate">
                                    {li.tin_nama}
                                </div>
                                <div className="text-gray-600 w-36 mr-2 text-sm break-words">
                                    {li.tin_kode}
                                </div>
                                <div className="text-gray-600 w-24 mr-2 text-sm break-words">
                                    {li.yan_nama}
                                </div>
                                <div className="text-gray-600 w-36 mr-2 text-sm break-words">
                                    {numberToCurrency(li.tin_harga)}
                                </div>
                                <div className="w-8">
                                <div to={routes.tindakanDetail} className=" m-auto" onClick={()=>handleEdit(li)}>
                                        <IconButton bgColor="bg-white"
                                            bgHoverColor="hover:bg-gray-100"
                                            color="text-gray-600"
                                            icon="IoPencilOutline"
                                            title="Edit Tindakan"
                                        />
                                    </div>
                                </div>
                            </div>}
                        </div>
                    ))
                }
                <Pagination current={page} total={Math.ceil(totalCount/DEFAULT_ITEM_COUNT)} 
                    onGoTo={setPage} onNext={()=>setPage(page+1)} onPrev={()=>setPage(page-1)}
                />
            </div>
            {context.user.currentLocation.lok_jenis=='1'?
            <IconButton bigger
                bgColor="bg-red-500"
                bgHoverColor="hover:bg-red-600"
                color="text-white"
                title="Daftar Tindakan"
                onClick={()=>navigate(routes.dkstindakanDetail)}
                customClass = "fixed z-10 bottom-4 right-4 shadow"
                icon="IoAddOutline"
            />:
            <IconButton bigger
                bgColor="bg-red-500"
                bgHoverColor="hover:bg-red-600"
                color="text-white"
                title="Daftar Tindakan"
                onClick={()=>navigate(routes.tindakanDetail)}
                customClass = "fixed z-10 bottom-4 right-4 shadow"
                icon="IoAddOutline"
            />
            }
        </div>
    )
}