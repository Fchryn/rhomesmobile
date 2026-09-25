import Cleave from "cleave.js/react";
import { cloneDeep } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../App";
import { AppBar } from "../components/AppBar";
import { ButtonBlock } from "../components/ButtonBlock";
import { RadioButton } from "../components/RadioButton";
import { SelectAsync } from "../components/SelectAsync";
import { CLASS_FIELD_LABEL, CLASS_TEXTFIELD } from "../constants/Styles";
import { routes } from "../constants/Urls";
import { SelectSimple } from "../components/SelectSimple";
import { getLayanan, saveTindakan } from "../apis/Master";
import { PhoneInput } from "../components/PhoneInput";

const tinModel = {
    tin_nama:"",
    tin_kode:"",
    tin_yan_id:"",
    tin_harga:"",
};

export const TindakanDetail = () => {
    const {master,user,canEdit,setCanEdit} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tin, setTin] = useState(canEdit==true?(master? cloneDeep(master): {}):cloneDeep(tinModel));
    const [canSave, setCanSave] = useState(false);
    const [layananList, setLayananList] = useState([]);

    useEffect(()=>{
        if(canEdit==true){
            if(!master){
                navigate(routes.tindakan);
                return;
            }
        }
    },[]) //eksekusi load tin jika ada datanya

    const updateData = (key, value) => {
        setTin({
            ...tin, [key]: value
        });
        setCanSave(true);
    } //mengganti data dari data yang sudah ada

    useEffect(()=>{
        setLoading(true);
        Promise.all([
            getLayanan({onSuccess: setLayananList,lok_jenis:user.currentLocation.lok_jenis, lok_id:user.currentLocation.lok_id})
        ]).then(()=>{
            setLoading(false);
        });
    },[]); //load semua dropdownlist yang bukan search
   
    const handleSave = (data) => {
        setLoading(true);
        console.log(layananList);
        if(canEdit==true){
            saveTindakan({
                onSuccess: (savedData)=>{
                    setTin(savedData);
                    navigate(routes.tindakan);
                    setCanEdit(false)
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                },
                com_id:user.currentLocation.com_id,
                ...data
            })
        }
        else{
            saveTindakan({
                com_id:user.currentLocation.com_id,
                tin_id:'0',
                ...data,
                onSuccess: (savedData)=>{
                    setTin(savedData);
                    navigate(routes.tindakan);
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                }
                
            })
        }
    }
    const handleBack = () => {
        navigate(routes.tindakan);
        setCanEdit(false);
    }
    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            {canEdit==true?
                <AppBar bgColor="bg-red-500" bgHoverColor="hover:bg-red-600"
                    backIcon="IoChevronBackOutline"
                    onBackClick={()=>handleBack()}
                >
                    Tindakan Edit
                </AppBar>
                :
                <AppBar bgColor="bg-red-500" bgHoverColor="hover:bg-red-600"
                    backIcon="IoChevronBackOutline"
                    onBackClick={()=>handleBack()}
                >
                    Tindakan Tambah
                </AppBar>
            }
            <div className="py-20 px-4">     
                <div className="mb-5 text-xl font-bold">Pengisian tin</div>
                <div className="flex space-x-4">
                    <div className="mb-5">  
                        <div className={CLASS_FIELD_LABEL}>
                            ID
                        </div>
                        {canEdit==true?
                        <div className="relative">
                            <Cleave type="text" className={CLASS_TEXTFIELD}
                                value={tin.tin_id}
                                rows={5}
                                disabled={true}
                            />
                        </div>:
                        <div className="relative">
                            <Cleave type="text" className={CLASS_TEXTFIELD}
                                value="auto"
                                rows={5}
                                disabled={true}
                            />
                        </div>
                        }
                    </div>   
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Status
                        </div>
                        <div className="relative">
                            <Cleave type="text" className={CLASS_TEXTFIELD}
                                value={tin.tin_status}
                                rows={5}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                       Nama Tindakan
                    </div>
                    <div className="relative">
                        <input type="text" 
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("tin_nama", e.target.value)}
                            value={tin.tin_nama}
                        />
                    </div>
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                       Kode Tindakan
                    </div>
                    <div className="relative">
                        <input type="text" 
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("tin_kode", e.target.value)}
                            value={tin.tin_kode}
                        />
                    </div>
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        Layanan
                    </div>
                    <SelectSimple
                        onChange={(obj)=>updateData("tin_yan_id", obj.value)}
                        selected={layananList.find(s=>s.value === tin.tin_yan_id)}
                        options={layananList}
                    />
                </div>
                
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                       Harga
                    </div>
                    <div className="relative">
                        <input type="text" 
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("tin_harga", e.target.value)}
                            value={tin.tin_harga}
                        />
                    </div>
                </div>
                
            </div>
            <ButtonBlock
                onClick={()=>handleSave(tin)}
                title="Simpan Data"
                bgColor="bg-red-500"
                bgHoverColor="hover:bg-red-600"
                icon="IoSaveOutline"
                disabled = {!canSave}
                loading={loading}
            />
        </div>
    )
}