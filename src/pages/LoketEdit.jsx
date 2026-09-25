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
import { DatePicker } from "../components/DatePicker";
import { SelectSimple } from "../components/SelectSimple";
import { saveLoket, getManusiaLoketList, getLayanan } from "../apis/Loket";
import { listDokterByKelamin } from "../apis/Layanan";
import { getMasterPembayaran, getMasterMitra, getMasterRujukan, getMasterKeperluan } from "../apis/Master";

export const LoketEdit = () => {
    const {pasienKlinik,user,config} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [loket, setLoket] = useState(pasienKlinik? cloneDeep(pasienKlinik): {});
    const [canSave, setCanSave] = useState(false);
    const [dataPasien, setDataPasien] = useState(null);
    const [layananList, setLayananList] = useState([]);
    const [radio, setRadio]=useState(false)
    const [listDokter, setListDokter]=useState([])
    const [pembayaranList, setPembayaranList] = useState([]);
    const [mitraList, setMitraList] = useState([]);
    const [keperluanList, setKeperluanList] = useState([]);
    const [rujukanList, setRujukanList] = useState([]);

    useEffect(()=>{
        if(!pasienKlinik){
            navigate(routes.loket);
            return;
        }
    },[]) //eksekusi load loket jika ada datanya

    const updateData = (key, value) => {
        setLoket({
            ...loket, [key]: value
        });
        setCanSave(true);
    } //mengganti data dari data yang sudah ada
    ////////////////////dropdown nama pasien////////////////////
    const updateDataPasien = ({label, value}) => {
        setDataPasien({label,value});
        updateData("kun_man_id", value);
    }

    const searchPasien = ({keyword, onLoaded})=>getManusiaLoketList({
        man_com_id: config.com_id,
        q: keyword,
        onSuccess: onLoaded
    });
    /////////////////////////use effect untuk dokter sesuai jenis kelamin///////////////////////////////////
    useEffect(()=>{
        if(loket){
            if(radio){
                listDokterByKelamin({
                    kelamin:loket.man_kelamin,
                    com_id:user.currentLocation.com_id,
                    onSuccess: (savedData)=>{
                        savedData==null ? setListDokter([]) : setListDokter(savedData);
                        setLoading(false);
                    },
                })
            }
            else{
                listDokterByKelamin({
                    kelamin:null,
                    com_id:user.currentLocation.com_id,
                    onSuccess: (savedData)=>{
                        savedData==null ? setListDokter([]) : setListDokter(savedData);
                        setLoading(false);
                    },
                })
            }
        }
    },[radio])

    useEffect(()=>{
        setLoading(true);
        Promise.all([
            getLayanan({onSuccess: setLayananList, lok_id: user.currentLocation.lok_id}),
            getMasterPembayaran({onSuccess: setPembayaranList}),
            getMasterRujukan({onSuccess: setRujukanList}),
            getMasterKeperluan({onSuccess: setKeperluanList}),
            getMasterMitra({onSuccess: setMitraList})
        ]).then(()=>{
            setLoading(false);
        });
    },[]); //load semua dropdownlist yang bukan search
   
    useEffect(()=>{
        if(pasienKlinik){
            const currentData = cloneDeep(pasienKlinik);
            setLoket(currentData);
            if(currentData.man_nama){
                setDataPasien({label:currentData.man_nama, value:currentData.kun_man_id});
            }
        }
    },[JSON.stringify(pasienKlinik)]); //meload data pasien
    
    const handleSave = (data) => {
        setLoading(true);
        if(data.kun_man_id && data.kun_yan_id)
            saveLoket({
                onSuccess: (savedData)=>{
                    setLoket(savedData);
                    navigate(routes.loket);
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                },
                lok_id:user.currentLocation.lok_id,
                ...data
            })
        else{
            window.pushToast("Kolom klinik dan kolom nama pasien tidak boleh kosong");
            setLoading(false);
        }
    }

    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar bgColor="bg-lime-500" bgHoverColor="hover:bg-lime-600"
                backIcon="IoChevronBackOutline"
                onBackClick={()=>navigate(routes.loket)}
            >
                Loket Edit
            </AppBar>
            <div className="py-20 px-4">     
                <div className="mb-5 text-xl font-bold">Pengisian Loket</div>
                <div className="flex space-x-4">
                    <div className="mb-5">  
                        <div className={CLASS_FIELD_LABEL}>
                            ID
                        </div>
                        <div className="relative">
                            <Cleave type="text" className={CLASS_TEXTFIELD}
                                value={loket.kun_id}
                                rows={5}
                                disabled={true}
                            />
                        </div>
                    </div>   
                    <div className="mb-5"></div>
                </div>
                <div className="flex space-x-4">
                    <div className="mb-5">  
                        <div className={CLASS_FIELD_LABEL}>
                            No Registrasi
                        </div>
                        <div className="relative">
                            <Cleave type="text" className={CLASS_TEXTFIELD}
                                value={loket.kun_noregistrasi}
                                rows={5}
                                disabled={true}
                            />
                        </div>
                    </div>   
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Status
                        </div>
                        <div className="relative">
                            <Cleave type="text" className={CLASS_TEXTFIELD}
                                value={loket.kun_status}
                                rows={5}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Layanan (Klinik)
                    </div>
                    <SelectSimple
                        onChange={(obj)=>updateData("kun_yan_id", obj.value)}
                        selected={layananList.find(s=>s.value === loket.kun_yan_id)}
                        options={layananList}
                    />
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Nama Pasien
                    </div>
                    <SelectAsync
                        placeholder="Ketik 3 huruf untuk mencari..."
                        onLoad={searchPasien}
                        onChange={updateDataPasien}
                        selected={dataPasien}
                    />
                </div>
                <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Tanggal Check In
                        </div>
                        <div className="relative">
                            <DatePicker
                                dateValue={loket.kun_tgcheckin}
                                onDateChange={(date)=>updateData("kun_tgcheckin",date)}
                            />
                        </div>
                    </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        No Antrian
                    </div>
                    <div className="relative">
                        <Cleave type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kun_noantrian", e.target.value)}
                            value={loket.kun_noantrian}
                            rows={5}
                        />
                    </div>
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        Dokter/DPJP
                    </div>
                    <div className="relative">
                        <SelectSimple
                            onChange={(obj)=>updateData("kun_dokter_sdm_id", obj.value)}
                            selected={listDokter.find(s=>s.value === loket.kun_dokter_sdm_id)}
                            options={listDokter}
                        />
                    </div>
                    <div className="py-3 flex space-x-4">
                        <div className="mb-5">
                            <RadioButton
                            checkedColor={"checked:bg-lime-500"}
                            borderColor={"border-lime-500"}
                            onClick={()=>setRadio(!radio)}
                            isChecked={radio}/>
                        </div>
                        <div className="mb-5">
                            Berdasarkan Jenis Kelamin
                        </div>
                    </div>
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Keperluan
                    </div>
                    <SelectSimple
                        onChange={(obj)=>updateData("kun_keperluan", obj.value)}
                        selected={keperluanList.find(s=>s.value === loket.kun_keperluan)}
                        options={keperluanList}
                    />
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Pembayaran
                    </div>
                    <SelectSimple
                        onChange={(obj)=>updateData("kun_pembayaran", obj.value)}
                        selected={pembayaranList.find(s=>s.value === loket.kun_pembayaran)}
                        options={pembayaranList}
                    />
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Mitra
                    </div>
                    <SelectSimple
                        onChange={(obj)=>updateData("kun_mitra", obj.value)}
                        selected={mitraList.find(s=>s.value === loket.kun_mitra)}
                        options={mitraList}
                        disabled={true}
                    />
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        No Asuransi
                    </div>
                    <div className="relative">
                        <Cleave type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kun_noasuransi", e.target.value)}
                            value={loket.kun_noasuransi}
                            rows={5}
                        />
                    </div>
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Rujukan
                    </div>
                    <SelectSimple
                        onChange={(obj)=>updateData("kun_rujukan", obj.value)}
                        selected={rujukanList.find(s=>s.value === loket.kun_rujukan)}
                        options={rujukanList}
                        menuPlacement="top"
                    />
                </div>
            </div>
            <ButtonBlock
                onClick={()=>handleSave(loket)}
                title="Simpan Data"
                bgColor="bg-lime-500"
                bgHoverColor="hover:bg-lime-600"
                icon="IoSaveOutline"
                disabled = {!canSave}
                loading={loading}
            />
        </div>
    )
}