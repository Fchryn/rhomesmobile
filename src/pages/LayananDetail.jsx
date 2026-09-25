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
import { getMasterJabatan, getMasterKelamin, saveLayanan, getKlinikLayananList } from "../apis/Master";
import { PhoneInput } from "../components/PhoneInput";
import { searchArea } from "../apis/Area";

const yanModel = {
    yan_nama:"",
    yan_klinik:"",
};

export const LayananDetail = () => {
    const {master,user,canEdit,setCanEdit} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [yan, setYan] = useState(canEdit==true?(master? cloneDeep(master): {}):cloneDeep(yanModel));
    const [canSave, setCanSave] = useState(false);
    const [klinikList, setKlinikList] = useState([]);
    useEffect(()=>{
        if(canEdit==true){
            if(!master){
                navigate(routes.pegawai);
                return;
            }
        }
    },[]) //eksekusi load yan jika ada datanya

    const updateData = (key, value) => {
        setYan({
            ...yan, [key]: value
        });
        setCanSave(true);
    } //mengganti data dari data yang sudah ada
   
    useEffect(()=>{
        if(canEdit==true){
            if(master){
                const currentData = cloneDeep(master);
                setYan(currentData);
                if(currentData.yan_klinik){
                    setKlinikList({label:currentData.yan_klinik, value:currentData.yan_klinik});
                }
            }
        }
        else{
            const currentData = cloneDeep(yanModel);
            setYan(currentData);
            if(currentData.yan_klinik){
                setKlinikList({label:currentData.yan_klinik, value:currentData.yan_klinik});
            }

        }
    },[JSON.stringify(master)]); //meload data pasien
    
    const updateKlinik= ({label, value})=>{
        console.log(label+"-"+value)
        setKlinikList({label, value});
        updateData("yan_klinik", value);
    }
    const searchKlinik = ({keyword, onLoaded})=>getKlinikLayananList({
        q: keyword,
        onSuccess: onLoaded,
        lok_id: user.currentLocation.lok_id
    });
    const handleSave = (data) => {
        setLoading(true);
        if(canEdit==true){
            saveLayanan({
                onSuccess: (savedData)=>{
                    setYan(savedData);
                    navigate(routes.layanan);
                    setCanEdit(false)
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                },
                lok_id:user.currentLocation.lok_id,
                lok_jenis:user.currentLocation.lok_jenis,
                ...data
            })
        }
        else{
            saveLayanan({
                lok_id:user.currentLocation.lok_id,
                lok_jenis:user.currentLocation.lok_jenis,
                yan_id:'0',
                ...data,
                onSuccess: (savedData)=>{
                    setYan(savedData);
                    navigate(routes.layanan);
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                }
                
            })

        }
        
    }
    const handleBack = () => {
        navigate(routes.layanan);
        setCanEdit(false);
    }
    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            {canEdit==true?
                <AppBar bgColor="bg-red-500" bgHoverColor="hover:bg-red-600"
                    backIcon="IoChevronBackOutline"
                    onBackClick={()=>handleBack()}
                >
                    Layanan Edit
                </AppBar>
                :
                <AppBar bgColor="bg-red-500" bgHoverColor="hover:bg-red-600"
                    backIcon="IoChevronBackOutline"
                    onBackClick={()=>handleBack()}
                >
                    Layanan Tambah
                </AppBar>
            }
            <div className="py-20 px-4">     
                <div className="mb-5 text-xl font-bold">Pengisian yan</div>
                <div className="flex space-x-4">
                    <div className="mb-5">  
                        <div className={CLASS_FIELD_LABEL}>
                            ID
                        </div>
                        {canEdit==true?
                        <div className="relative">
                            <Cleave type="text" className={CLASS_TEXTFIELD}
                                value={yan.yan_id}
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
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                       Nama Layanan
                    </div>
                    <div className="relative">
                        <input type="text" 
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("yan_nama", e.target.value)}
                            value={yan.yan_nama}
                        />
                    </div>
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        Nama Klinik
                    </div>
                    <SelectAsync
                        placeholder="Ketik 3 huruf untuk mencari..."
                        onLoad={searchKlinik}
                        onChange={updateKlinik}
                        selected={klinikList}
                    />
                </div>
            </div>
            <ButtonBlock
                onClick={()=>handleSave(yan)}
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