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
import { getMasterJabatan, getMasterKelamin, savePegawai } from "../apis/Master";
import { PhoneInput } from "../components/PhoneInput";
import { searchArea } from "../apis/Area";

const sdmModel = {
    sdm_nama:"",
    sdm_kelamin:"",
    sdm_jab_id:"",
    sdm_subjabatan:"",
    sdm_nip:"",
    sdm_harga:"",
    sdm_telpon:"",
    sdm_alamat:"",
    sdm_are_id:"",
    are_nama:"",
};

export const PegawaiDetail = () => {
    const {master,user,canEdit,setCanEdit} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [sdm, setSdm] = useState(canEdit==true?(master? cloneDeep(master): {}):cloneDeep(sdmModel));
    const [canSave, setCanSave] = useState(false);
    const [jabatanList, setJabatanList] = useState([]);
    const [kelaminList, setKelaminList] = useState([]);
    const [tempatLahir, setTempatLahir] = useState(null);

    useEffect(()=>{
        if(canEdit==true){
            if(!master){
                navigate(routes.pegawai);
                return;
            }
        }
    },[]) //eksekusi load sdm jika ada datanya

    const updateData = (key, value) => {
        setSdm({
            ...sdm, [key]: value
        });
        setCanSave(true);
    } //mengganti data dari data yang sudah ada

    useEffect(()=>{
        setLoading(true);
        Promise.all([
            getMasterKelamin({onSuccess: setKelaminList}),
            getMasterJabatan({onSuccess: setJabatanList, com_id: user.currentLocation.com_id})
        ]).then(()=>{
            setLoading(false);
        });
    },[]); //load semua dropdownlist yang bukan search
   
    useEffect(()=>{
        if(canEdit==true){
            if(master){
                const currentData = cloneDeep(master);
                setSdm(currentData);
                if(currentData.are_nama){
                    setTempatLahir({label:currentData.are_nama, value:currentData.sdm_are_id});
                }
            }
        }
        else{
            const currentData = cloneDeep(sdmModel);
            setSdm(currentData);
            if(currentData.are_nama){
                setTempatLahir({label:currentData.are_nama, value:currentData.sdm_are_id});
            }

        }
    },[JSON.stringify(master)]); //meload data pasien
    
    const updateTempatLahir= ({label, value})=>{
        setTempatLahir({label, value});
        updateData("sdm_are_id", value);
    }
    const searchKota = ({keyword, onLoaded})=>searchArea({
        q: keyword,
        onSuccess: onLoaded
    });
    const handleSave = (data) => {
        setLoading(true);
        if(canEdit==true){
            savePegawai({
                onSuccess: (savedData)=>{
                    setSdm(savedData);
                    navigate(routes.pegawai);
                    setCanEdit(false)
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                },
                sdm_com_id:user.currentLocation.com_id,
                ...data
            })
        }
        else{
            savePegawai({
                sdm_com_id:user.currentLocation.com_id,
                sdm_id:'0',
                ...data,
                onSuccess: (savedData)=>{
                    setSdm(savedData);
                    navigate(routes.pegawai);
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                }
                
            })

        }
        
    }
    const handleBack = () => {
        navigate(routes.pegawai);
        setCanEdit(false);
    }
    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            {canEdit==true?
                <AppBar bgColor="bg-red-500" bgHoverColor="hover:bg-red-600"
                    backIcon="IoChevronBackOutline"
                    onBackClick={()=>handleBack()}
                >
                    Pegawai Edit
                </AppBar>
                :
                <AppBar bgColor="bg-red-500" bgHoverColor="hover:bg-red-600"
                    backIcon="IoChevronBackOutline"
                    onBackClick={()=>handleBack()}
                >
                    Pegawai Tambah
                </AppBar>
            }
            <div className="py-20 px-4">     
                <div className="mb-5 text-xl font-bold">Pengisian sdm</div>
                <div className="flex space-x-4">
                    <div className="mb-5">  
                        <div className={CLASS_FIELD_LABEL}>
                            ID
                        </div>
                        {canEdit==true?
                        <div className="relative">
                            <Cleave type="text" className={CLASS_TEXTFIELD}
                                value={sdm.sdm_id}
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
                                value={sdm.sdm_status}
                                rows={5}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                       Nama Pegawai
                    </div>
                    <div className="relative">
                        <input type="text" 
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("sdm_nama", e.target.value)}
                            value={sdm.sdm_nama}
                        />
                    </div>
                </div>
                <div className="mb-6">
                        <div 
                            className={
                                CLASS_FIELD_LABEL
                            }
                        >
                            Jenis Kelamin
                        </div>
                        <div className={`flex items-center rounded-xl`}>
                        {
                            kelaminList.map((kl,index)=>(
                                <div className="flex items-center flex-grow" key={index}>
                                    <RadioButton
                                        checkedColor={"checked:bg-pink-500"}
                                        borderColor={"border-pink-500"}
                                        onClick={()=>updateData("sdm_kelamin", kl.value)}
                                        isChecked={sdm.sdm_kelamin === kl.value}
                                    />
                                    <div>
                                        {kl.label}
                                    </div>
                                </div>
                            ))
                        }
                        </div>        
                    </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        Jabatan
                    </div>
                    <SelectSimple
                        onChange={(obj)=>updateData("sdm_jab_id", obj.value)}
                        selected={jabatanList.find(s=>s.value === sdm.sdm_jab_id)}
                        options={jabatanList}
                    />
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                       Nama Sub Jabatan
                    </div>
                    <div className="relative">
                        <input type="text" 
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("sdm_subjabatan", e.target.value)}
                            value={sdm.sdm_subjabatan}
                        />
                    </div>
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        NIP
                    </div>
                    <Cleave
                        options={{
                            numericOnly:true,
                        }}
                        maxLength={16}
                        value={sdm.sdm_nip}
                        className={CLASS_TEXTFIELD}
                        onChange={(e)=>updateData("sdm_nip",e.target.value)}
                    />
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        Harga
                    </div>
                    <Cleave
                        options={{
                            numericOnly:true,
                        }}
                        maxLength={12}
                        value={sdm.sdm_harga}
                        className={CLASS_TEXTFIELD}
                        onChange={(e)=>updateData("sdm_harga",e.target.value)}
                    />
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        No. Telepon/HP
                    </div>
                    <PhoneInput value={sdm.sdm_telpon}
                        onChange={(e)=>updateData("sdm_telpon",e.target.value)}
                    />
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                       Alamat
                    </div>
                    <div className="relative">
                        <input type="text" 
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("sdm_alamat", e.target.value)}
                            value={sdm.sdm_alamat}
                        />
                    </div>
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Kota
                    </div>
                    <div className="relative">
                        <SelectAsync
                            placeholder="Ketik 3 huruf untuk mencari..."
                            onLoad={searchKota}
                            onChange={updateTempatLahir}
                            selected={tempatLahir}
                        />
                    </div>
                </div>
            </div>
            <ButtonBlock
                onClick={()=>handleSave(sdm)}
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