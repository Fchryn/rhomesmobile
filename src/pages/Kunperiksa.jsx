import Cleave, { contextType } from "cleave.js/react";
import { format } from "date-fns";
import { cloneDeep } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { saveKunperiksa, getKunPeriksaList, searchICD9 } from "../apis/Kunperiksa";
import { listDokterByKelamin } from "../apis/Layanan";
import { AppContext } from "../App";
import { AppBar } from "../components/AppBar";
import { ButtonBlock } from "../components/ButtonBlock";
import { IconButton } from "../components/IconButton";
import { LoadingOverlay } from "../components/Loading";
import { Modal } from "../components/Modal";
import { RadioButton } from "../components/RadioButton";
import { SaveCancelBtnBlock } from "../components/SaveCancelBtnBlock";
import { SelectAsync } from "../components/SelectAsync";
import { SelectSimple } from "../components/SelectSimple";
import { CLASS_FIELD_LABEL, CLASS_TEXTFIELD } from "../constants/Styles";
import { routes } from "../constants/Urls";
import { Kunbiaya } from "./Kunbiaya";
import { Kunobgyn } from "./Kunobgyn";

const kunperiksaModel = {
    kpr_tgperiksa:"",
    kpr_kun_id:"",
    kpr_anamnesa:"",
    kpr_kit_id:"",
    kpr_diagnosa:"",
    kpr_prognosa:"",
    kpr_terapi:"",
    kpr_bb:"",
    kpr_tb:"",
    kpr_nafas:"",
    kpr_sistolik:"",
    kpr_diastolik:"",
    kpr_suhu:"",
    kpr_tgcreate:"",
    kpr_kebidanan:"",
    kpr_saturasi:"",
    kit_nama:"",
};

export const Kunperiksa = () => {
    const {pasienKlinik,user} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(true);
    const [kunPeriksaList, setKunPeriksaList] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [kunPeriksa, setKunPeriksa] = useState(null);
    const [penyakit, setPenyakit] = useState(null);
    const [modeTambah, setModeTambah] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [tampilBiaya, setTampilBiaya] = useState(false);
    
    useEffect(()=>{
        if(!pasienKlinik){
            navigate(routes.klinik);
            return;
        }
        loadKunperiksa();
    },[])
    
    useEffect(()=>{
        if(!pasienKlinik){
            return;
        }
        let kprData;
        if(kunPeriksaList.length==0){
            kprData=cloneDeep(kunperiksaModel);
            kprData.kpr_man_id=pasienKlinik.man_id;
            kprData.kpr_kun_id=pasienKlinik.kun_id;
        }
        else{
            kprData = cloneDeep(kunPeriksaList[activeTab]);
            if(kprData && kprData.kpr_kit_id){
                setPenyakit({label:kprData.kit_nama, value:kprData.kpr_kit_id});
            }else{
                setPenyakit({label:null, value:null});
            }
        }
        setKunPeriksa(kprData);
    },[activeTab,kunPeriksaList])

    const loadKunperiksa = () => {
        setLoading(true);
        setSaving(false);
        setModeTambah(false);
        getKunPeriksaList({
            man_id:pasienKlinik.kun_man_id,
            kun_id:pasienKlinik.kun_id,
            onSuccess: (savedData)=>{
                savedData==null ? setKunPeriksaList([]) : setKunPeriksaList(savedData);
                setLoading(false);
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            }
        });
    }

    function getPeriksaTab(){
        return kunPeriksaList.map((periksa)=>{
            if(!periksa.kpr_id){
                return "Data Baru";
            }
            return `${periksa.kpr_id} (${periksa.kpr_tgperiksa})` ;
        })
    }

    const updateData = (key, value) => {
        setKunPeriksa({
            ...kunPeriksa, [key]: value
        });
        setCanSave(true);
    }

    const updatePenyakit = ({label, value}) => {
        setPenyakit({label, value});
        updateData("kpr_kit_id", value);
    }

    const tambahKpr = () =>{
        const kprModel=cloneDeep(kunperiksaModel);
        kprModel.kpr_kun_id=pasienKlinik.kun_id;
        setKunPeriksaList([
            kprModel,
            ...kunPeriksaList
        ]);
        setModeTambah(true);
        setActiveTab(0);
    }
    const loadPenyakit = ({keyword,onLoaded}) => {
        searchICD9({q:keyword,onSuccess:onLoaded});
    }
    const handleSave = (data) => {
        setSaving(true);
        if(modeTambah){
            data.kpr_tgperiksa=format(new Date(), "MM/dd/y")
            saveKunperiksa({
                onSuccess: (savedData)=>{
                    if(savedData){
                        setKunPeriksa(savedData);       
                        window.pushToast("Data pemeriksaan berhasil disimpan");
                    }
                    setModeTambah(true);
                    loadKunperiksa();
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    loadKunperiksa();
                },
                kpr_id:'0',
                ...data
            });    
        }
        else{
            saveKunperiksa({
                onSuccess: (savedData)=>{
                    updatePenyakit(savedData);
                    window.pushToast("Data pemeriksaan berhasil disimpan");
                    setCanSave(false);
                    loadKunperiksa();
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    loadKunperiksa();
                },
                ...data
            });
        }
    }
    
    const handleCancel = () => {
        setCanSave(false);
        loadKunperiksa();
    }

    const switchTab = (tabNo) => {
        if(!modeTambah){
            setActiveTab(tabNo);
        }
    }

    const getKlinikKhusus = () => {
        switch(pasienKlinik.yan_kode){
            case "OBG":
                return <Kunobgyn kpr_id={kunPeriksa.kpr_id}/>
            default:
                return null;
        }
    }

    if(kunPeriksa==null){
        return <div></div>
    }
    if(kunPeriksaList.length==0){
        return (
        <div>
            <div className="h-screen bg-gray-50 overflow-auto"> 
                <AppBar 
                    bgColor="bg-blue-500"
                    bgHoverColor="hover:bg-blue-600"
                    backIcon="IoChevronBack"
                    onBackClick={()=>navigate(routes.klinik)}
                >
                    {pasienKlinik && pasienKlinik.man_nama}
                </AppBar>
                <div className="text-center pt-28">
                    Belum ada Pemeriksaan
                </div>
                <ButtonBlock
                    onClick={()=>tambahKpr()}
                    title="Tambah Data"
                    bgColor="bg-blue-500"
                    bgHoverColor="hover:bg-blue-600"
                />
            </div>
        </div>
        )
    }
    return( 
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar
                bgColor="bg-blue-500" 
                bgHoverColor="hover:bg-blue-600"
                tabs={getPeriksaTab()}
                tabActive={activeTab}
                onTabSelect={switchTab}
                tabActiveColor="bg-blue-200"
                backIcon="IoChevronBack"
                onBackClick={()=>navigate(routes.klinik)}
                tabSmall
            >
                {pasienKlinik.man_nama}
            </AppBar>
            {
                !loading? null : 
                <LoadingOverlay/>
            }
            
            <div className="py-32 px-4">     
                <div className="mb-5 text-xl font-bold">Pemeriksaan Umum</div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Anamnesa
                    </div>
                    <div className="relative">
                        <textarea type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kpr_anamnesa", e.target.value)}
                            value={kunPeriksa.kpr_anamnesa}
                            rows={5}
                        />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Tinggi Badan (Cm)
                        </div>
                        <Cleave
                            options={{
                                numericOnly:true,
                            }}
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kpr_tb", e.target.value)}
                            value={kunPeriksa.kpr_tb}
                            maxLength={3}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Berat Badan (Kg)
                        </div>
                        <Cleave
                            options={{
                                numericOnly:true,
                            }}
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kpr_bb", e.target.value)}
                            value={kunPeriksa.kpr_bb}
                            maxLength={3}
                        />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Nafas (x per menit)
                        </div>
                        <Cleave
                            options={{
                                numericOnly:true,
                            }}
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kpr_nafas", e.target.value)}
                            value={kunPeriksa.kpr_nafas}
                            maxLength={3}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Suhu (ºC)
                        </div>
                        <Cleave
                            options={{
                                numericOnly:true,
                            }}
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kpr_suhu", e.target.value)}
                            value={kunPeriksa.kpr_suhu}
                            maxLength={3}
                        />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Tensi (Sistolik [mmhg])
                        </div>
                        <Cleave
                            options={{
                                numericOnly:true,
                            }}
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kpr_sistolik", e.target.value)}
                            value={kunPeriksa.kpr_sistolik}
                            maxLength={3}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Tensi (Diastolik [mmhg])
                        </div>
                        <Cleave
                            options={{
                                numericOnly:true,
                            }}
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kpr_diastolik", e.target.value)}
                            value={kunPeriksa.kpr_diastolik}
                            maxLength={3}
                        />
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Saturasi Oksigen (%)
                        </div>
                        <Cleave
                            options={{
                                numericOnly:true,
                            }}
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kpr_saturasi", e.target.value)}
                            value={kunPeriksa.kpr_saturasi}
                            maxLength={3}
                        />
                    </div>
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Diagnosa
                    </div>
                    <div className="relative">
                        <textarea type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kpr_diagnosa", e.target.value)}
                            value={kunPeriksa.kpr_diagnosa}
                            rows={5}
                        />
                    </div>
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        ICD 9
                    </div>
                    <div className="relative">
                        <SelectAsync
                            placeholder="Ketik 3 huruf untuk mencari..."
                            onLoad={loadPenyakit}
                            onChange={updatePenyakit}
                            selected={penyakit}
                        />
                    </div>
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Prognosa
                    </div>
                    <div className="relative">
                        <textarea type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kpr_prognosa", e.target.value)}
                            value={kunPeriksa.kpr_prognosa}
                            rows={5}
                        />
                    </div>
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Terapi
                    </div>
                    <div className="relative">
                        <textarea type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("kpr_terapi", e.target.value)}
                            value={kunPeriksa.kpr_terapi}
                            rows={5}
                        />
                    </div>
                </div>                
            </div>
            {getKlinikKhusus()}
            {
                tampilBiaya? <Kunbiaya onClose={()=>setTampilBiaya(false)}/> : null
            }
            {
                modeTambah || canSave? null:
                <div>
                    <IconButton bigger
                        bgColor="bg-green-500"
                        bgHoverColor="hover:bg-green-600"
                        color="text-white"
                        title="Biaya"
                        onClick={()=>setTampilBiaya(true)}
                        customClass = "fixed bottom-16 right-4 shadow-xl"
                        icon="IoCashOutline"
                    />
                    <IconButton bigger
                        bgColor="bg-blue-400"
                        bgHoverColor="hover:bg-blue-500"
                        color="text-white"
                        title="Tambah Pemeriksaan"
                        onClick={()=>tambahKpr()}
                        customClass = "fixed bottom-4 right-4 shadow-xl"
                        icon="IoAddOutline"
                    />
                </div>
            }
            {
                (!modeTambah && !canSave) ? null:
                <SaveCancelBtnBlock
                    onSave={()=>handleSave(kunPeriksa)}
                    saveTitle="Simpan"
                    saveBgColor="bg-blue-500"
                    saveBgHoverColor="hover:bg-blue-600"
                    saveIcon="IoSaveOutline"
                    onCancel={handleCancel}
                    cancelTitle="Batal"
                    cancelTxtColor="text-blue-600"
                    cancelBorderColor="border-blue-500"
                    cancelIcon="IoCloseOutline"
                    loading={saving}
                />
            }
        </div>
    )
}