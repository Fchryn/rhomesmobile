import React, { useContext, useEffect, useState } from "react";
import {routes} from "../constants/Urls.js";
import { IconButton } from "../components/IconButton";
import { Link } from "react-router-dom";
import { CardMenu } from "../components/CardMenu";
import { AppContext } from "../App";
import { useNavigate } from "react-router";
import { getPOList, getSupplierList, getReadItemList, getObatList, saveItem, addItem, getOrderedItem, addRcv } from "../apis/Inventory.js";
import { DEFAULT_ITEM_COUNT } from "../constants/Entities.js";
import { currencyToNumber, formatPhone, numberToCurrency } from "../helper/Formatter.js";
import { LoadingOverlay } from "../components/Loading.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { AppBar } from "../components/AppBar.jsx";
import { CardBiaya } from "../components/CardBiaya.jsx";
import { Modal } from "../components/Modal.jsx";
import { CLASS_FIELD_LABEL, CLASS_TEXTFIELD } from "../constants/Styles.js";
import Cleave from "cleave.js/react";
import { cloneDeep } from "lodash";

export const InventoryItem = () => {
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
    const [keyval, setKeyval] = useState(false);
    const [itemPO, setItemPO] = useState([]);
    const init = () => {
        if(context.config){
            setLoading(true);
            loadItem();
            getObatList({
                page,
                cbt_com_id:context.user.currentLocation.com_id,
                rows: DEFAULT_ITEM_COUNT,
                onSuccess: (item,count)=>{
                    setListObat(item);
                    setLoading(false);
                    setTotalCount(count);
                },
                key_val:keyval
            });
            
        }
    }

    useEffect(()=>{
        init();
    },[JSON.stringify(context.config), page, keyval]);
    
    function handleReadItem(){
        //setListObat(cloneDeep(listObatRead))
        setReadModal(false);
        setReadModal(true);
    }
    function handleAddItem(data){
        addItem({
            onSuccess: (savedData)=>{
                setItemPO(savedData);
                setReadModal(false);
                loadItem();
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
            poi_po_id:context.po.po_id,
            poi_obt_id:data.obt_id,
        })
        
    }
    
    function handleSaveModal(data){
        setItemPO(data);
        setAddItemModal(false);
        setSaveItemModal(true);
    }
    function loadItem(){
        getReadItemList({
            po_id: context.po.po_id,
            onSuccess: (item)=>{
                setListReadItem(item);
                setLoading(false);
            }
        });
    }
    const updateData = (key, value) => {
        setItemPO({
            ...itemPO, [key]: value,
        });
    } //mengganti data dari data yang sudah ada
    const updateObat = (value) => {
        setKeyval(value);
    }
    function handleSaveItem(){
        saveItem({
            onSuccess: ()=>{
                setItemPO(null);
                loadItem();
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
            poi_po_id:context.po.po_id,
            ...itemPO
        })
        setSaveItemModal(false);
    }
    function handleAddRcv(){
        addRcv({
            onSuccess: (savedData, savedData2)=>{
                context.setRcv(savedData);
                context.setPo(savedData2);
                loadItem();
                navigate(routes.inventory);
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
            po_id:context.po.po_id,
        })
    }
    return( 
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar
                bgColor="bg-purple-500" 
                bgHoverColor="hover:bg-purple-600" 
                backIcon="IoChevronBackOutline"
                onBackClick={()=>navigate(routes.inventory)}
            >
               Inventory Item
            </AppBar>
            
            <div className="py-14">
                {
                    !loading? null :
                    <LoadingOverlay/>
                }
                <div className="text-slate-600 flex justify-between p-2">
                    <div className="text-left py-2">{context.po.sup_nama}</div>
                        <div className="grid grid-cols-1 gap-1 content-around">
                            <div className="text-left"><div className="flex w-full md:w-1/2 text-white bg-purple-500 font-bold py-2 px-4 text-sm rounded-xl shadow-xl hover:bg-purple-600"
                                onClick={handleReadItem}>
                                Add Item
                            </div>
                            </div>
                            <div className="text-left"><div className="flex w-full md:w-1/2 text-white bg-purple-500 font-bold py-2 px-4 text-sm rounded-xl shadow-xl hover:bg-purple-600"
                                onClick={handleAddRcv}>
                                Rcv Item
                            </div>
                            </div>
                        </div>
                    
                </div>
                {
                    listReadItem.map((li, key) => (
                        <div key={key} className="rounded-lg shadow bg-white p-3 mb-3">
                            <div className="flex items-center">
                                <div className={li.poi_harga&&li.poi_qty?"font-bold text-gray-600 flex-1 mr-2 truncate":"font-bold text-red-600 flex-1 mr-2 truncate"}>
                                    <span className="hover:text-purple-500" onClick={()=>handleSaveModal(li)}>
                                        {li.obt_nama ? li.obt_nama : "-"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-1 content-around">
                                    <div className="text-gray-600 w-1/3 text-xs">
                                        Jumlah={li.poi_qty}
                                    </div>
                                    <div className="text-gray-600 w-1/3 text-xs">
                                        Harga={li.poi_harga}
                                    </div>

                                </div>
                                
                            </div>  
                        </div>
                    ))
                }
            </div>
            { readModal==false ? null : 
            <Modal title="Tambah Item" onCancel={()=>setReadModal(false)}>
                {
                <div>
                    <div className="mb-3">
                        <div className={CLASS_FIELD_LABEL}>
                            Cari
                        </div>
                        <Cleave
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateObat(e.target.value)}
                        />
                    </div>
                    <div className="mb-10">
                    {
                        listObat.map((li, key) => (
                            <div key={key} className="rounded-lg shadow bg-white p-3 mb-3">
                                
                                <div className="flex items-center">
                                    <div className="font-bold text-gray-600 flex-1 mr-2 truncate text-sm">
                                        <span className="hover:text-purple-500" onClick={()=>handleAddItem(li)}>
                                            {li.obt_nama ? li.obt_nama : "-"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-1 content-around">
                                    <div className="text-gray-600 w-20 text-xs">
                                        Stok={li.cbt_stok}
                                    </div>
                                    <div className="text-gray-600 w-18 text-xs truncate">
                                        Harga={li.cbt_harga}
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
                }
            </Modal>
            }
            { saveItemModal==false ? null : 
            <Modal title="Save Item" onCancel={()=>setSaveItemModal(false)}>
                {
                <div>
                    <div className="mb-10">
                        <div className={CLASS_FIELD_LABEL}>
                            Nama Item
                        </div>
                        <Cleave
                            value={itemPO.obt_nama}
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
                            onChange={(e)=>updateData("poi_qty", e.target.value)}
                            value={itemPO.poi_qty}
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
                            onChange={(e)=>updateData("poi_harga", e.target.value)}
                            value={itemPO.poi_harga}
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