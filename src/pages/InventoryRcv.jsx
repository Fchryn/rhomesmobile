import React, { useContext, useEffect, useState } from "react";
import {routes} from "../constants/Urls.js";
import { IconButton } from "../components/IconButton";
import { Link } from "react-router-dom";
import { CardMenu } from "../components/CardMenu";
import { AppContext } from "../App";
import { useNavigate } from "react-router";
import { getPOList, getReadItemRcList, getReadItemList, getObatList, saveItem, saveRcItem, getOrderedItem} from "../apis/Inventory.js";
import { DEFAULT_ITEM_COUNT } from "../constants/Entities.js";
import { currencyToNumber, formatPhone, numberToCurrency } from "../helper/Formatter.js";
import { LoadingOverlay } from "../components/Loading.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { AppBar } from "../components/AppBar.jsx";
import { CardBiaya } from "../components/CardBiaya.jsx";
import { Modal } from "../components/Modal.jsx";
import { CLASS_FIELD_LABEL, CLASS_TEXTFIELD } from "../constants/Styles.js";
import Cleave from "cleave.js/react";

export const InventoryRcv = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listReadItem, setListReadItem] = useState([]);
    const [listObat, setListObat] = useState([]);
    const [po, setPo] = useState([]);
    const [poBaru, setPoBaru] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    const [addPoModal, setAddPoModal] = useState(false);
    const [addItemModal, setAddItemModal] = useState(false);
    const [saveItemModal, setSaveItemModal] = useState(false);
    const [addDetailItemPoModal, setDetailItemPoModal] = useState(false);
    const [readModal, setReadModal] = useState(false);
    const [itemRcv, setItemRcv] = useState([]);
    const init = () => {
        if(context.config){
            setLoading(true);
            getReadItemRcList({
                rcv_id: context.rcv.rcv_id,
                onSuccess: (item,count)=>{
                    console.log(item);
                    item.length<0?navigate(routes.inventory):setListReadItem(item);
                    //setListReadItem(item);
                    setLoading(false);
                }
            });
            
        }
    }

    useEffect(()=>{
        init();
    },[JSON.stringify(context.config), page]);
    
    function handleSaveModal(data){
        setItemRcv(data);
        setAddItemModal(false);
        setSaveItemModal(true);
    }
    function loadItem(){
        getReadItemRcList({
            rcv_id: context.rcv.rcv_id,
            onSuccess: (item,count)=>{
                setListReadItem(item);
                setLoading(false);
            }
        });
    }
    const updateData = (key, value) => {
        setItemRcv({
            ...itemRcv, [key]: value,
        });
    } //mengganti data dari data yang sudah ada
    function handleOrderItem(){
        getOrderedItem({
            rcv_id: context.rcv.rcv_id,
            onSuccess: (item)=>{
                loadItem();
                setLoading(false);
            }
        });
        
    }
    function handleSaveItem(){
        saveRcItem({
            onSuccess: ()=>{
                setItemRcv(null);
                loadItem();
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
            rcvi_po_id:context.rcv.rcv_id,
            ...itemRcv
        })
        setSaveItemModal(false);
    }
    return( 
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar
                bgColor="bg-purple-500" 
                bgHoverColor="hover:bg-purple-600" 
                backIcon="IoChevronBackOutline"
                onBackClick={()=>navigate(routes.inventory)}
            >
               Inventory Receive
            </AppBar>
            
            <div className="py-14">
                {
                    !loading? null :
                    <LoadingOverlay/>
                }
                <div className="text-slate-600 flex justify-between p-2">
                    <div className="text-left py-2">{context.rcv.sup_nama}</div>
                        <div className="grid grid-cols-1 gap-1 content-around">
                            <div className="text-left"><div className="flex w-full md:w-1/2 text-white bg-purple-500 font-bold py-2 px-4 text-sm rounded-xl shadow-xl hover:bg-purple-600"
                                onClick={handleOrderItem}>
                                Order Item
                            </div>
                            </div>
                            
                        </div>
                    
                </div>
                {
                    listReadItem.map((li, key) => (
                        <div key={key} className="rounded-lg shadow bg-white p-3 mb-3">
                            <div className="flex items-center">
                                <div className={li.rcvi_harga&&li.rcvi_qty?"font-bold text-gray-600 flex-1 mr-2 truncate":"font-bold text-red-600 flex-1 mr-2 truncate"}>
                                    <span className="hover:text-purple-500" onClick={()=>handleSaveModal(li)}>
                                        {li.obt_nama ? li.obt_nama : "-"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-1 content-around">
                                    <div className="text-gray-600 w-1/3 text-xs">
                                        Jumlah={li.rcvi_qty}
                                    </div>
                                    <div className="text-gray-600 w-1/3 text-xs">
                                        Harga={li.rcvi_harga}
                                    </div>

                                </div>
                                
                            </div>  
                        </div>
                    ))
                }
            </div>
            
            { saveItemModal==false ? null : 
            <Modal title="Save Item" onCancel={()=>setSaveItemModal(false)}>
                {
                <div>
                    <div className="mb-10">
                        <div className={CLASS_FIELD_LABEL}>
                            Nama Item
                        </div>
                        <Cleave
                            value={itemRcv.obt_nama}
                            className={CLASS_TEXTFIELD}
                            disabled={true}
                        />
                    </div> 
                    <div className="mb-10">
                        <div className={CLASS_FIELD_LABEL}>
                            Kuantity Item
                        </div>
                        <Cleave
                            options={{
                                numericOnly: true,
                            }}
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("rcvi_qty", e.target.value)}
                            value={itemRcv.rcvi_qty}
                        />
                    </div> 
                    <div className="mb-10">
                        <div className={CLASS_FIELD_LABEL}>
                            Harga Item
                        </div>
                        <Cleave
                            options={{
                                numericOnly: true,
                            }}
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("rcvi_harga", e.target.value)}
                            value={itemRcv.rcvi_harga}
                        />
                    </div>
                    <div className="flex justify-center px-8 pb-8">
                        <div className="flex items-center justify-center mt-5 w-full md:w-1/2 text-white bg-cyan-500 font-bold p-4 rounded-xl shadow-xl hover:bg-cyan-600"
                            onClick={handleSaveItem}
                        >
                            Terapkan
                        </div>
                    </div> 
                </div>    
                }
            </Modal>
            }
            
        </div>
    )
}