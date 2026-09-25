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
import { getBangsalList, getRuangList, savePenyakit } from "../apis/Master";
import { PhoneInput } from "../components/PhoneInput";
import { searchArea } from "../apis/Area";

const penyakitModel = {
    kit_nama:"",
    ict_nama:"",
    kit_kode:""
};

export const PenyakitDetail = () => {
    const {master,user,canEdit,setCanEdit} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [penyakit, setPenyakit] = useState(canEdit==true?(master? cloneDeep(master): {}):cloneDeep(penyakitModel));
    const [canSave, setCanSave] = useState(false);

    useEffect(()=>{
        if(canEdit==true){
            if(!master){
                navigate(routes.pegawai);
                return;
            }
        }
    },[]) //eksekusi load penyakit jika ada datanya

    const updateData = (key, value) => {
        console.log(penyakit)
        setPenyakit({
            ...penyakit, [key]: value
        });
        setCanSave(true);
    } //mengganti data dari data yang sudah ada
    
    const handleSave = (data) => {
        console.log(canEdit)
        setLoading(true);
        if(canEdit==true){
            savePenyakit({
                onSuccess: (savedData)=>{
                    setPenyakit(savedData);
                    navigate(routes.penyakit);
                    setCanEdit(false)
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                },
                ict_com_id:user.currentLocation.com_id,
                ...data
            })
        }
        else{
            savePenyakit({
                
                onSuccess: (savedData)=>{
                    setPenyakit(savedData);
                    navigate(routes.penyakit);
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                },
                ict_com_id:user.currentLocation.com_id,
                ict_id:'0',
                ...data,
                
            })

        }
        
    }
    const handleBack = () => {
        navigate(routes.penyakit);
        setCanEdit(false);
    }
    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            {canEdit==true?
                <AppBar bgColor="bg-red-500" bgHoverColor="hover:bg-red-600"
                    backIcon="IoChevronBackOutline"
                    onBackClick={()=>handleBack()}
                >
                    Penyakit Edit
                </AppBar>
                :
                <AppBar bgColor="bg-red-500" bgHoverColor="hover:bg-red-600"
                    backIcon="IoChevronBackOutline"
                    onBackClick={()=>handleBack()}
                >
                    Penyakit Tambah
                </AppBar>
            }
            <div className="py-20 px-4">     
                <div className="mb-5 text-xl font-bold">Pengisian penyakit</div>
                <div className="flex space-x-4">
                    <div className="mb-5">  
                        <div className={CLASS_FIELD_LABEL}>
                            ID
                        </div>
                        {canEdit==true?
                        <div className="relative">
                            <Cleave type="text" className={CLASS_TEXTFIELD}
                                value={penyakit.ict_id}
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
                       Nama Penyakit
                    </div>
                    <div className="relative">
                        <input type="text" 
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kit_nama", e.target.value)}
                            value={penyakit.kit_nama}
                        />
                    </div>
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                       Kode Penyakit
                    </div>
                    <div className="relative">
                        <input type="text" 
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kit_kode", e.target.value)}
                            value={penyakit.kit_kode}
                        />
                    </div>
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                       Nama Grup
                    </div>
                    <div className="relative">
                        <input type="text" 
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("ict_nama", e.target.value)}
                            value={penyakit.ict_nama}
                        />
                    </div>
                </div>
            </div>
            <ButtonBlock
                onClick={()=>handleSave(penyakit)}
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