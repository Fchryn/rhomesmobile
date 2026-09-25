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
import { dghrMasterList, dgtiMasterList, saveDksTindakan } from "../apis/Master";
import { PhoneInput } from "../components/PhoneInput";
import { searchArea } from "../apis/Area";

const dhtiModel = {
    dtin_nama:"",
    dgti_id:"",
    dhti_jab_id:"",
    dhti_subjabatan:"",
    dhti_nip:"",
    dhti_harga:"",
    dhti_telpon:"",
    dhti_alamat:"",
    dhti_are_id:"",
    are_nama:"",
};

export const DksTindakanDetail = () => {
    const {master,user,canEdit,setCanEdit} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dhti, setdhti] = useState(canEdit==true?(master? cloneDeep(master): {}):cloneDeep(dhtiModel));
    const [canSave, setCanSave] = useState(false);
    const [dghrList, setDghrList] = useState([]);
    const [dgtiList, setDgtiList] = useState([]);
    const [tempatLahir, setTempatLahir] = useState(null);

    useEffect(()=>{
        if(canEdit==true){
            if(!master){
                navigate(routes.tindakan);
                return;
            }
        }
    },[]) //eksekusi load dhti jika ada datanya

    const updateData = (key, value) => {
        setdhti({
            ...dhti, [key]: value
        });
        setCanSave(true);
    } //mengganti data dari data yang sudah ada

    useEffect(()=>{
        setLoading(true);
        Promise.all([
            dghrMasterList({onSuccess: setDghrList}),
            dgtiMasterList({onSuccess: setDgtiList})
        ]).then(()=>{
            setLoading(false);
        });
    },[]); //load semua dropdownlist yang bukan search
   
    const handleSave = (data) => {
        setLoading(true);
        if(canEdit==true){
            saveDksTindakan({
                onSuccess: (savedData)=>{
                    setdhti(savedData);
                    navigate(routes.tindakan);
                    setCanEdit(false)
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                },
                dhti_com_id:user.currentLocation.com_id,
                ...data
            })
        }
        else{
            saveDksTindakan({
                dhti_com_id:user.currentLocation.com_id,
                dhti_id:'0',
                ...data,
                onSuccess: (savedData)=>{
                    setdhti(savedData);
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
                <div className="mb-5 text-xl font-bold">Pengisian Tindakan</div>
                <div className="flex space-x-4">
                    <div className="mb-5">  
                        <div className={CLASS_FIELD_LABEL}>
                            ID
                        </div>
                        {canEdit==true?
                        <div className="relative">
                            <Cleave type="text" className={CLASS_TEXTFIELD}
                                value={dhti.dhti_id}
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
                                value={dhti.dtin_status}
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
                            onChange={(e)=>updateData("dtin_nama", e.target.value)}
                            value={dhti.dtin_nama}
                        />
                    </div>
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        Grup Tindakan
                    </div>
                    <SelectSimple
                        onChange={(obj)=>updateData("dhti_dgti_id", obj.value)}
                        selected={dgtiList.find(s=>s.value === dhti.dhti_dgti_id)}
                        options={dgtiList}
                    />
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        Grup Harga
                    </div>
                    <SelectSimple
                        onChange={(obj)=>updateData("dhti_dghr_id", obj.value)}
                        selected={dghrList.find(s=>s.value === dhti.dhti_dghr_id)}
                        options={dghrList}
                    />
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                       Harga
                    </div>
                    <div className="relative">
                        <input type="text" 
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("dhti_harga", e.target.value)}
                            value={dhti.dhti_harga}
                        />
                    </div>
                </div>
                
            </div>
            <ButtonBlock
                onClick={()=>handleSave(dhti)}
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