import React, { useContext, useEffect, useState } from "react";
import {routes} from "../constants/Urls.js";
import { IconButton } from "../components/IconButton";
import { Link } from "react-router-dom";
import { CardMenu } from "../components/CardMenu";
import { AppContext } from "../App";
import { useNavigate } from "react-router";
import { getPOList, getSupplierList, getReceiveList, savePO, getOrderedItem, getReadItemRcList } from "../apis/Inventory.js";
import { DEFAULT_ITEM_COUNT } from "../constants/Entities.js";
import { currencyToNumber, formatPhone, numberToCurrency } from "../helper/Formatter.js";
import { LoadingOverlay } from "../components/Loading.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { AppBar } from "../components/AppBar.jsx";
import { CardBiaya } from "../components/CardBiaya.jsx";
import { Modal } from "../components/Modal.jsx";
import { CLASS_FIELD_LABEL } from "../constants/Styles.js";

export const Inventory = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listPO, setListPO] = useState([]);
    const [listSupplier, setListSupplier] = useState([]);
    const [listReceive, setListReceive] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    const [addPoModal, setAddPoModal] = useState(false);
    const [addAcceptModal, setAddAcceptModal] = useState(false);
    const [addReceiveModal, setAddReceiveModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const init = () => {
        if(context.config){
            setLoading(true);
            // context.po?
            // setListPO(context.po)
            // :
            getPOList({
                onSuccess: (item,count)=>{
                    setListPO(item);
                    setLoading(false);
                }
            });
            getReceiveList({
                onSuccess: (item,count)=>{
                    setListReceive(item);
                    setLoading(false);
                    setTotalCount(count);
                }
            })
        }
    }

    useEffect(()=>{
        init();
        
    },[JSON.stringify(context.config), page]);

    function handleAddPo(data){
        getSupplierList({
            onSuccess: (item,count)=>{
                setListSupplier(item);
                setLoading(false);
            }
        });
        setAddPoModal(true);
    }//modal supplier

    function handleAddItemPo(data){
        let today = new Date();
        savePO({
            onSuccess: (savedData)=>{
                context.setPo(savedData);
                navigate(routes.inventoryItem);
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
            po_tgorder:today.toLocaleDateString("en-US"),
            po_sup_id:data.sup_id,
            po_id:'0',
            po_status:'',
        })
        setAddPoModal(false);
    }//proses ketika eksekusi button sampingnya supplier

    function handleEditItemPo(data){
        context.setPo(data);
        navigate(routes.inventoryItem);
    }

    function handleAcceptItemRcv(data){
        context.setRcv(data);
        setAddAcceptModal(true);
    }

    function handleReceiveItemRcv(){
        console.log(context.rcv)
        setAddAcceptModal(false)
        navigate(routes.inventoryRcv);
    }

    

    return( 
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar
                bgColor="bg-purple-500" 
                bgHoverColor="hover:bg-purple-600"
                tabs={["PO", "Receive"]}
                tabActive={activeTab}
                onTabSelect={setActiveTab}
                tabActiveColor="bg-purple-200"
            >
                
            {/* <AppBar
                bgColor="bg-purple-500" 
                bgHoverColor="hover:bg-purple-600" 
                searchPlaceholder="Cari Item"
            > */}
               Inventory
            </AppBar>
            <div className="py-20">
                {
                    !loading? null :
                    <LoadingOverlay/>
                }
                {   activeTab === 0 ?
                    listPO.map((li, key) => (
                        <div key={key} className="rounded-lg shadow bg-white p-3 m-3">
                            <div className="flex items-center">
                                <div className="font-bold text-gray-600 flex-1 mr-2 truncate">
                                    <span className="hover:text-purple-500" onClick={()=>handleEditItemPo(li)}>
                                        {li.sup_nama ? li.sup_nama : "-"}
                                    </span>
                                </div>
                                <div className="text-gray-600 w-16 mr-2 text-sm break-words">
                                    {li.po_status}
                                </div>
                            </div>  
                        </div>
                    )):
                    listReceive.map((li, key) => (
                        <div key={key} className="rounded-lg shadow bg-white p-3 m-3">
                            <div className="flex items-center">
                                <div className="font-bold text-gray-600 flex-1 mr-2 truncate text-sm">
                                    <span className="hover:text-purple-500" onClick={()=>handleAcceptItemRcv(li)}>
                                        {li.sup_nama ? li.sup_nama : "-"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-1 content-around">
                                    <div className="text-gray-600 w-1/3 text-xs">
                                        Tg.Order={li.po_tgorder}
                                    </div>
                                    <div className="text-gray-600 w-1/3 text-xs">
                                        Tg.Terima={li.rcv_tgterima?li.rcv_tgterima:"Belum\xa0Terima"}
                                    </div>
                                    <div className="text-gray-600 w-1/3 text-xs">
                                        Tg.Lunas={li.rcv_tglunas?li.rcv_tglunas:"Belum\xa0Lunas"}
                                    </div>

                                </div>
                            </div>  
                        </div>
                    ))
                }  
            </div>
            {   activeTab === 0 ?
            <IconButton bigger
                bgColor="bg-purple-500"
                bgHoverColor="hover:bg-purple-600"
                color="text-white"
                title="Tambah PO"
                onClick={()=>handleAddPo(listPO)}
                customClass = "fixed z-10 bottom-4 right-4 shadow"
                icon="IoAddOutline"
            />:<div></div>
            }
            { addPoModal==false ? null : 
            <Modal title="Tambah PO" onCancel={()=>setAddPoModal(false)}>
                {
                <div>
                    <div className="mb-10">
                        {
                        listSupplier.map((li, key) => (
                            <div key={key} className="rounded-lg shadow bg-white p-3 mb-3">
                                <div className="flex items-center">
                                    <div className="font-bold text-gray-600 flex-1 mr-2 truncate">
                                        {}
                                        <span className="hover:text-purple-500" onClick={()=>handleAddItemPo(li)}>
                                            {li.sup_nama ? li.sup_nama : "-"}
                                        </span>
                                    </div>
                                </div>  
                            </div>
                        ))
                    }  
                    </div>
                </div>    
                }
            </Modal>
            }
            { addAcceptModal==false ? null : 
            <Modal title="Persetujuan Receive" onCancel={()=>setAddAcceptModal(false)}>
                {
                <div>
                    <div className="mb-10">
                    {
                        <div className="flex items-center">
                            <div className="grid grid-cols-2 gap-20 content-around">
                                <span className="flex w-full text-white bg-red-500 font-bold py-2 px-1 text-sm rounded-xl shadow-xl hover:bg-red-600" onClick={()=>setAddAcceptModal(false)}>
                                    Cancel
                                </span>
                                <span className="flex w-full text-white bg-green-500 font-bold py-2 px-1 text-sm rounded-xl shadow-xl hover:bg-green-600" onClick={()=>handleReceiveItemRcv()}>
                                    Accept
                                </span>
                            </div> 
                        </div>
                    }  
                    </div>
                </div>    
                }
            </Modal>
            }
        </div>
    )
}