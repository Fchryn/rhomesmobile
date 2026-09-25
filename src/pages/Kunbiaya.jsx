import React, { useContext, useEffect, useState } from "react";
import { deleteBiaya, getBiayaList, saveBiaya } from "../apis/Kunbiaya";
import { AppContext } from "../App";
import { AppBar } from "../components/AppBar";
import { IconButton } from "../components/IconButton";
import { SaveCancelBtnBlock } from "../components/SaveCancelBtnBlock";
import { DEFAULT_LIMIT} from "../constants/Entities";
import {CardBiaya} from "../components/CardBiaya";
import { CLASS_FIELD_LABEL, CLASS_FIELD_LABEL_ERROR, CLASS_TEXTFIELD } from "../constants/Styles";
import { SelectAsync } from "../components/SelectAsync";
import { getBiaya, getDosisObat } from "../apis/Master";
import { getBiayaTotal } from "../helper/BiayaHelper";
import { ButtonArea } from "../components/ButtonArea";
import { cloneDeep, uniqBy } from "lodash";
import { SelectSimple } from "../components/SelectSimple";
import { getDokter } from "../apis/Sdm";
import Cleave from 'cleave.js/react';
import { numberToCurrency } from "../helper/Formatter";
import { format } from "date-fns";
import { LoadingOverlay } from "../components/Loading";

const kunbiayaModel = {
    kbi_id: "",
    kbi_kun_id: "",
    kbi_jns_id: "",
    kbi_tanggal: "",
    kbi_bea_id: "",
    kbi_sdm_id: "",
    kbi_tin_id: "", 
    kbi_obt_id: "",
    kbi_dos_id: "",
    kbi_harga: "",
    kbi_obt_qty: "",
    kbi_lab_id: "",
    kbi_rad_id: "",
    kbi_kmr_id: "",
    kbi_kmr_tgcheckout: "",
    kbi_total: "",
    kbi_tgcreate: "",
    kbi_ipaddrcreate: "",
    kbi_usercreate: "",
    kbi_tgedit: "",
    kbi_ipaddredit: "",
    kbi_useredit: "",
    bea_nama:""
}

const mandatory = ["kbi_jns_id", "kbi_bea_id"];
const TAB_TITLE ="Berlangsung";
export const Kunbiaya = ({onClose}) => {
    const {pasienKlinik, config, user} = useContext(AppContext);
    const [listLama, setListLama] = useState([]);
    const [listDokter, setListDokter] = useState([]);
    const [listPerawat, setListPerawat] = useState([]);
    const [listTindakan, setListTindakan] = useState([]);
    const [listObat, setListObat] = useState([]);
    const [listInjeksi, setListInjeksi] = useState([]);
    const [listLaborat, setListLaborat] = useState([]);
    const [listRadiologi, setListRadiologi] = useState([]);
    const [listKamar, setListKamar] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    
    const [tabs, setTabs] = useState([{kun_id:"", title:TAB_TITLE}]);
    const [libDokter, setLibDokter] = useState([]);
    const [libDosis, setLibDosis] = useState([]);
    
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [canSave, setCanSave] = useState(false);
    //transaction data
    const [model, setModel] = useState(kunbiayaModel);
    const [kunBiaya, setKunBiaya] = useState(cloneDeep(model));
    const [emptyFields, setEmptyFields] = useState([]);

    const initBiayaList = () => {
        setModel({
            ...kunbiayaModel,
            kbi_kun_id: pasienKlinik.kun_id,
            kun_yan_id: pasienKlinik.kun_yan_id,
            kbi_tanggal: format(new Date(), "MM/dd/yyyy")
        });
        setLoading(true);
        setCanSave(false);
        setSelectedForm(null);
        getBiayaList({
            man_id: pasienKlinik.kun_man_id,
            hwn_id: pasienKlinik.kun_hwn_id,
            page: 1,
            rows: DEFAULT_LIMIT,
            onSuccess:(rows)=>{
                const kbiSekarang = [];
                const kbiLama = [];
                rows.forEach(r=> {
                    if(r.kbi_kun_id === pasienKlinik.kun_id){
                        kbiSekarang.push(r);
                    }else{
                        kbiLama.push(r);
                    }
                });
                setListLama(kbiLama);
                setListDokter(kbiSekarang.filter(r=> r.kbi_jns_id === "D"));
                setListPerawat(kbiSekarang.filter(r=> r.kbi_jns_id === "P"));
                setListTindakan(kbiSekarang.filter(r=> r.kbi_jns_id === "T"));
                setListObat(kbiSekarang.filter(r=> r.kbi_jns_id === "O"));
                setListInjeksi(kbiSekarang.filter(r=> r.kbi_jns_id === "I"));
                setListRadiologi(kbiSekarang.filter(r=> r.kbi_jns_id === "R"));
                setListLaborat(kbiSekarang.filter(r=> r.kbi_jns_id === "L"));
                setListKamar(kbiSekarang.filter(r=> r.kbi_jns_id === "K"));
                setLoading(false);
                setActiveTab(0);
                const tabsLama = uniqBy(kbiLama, "kbi_kun_id").map(kbi => ({
                        kun_id: kbi.kbi_kun_id, 
                        title:`${kbi.kun_noregistrasi} (${kbi.kun_tgcheckin.split(" ")[0]})`
                }));
                setTabs([
                    {kun_id: pasienKlinik.kun_id, title: TAB_TITLE}, 
                    ...tabsLama
                ]);
            },
            onError:(err)=>{
                window.pushToast(err, "error");
                setListLama([]);
                setListDokter([]);
                setListPerawat([]);
                setListTindakan([]);
                setListObat([]);
                setListInjeksi([]);
                setListRadiologi([]);
                setListLaborat([]);
                setListKamar([]);
                setLoading(false);
                setActiveTab(0);
                setTabs([TAB_TITLE]);
            }
        });
    }
    
    const handleSelectTab = (index) => {
        if(index<1){
            initBiayaList();
        }else{
            const listInTab = cloneDeep(listLama.filter(l => l.kbi_kun_id === tabs[index].kun_id));
            setListDokter(listInTab.filter(l=> l.kbi_jns_id === "D"));
            setListPerawat(listInTab.filter(l=> l.kbi_jns_id === "P"));
            setListTindakan(listInTab.filter(l=> l.kbi_jns_id === "T"));
            setListObat(listInTab.filter(l=> l.kbi_jns_id === "O"));
            setListInjeksi(listInTab.filter(l=> l.kbi_jns_id === "I"));
            setListRadiologi(listInTab.filter(l=> l.kbi_jns_id === "R"));
            setListLaborat(listInTab.filter(l=> l.kbi_jns_id === "L"));
            setListKamar(listInTab.filter(l=> l.kbi_jns_id === "K"));
        }
        console.log("index = "+index)
        setActiveTab(index);
    }

    const handleSave = () => {
        //Cek apakah mandatory field ada yang kosong
        const empty = Object.keys(kunBiaya).filter(key => {
            if(mandatory.includes(key) && !kunBiaya[key]){
                return true;
            }
            return false;
        });
        if(empty.length > 0){
            setEmptyFields(empty);
            window.pushToast("Data mandatory harus diisi", "error");
            return;
        }
        setEmptyFields([]);
        setSaving(true);
        kunBiaya.kbi_id = kunBiaya.kbi_id ? kunBiaya.kbi_id : '0' ; //'0' means add new
        kunBiaya.kbi_total = parseInt(kunBiaya.kbi_harga) * (kunBiaya.kbi_obt_qty ? parseInt(kunBiaya.kbi_obt_qty) : 1);
        saveBiaya({
            onSuccess: (savedData) => {
                window.pushToast(`Biaya ${savedData.bea_nama} berhasil disimpan`);
                setSaving(false);
                initBiayaList();
            },
            onError: (err) => {
                window.pushToast(err, "error");
            },
            ...kunBiaya,
        });
    }

    const selectForm = (formId)=> {
        if(selectedForm === formId){
            return;
        }
        setSelectedForm(formId);
        let data;
        const type = formId.substring(0,1);
        const index = formId.substring(1,2);
        switch(type){
            case "D":
                data = listDokter[index];
                break;
            case "P":
                data = listPerawat[index];
                break;
            case "T":
                data = listTindakan[index];
                break;
            case "O":
                data = listObat[index];
                break;
            case "I":
                data = listInjeksi[index];
                break;
            case "L":
                data = listLaborat[index];
                break;
            case "R":
                data = listRadiologi[index];
                break;
            case "K":
                data = listKamar[index];
                break;
            default:
                data = model;
                break;
        }
        setKunBiaya(cloneDeep(data));
    }

    const searchBiaya = ({keyword, onLoaded, jns_id}) => getBiaya({
        q: keyword,
        onSuccess: onLoaded,
        com_id: config.com_id,
        lok_id: user.lok_id,
        yan_id: pasienKlinik.kun_yan_id,
        lok_jenis: user.currentLocation.lok_jenis,
        jns_id: jns_id
    });

    const updateData = (props) => {
        const newKunBiaya = {
            ...kunBiaya,
            ...props
        };
        setKunBiaya(newKunBiaya);
        setCanSave(true);
    }

    const updateBiaya = ({label, value, harga}) => {
        updateData({
            bea_nama: label,
            kbi_bea_id: value,
            kbi_harga: harga
        });
    }

    const tambahDokter = () => {
        const biaya = cloneDeep(model);
        biaya.kbi_jns_id = "D";
        setListDokter([
            ...listDokter,
            biaya
        ]);
        setKunBiaya(biaya);
        setSelectedForm("D"+listDokter.length);
        setCanSave(true);
    }

    const tambahPerawat = () => {
        const biaya = cloneDeep(model);
        biaya.kbi_jns_id = "P";
        setListPerawat([
            ...listPerawat,
            biaya
        ]);
        setKunBiaya(biaya);
        setSelectedForm("P"+listPerawat.length);
        setCanSave(true);
    }

    const tambahTindakan = () => {
        const biaya = cloneDeep(model);
        biaya.kbi_jns_id = "T";
        setListTindakan([
            ...listTindakan,
            biaya
        ]);
        setKunBiaya(biaya);
        setSelectedForm("T"+listTindakan.length);
        setCanSave(true);
    }
    const tambahObat = () => {
        const biaya = cloneDeep(model);
        biaya.kbi_jns_id = "O";
        setListObat([
            ...listObat,
            biaya
        ]);
        setKunBiaya(biaya);
        setSelectedForm("O"+listObat.length);
        setCanSave(true);
    }
    const tambahInjeksi = () => {
        const biaya = cloneDeep(model);
        biaya.kbi_jns_id = "I";
        setListInjeksi([
            ...listInjeksi,
            biaya
        ]);
        setKunBiaya(biaya);
        setSelectedForm("I"+listInjeksi.length);
        setCanSave(true);
    }
    const tambahRadiologi = () => {
        const biaya = cloneDeep(model);
        biaya.kbi_jns_id = "R";
        setListRadiologi([
            ...listRadiologi,
            biaya
        ]);
        setKunBiaya(biaya);
        setSelectedForm("R"+listRadiologi.length);
        setCanSave(true);
    }
    const tambahLaborat = () => {
        const biaya = cloneDeep(model);
        biaya.kbi_jns_id = "L";
        setListLaborat([
            ...listLaborat,
            biaya
        ]);
        setKunBiaya(biaya);
        setSelectedForm("L"+listLaborat.length);
        setCanSave(true);
    }
    const tambahKamar = () => {
        const biaya = cloneDeep(model);
        biaya.kbi_jns_id = "K";
        setListKamar([
            ...listKamar,
            biaya
        ]);
        setKunBiaya(biaya);
        setSelectedForm("K"+listKamar.length);
        setCanSave(true);
    }

    const hapusBiaya = (biaya) => {
        deleteBiaya({
            kbi_id: biaya.kbi_id,
            onSuccess: () => {
                window.pushToast(`Biaya ${biaya.bea_nama} berhasil dihapus`,"error");
                setSaving(false);
                initBiayaList();
            },
            onError: (err) => {
                window.pushToast(err, "error");
            },
        });
    }

    useEffect(()=>{
        initBiayaList();
    },[]);

    useEffect(()=>{
        //load SDM dokter & dosis pada saat form obat
        if(selectedForm && selectedForm.includes("O")){
            getDokter({
                com_id: config.com_id,
                onSuccess: setLibDokter
            });
            getDosisObat({
                onSuccess: setLibDosis
            });
        }
    },[selectedForm])

    const cantUpdate = activeTab > 0;

    return (
        <div className="absolute bg-gray-50 overflow-auto z-10 inset-0">
            <AppBar backIcon="IoChevronBack"
                bgColor="bg-green-500"
                onBackClick={onClose}
                bgHoverColor="hover:bg-green-600"
                tabActive={activeTab}
                tabActiveColor="bg-green-100"
                onTabSelect = {handleSelectTab}
                tabs = {tabs.map(t=>t.title)}
                tabSmall
                disableMenu
            >
                <div>Biaya Kunjungan</div>
                <div className="text-xs">{pasienKlinik.man_nama}</div>
            </AppBar>
                {
                    !loading? null :
                    <LoadingOverlay/>
                }
                <div className="py-28 px-4">
                    <CardBiaya
                        title= "Dokter"
                        biayaCount={listDokter.length}
                        biayaTotal={getBiayaTotal(listDokter)}
                        icon="IoPersonOutline"
                    >
                    {
                        listDokter.map((dok, index) => (
                            <div key={index} className="bg-slate-100 rounded-xl border p-2 mb-5" onClick={()=>selectForm("D"+index)}>
                                {
                                    (!dok.kbi_id && !kunBiaya.kbi_id || cantUpdate)? null :
                                    <div className="flex justify-end">
                                        <IconButton icon={"IoClose"} title="Tutup" color="text-gray-700" bgHoverColor="hover:bg-gray-200"
                                            onClick={()=>hapusBiaya(dok)}
                                        />
                                    </div>
                                }
                                <div className="mb-5">
                                    <div className={
                                            emptyFields.includes("kbi_bea_id")?CLASS_FIELD_LABEL_ERROR :CLASS_FIELD_LABEL
                                        }
                                    >
                                        Nama Dokter
                                    </div>
                                    <div className="relative">
                                        {
                                            selectedForm === "D"+index && !cantUpdate ?
                                            <SelectAsync
                                                placeholder="Cari dokter"
                                                onLoad={(props) => searchBiaya({ jns_id: "D",...props})}
                                                onChange={updateBiaya}
                                                selected={{value: kunBiaya.kbi_bea_id, label: kunBiaya.bea_nama}}
                                            /> :
                                            <div className={CLASS_TEXTFIELD}>{dok.bea_nama}</div>
                                        }
                                    </div>
                                </div>  
                                <div className="mb-2">
                                    <div className={CLASS_FIELD_LABEL}>
                                        Harga
                                    </div>
                                    <div className="relative">
                                        <div className={CLASS_TEXTFIELD}>
                                            {
                                                numberToCurrency( selectedForm === "D"+index ? kunBiaya.kbi_harga : dok.kbi_harga)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                        {
                            canSave || cantUpdate? null:
                            <ButtonArea title="Tambah Dokter" onClick={tambahDokter}/>
                        }   
                    </CardBiaya>
                    <CardBiaya
                        title= "Perawat"
                        biayaCount={listPerawat.length}
                        biayaTotal={getBiayaTotal(listPerawat)}
                        icon="IoPeopleOutline"
                    >
                        {
                            listPerawat.map((prw, index) => (
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5" onClick={()=>selectForm("P"+index)}>
                                    {
                                        (!prw.kbi_id && !kunBiaya.kbi_id || cantUpdate)? null :
                                        <div className="flex justify-end">
                                            <IconButton icon={"IoClose"} title="Tutup" color="text-gray-700" bgHoverColor="hover:bg-gray-200"
                                                onClick={()=>hapusBiaya(prw)}
                                            />
                                        </div>
                                    }
                                    <div className="mb-5">
                                        <div className={
                                                emptyFields.includes("kbi_bea_id")?CLASS_FIELD_LABEL_ERROR :CLASS_FIELD_LABEL
                                            }
                                        >
                                            Nama Perawat
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "P"+index && !cantUpdate?
                                                <SelectAsync
                                                    placeholder="Cari perawat"
                                                    onLoad={(props) => searchBiaya({ jns_id: "P",...props})}
                                                    onChange={updateBiaya}
                                                    selected={{value: kunBiaya.kbi_bea_id, label: kunBiaya.bea_nama}}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{prw.bea_nama}</div>
                                            }
                                        </div>
                                    </div>  
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency( selectedForm === "P"+index ? kunBiaya.kbi_harga : prw.kbi_harga)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }  
                        {
                            canSave || cantUpdate? null:
                            <ButtonArea title="Tambah Perawat" onClick={tambahPerawat}/>
                        } 
                    </CardBiaya>
                    <CardBiaya
                        title= "Tindakan"
                        biayaCount={listTindakan.length}
                        biayaTotal={getBiayaTotal(listTindakan)}
                        icon="IoBandageOutline"
                    >
                        {
                            listTindakan.map((tin, index) => (
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5" onClick={()=>selectForm("T"+index)}>
                                    {
                                        (!tin.kbi_id && !kunBiaya.kbi_id || cantUpdate)? null :
                                        <div className="flex justify-end">
                                            <IconButton icon={"IoClose"} title="Tutup" color="text-gray-700" bgHoverColor="hover:bg-gray-200"
                                                onClick={()=>hapusBiaya(tin)}
                                            />
                                        </div>
                                    }
                                    <div className="mb-5">
                                        <div className={
                                                emptyFields.includes("kbi_bea_id")?CLASS_FIELD_LABEL_ERROR :CLASS_FIELD_LABEL
                                            }
                                        >
                                            Nama Tindakan
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "T"+index && !cantUpdate?
                                                <SelectAsync
                                                    placeholder="Cari tindakan"
                                                    onLoad={(props) => searchBiaya({ jns_id: "T",...props})}
                                                    onChange={updateBiaya}
                                                    selected={{value: kunBiaya.kbi_bea_id, label: kunBiaya.bea_nama}}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{tin.bea_nama}</div>
                                            }
                                        </div>
                                    </div>  
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency( selectedForm === "T"+index ? kunBiaya.kbi_harga : tin.kbi_harga)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }   
                        {
                            canSave  || cantUpdate? null:
                            <ButtonArea title="Tambah Tindakan" onClick={tambahTindakan}/>
                        } 
                    </CardBiaya>
                    <CardBiaya
                        title= "Obat"
                        biayaCount={listObat.length}
                        biayaTotal={getBiayaTotal(listObat)}
                        icon="IoFlaskOutline"
                    >
                        {
                            listObat.map((obt, index) => (
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5" onClick={()=>selectForm("O"+index)}>
                                    {
                                        (!obt.kbi_id && !kunBiaya.kbi_id || cantUpdate)? null :
                                        <div className="flex justify-end">
                                            <IconButton icon={"IoClose"} title="Tutup" color="text-gray-700" bgHoverColor="hover:bg-gray-200"
                                                onClick={()=>hapusBiaya(obt)}
                                            />
                                        </div>
                                    }
                                    <div className="mb-5">
                                        <div className={
                                                emptyFields.includes("kbi_bea_id")?CLASS_FIELD_LABEL_ERROR :CLASS_FIELD_LABEL
                                            }
                                        >
                                            Nama Obat
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "O"+index && !cantUpdate?
                                                <SelectAsync
                                                    placeholder="Cari obat"
                                                    onLoad={(props) => searchBiaya({ jns_id: "O",...props})}
                                                    onChange={updateBiaya}
                                                    selected={{value: kunBiaya.kbi_bea_id, label: kunBiaya.bea_nama}}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{obt.bea_nama}</div>
                                            }
                                        </div>
                                    </div>  
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Nama Dokter
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "O"+index && !cantUpdate?
                                                <SelectSimple
                                                    options={libDokter}
                                                    placeholder="Pilih dokter"
                                                    onChange={(obj)=>
                                                        updateData({
                                                            kbi_sdm_id: obj.value,
                                                            sdm_nama: obj.label
                                                        })
                                                    }
                                                    selected={{label: kunBiaya.sdm_nama, value: kunBiaya.kbi_sdm_id}}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{obt.sdm_nama}</div>
                                            }
                                        </div>
                                    </div> 
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Dosis
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "O"+index && !cantUpdate?
                                                <SelectSimple
                                                    options={libDosis}
                                                    placeholder="Pilih dosis"
                                                    onChange={(obj)=>updateData({kbi_dos_id: obj.value})}
                                                    selected={{label: kunBiaya.kbi_dos_id, value: kunBiaya.kbi_dos_id}}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{obt.kbi_dos_id}</div>
                                            }
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency( selectedForm === "O"+index ? kunBiaya.kbi_harga : obt.kbi_harga)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Qty
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "O"+index && !cantUpdate?
                                                <Cleave
                                                    options={{
                                                        numericOnly:true,
                                                    }}
                                                    value={kunBiaya.kbi_obt_qty}
                                                    className={CLASS_TEXTFIELD}
                                                    onChange={(e)=>updateData({kbi_obt_qty:e.target.value})}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{obt.kbi_obt_qty}</div>
                                            }
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga Total
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                            {
                                                numberToCurrency(
                                                    parseInt(cantUpdate ? obt.kbi_obt_qty: kunBiaya.kbi_obt_qty) * parseInt(obt.kbi_harga)
                                                )
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }   
                        {
                            canSave || cantUpdate? null:
                            <ButtonArea title="Tambah Obat" onClick={tambahObat}/>
                        } 
                    </CardBiaya>
                    <CardBiaya
                        title= "Injeksi"
                        biayaCount={listInjeksi.length}
                        biayaTotal={getBiayaTotal(listInjeksi)}
                        icon="IoEyedropOutline"
                    >
                        {
                            listInjeksi.map((inj, index) => (
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5" onClick={()=>selectForm("I"+index)}>
                                    {
                                        (!inj.kbi_id && !kunBiaya.kbi_id || cantUpdate)? null :
                                        <div className="flex justify-end">
                                            <IconButton icon={"IoClose"} title="Tutup" color="text-gray-700" bgHoverColor="hover:bg-gray-200"
                                                onClick={()=>hapusBiaya(inj)}
                                            />
                                        </div>
                                    }
                                    <div className="mb-5">
                                        <div className={
                                                emptyFields.includes("kbi_bea_id")?CLASS_FIELD_LABEL_ERROR :CLASS_FIELD_LABEL
                                            }
                                        >
                                            Nama Injeksi
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "I"+index && !cantUpdate?
                                                <SelectAsync
                                                    placeholder="Cari injeksi"
                                                    onLoad={(props) => searchBiaya({ jns_id: "I",...props})}
                                                    onChange={updateBiaya}
                                                    selected={{value: kunBiaya.kbi_bea_id, label: kunBiaya.bea_nama}}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{inj.bea_nama}</div>
                                            }
                                        </div>
                                    </div>  
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Nama Dokter
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "I"+index && !cantUpdate?
                                                <SelectSimple
                                                    options={libDokter}
                                                    placeholder="Pilih dokter"
                                                    onChange={
                                                        (obj)=>updateData({
                                                            kbi_sdm_id: obj.value,
                                                            sdm_nama: obj.label
                                                        })
                                                    }
                                                    selected={{label: kunBiaya.sdm_nama, value: kunBiaya.kbi_sdm_id}}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{inj.sdm_nama}</div>
                                            }
                                        </div>
                                    </div> 
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Dosis
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "I"+index && !cantUpdate?
                                                <SelectSimple
                                                    options={libDosis}
                                                    placeholder="Pilih dosis"
                                                    onChange={(obj)=>updateData({kbi_dos_id: obj.value})}
                                                    selected={{label: kunBiaya.kbi_dos_id, value: kunBiaya.kbi_dos_id}}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{inj.kbi_dos_id}</div>
                                            }
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency( selectedForm === "I"+index ? kunBiaya.kbi_harga : inj.kbi_harga)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Qty
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "I"+index && !cantUpdate?
                                                <Cleave
                                                    options={{
                                                        numericOnly:true,
                                                    }}
                                                    value={kunBiaya.kbi_obt_qty}
                                                    className={CLASS_TEXTFIELD}
                                                    onChange={(e)=>updateData({kbi_obt_qty:e.target.value})}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{inj.kbi_obt_qty}</div>
                                            }
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga Total
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                            {
                                                numberToCurrency(
                                                    parseInt(cantUpdate ? inj.kbi_obt_qty: kunBiaya.kbi_obt_qty) * parseInt(inj.kbi_harga)
                                                )
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }    
                        {
                            canSave || cantUpdate? null:
                            <ButtonArea title="Tambah Injeksi" onClick={tambahInjeksi}/>
                        } 
                    </CardBiaya>
                    <CardBiaya
                        title= "Laboraturium"
                        biayaCount={listLaborat.length}
                        biayaTotal={getBiayaTotal(listLaborat)}
                        icon="IoPulseOutline"
                    >
                        {
                            listLaborat.map((lab, index) => (
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5" onClick={()=>selectForm("L"+index)}>
                                    {
                                        (!lab.kbi_id && !kunBiaya.kbi_id || cantUpdate)? null :
                                        <div className="flex justify-end">
                                            <IconButton icon={"IoClose"} title="Tutup" color="text-gray-700" bgHoverColor="hover:bg-gray-200"
                                                onClick={()=>hapusBiaya(lab)}
                                            />
                                        </div>
                                    }
                                    <div className="mb-5">
                                        <div className={
                                                emptyFields.includes("kbi_bea_id")?CLASS_FIELD_LABEL_ERROR :CLASS_FIELD_LABEL
                                            }
                                        >
                                            Nama Lab
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "L"+index && !cantUpdate?
                                                <SelectAsync
                                                    placeholder="Cari lab"
                                                    onLoad={(props) => searchBiaya({ jns_id: "L",...props})}
                                                    onChange={updateBiaya}
                                                    selected={{value: kunBiaya.kbi_bea_id, label: kunBiaya.bea_nama}}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{lab.bea_nama}</div>
                                            }
                                        </div>
                                    </div>  
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                            {
                                                numberToCurrency( selectedForm === "L"+index ? kunBiaya.kbi_harga : lab.kbi_harga)
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }   
                        {
                            canSave || cantUpdate? null:
                            <ButtonArea title="Tambah Lab" onClick={tambahLaborat}/>
                        }
                    </CardBiaya>
                    <CardBiaya
                        title= "Radiologi"
                        biayaCount={listRadiologi.length}
                        biayaTotal={getBiayaTotal(listRadiologi)}
                        icon="IoScanOutline"
                    >
                        {
                            listRadiologi.map((rad, index) => (
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5" onClick={()=>selectForm("R"+index)}>
                                    {
                                        (!rad.kbi_id && !kunBiaya.kbi_id || cantUpdate)? null :
                                        <div className="flex justify-end">
                                            <IconButton icon={"IoClose"} title="Tutup" color="text-gray-700" bgHoverColor="hover:bg-gray-200"
                                                onClick={()=>hapusBiaya(rad)}
                                            />
                                        </div>
                                    }
                                    <div className="mb-5">
                                        <div className={
                                                emptyFields.includes("kbi_bea_id")?CLASS_FIELD_LABEL_ERROR :CLASS_FIELD_LABEL
                                            }
                                        >
                                            Nama Radiologi
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "R"+index && !cantUpdate?
                                                <SelectAsync
                                                    placeholder="Cari radiologi"
                                                    onLoad={(props) => searchBiaya({ jns_id: "R",...props})}
                                                    onChange={updateBiaya}
                                                    selected={{value: kunBiaya.kbi_bea_id, label: kunBiaya.bea_nama}}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{rad.bea_nama}</div>
                                            }
                                        </div>
                                    </div>  
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency( selectedForm === "R"+index ? kunBiaya.kbi_harga : rad.kbi_harga)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }   
                        {
                            canSave  || cantUpdate? null:
                            <ButtonArea title="Tambah Radiologi" onClick={tambahRadiologi}/>
                        }
                    </CardBiaya>
                    <CardBiaya
                        title= "Kamar"
                        biayaCount={listKamar.length}
                        biayaTotal={getBiayaTotal(listKamar)}
                        icon="IoBedOutline"
                    >
                        {
                            listKamar.map((kmr, index) => (
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5" onClick={()=>selectForm("K"+index)}>
                                    {
                                        (!kmr.kbi_id && !kunBiaya.kbi_id || cantUpdate)? null :
                                        <div className="flex justify-end">
                                            <IconButton icon={"IoClose"} title="Tutup" color="text-gray-700" bgHoverColor="hover:bg-gray-200"
                                                onClick={()=>hapusBiaya(kmr)}
                                            />
                                        </div>
                                    }
                                    <div className="mb-5">
                                        <div className={
                                                emptyFields.includes("kbi_bea_id")?CLASS_FIELD_LABEL_ERROR :CLASS_FIELD_LABEL
                                            }
                                        >
                                            Nama Kamar
                                        </div>
                                        <div className="relative">
                                            {
                                                selectedForm === "K"+index && !cantUpdate?
                                                <SelectAsync
                                                    placeholder="Cari kamar"
                                                    onLoad={(props) => searchBiaya({ jns_id: "K",...props})}
                                                    onChange={updateBiaya}
                                                    selected={{value: kunBiaya.kbi_bea_id, label: kunBiaya.bea_nama}}
                                                /> :
                                                <div className={CLASS_TEXTFIELD}>{kmr.bea_nama}</div>
                                            }
                                        </div>
                                    </div>  
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency( selectedForm === "K"+index ? kunBiaya.kbi_harga : kmr.kbi_harga)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }   
                        {
                            canSave  || cantUpdate? null:
                            <ButtonArea title="Tambah Kamar" onClick={tambahKamar}/>
                        }
                    </CardBiaya>
                </div>
            {
                !canSave? null:
                <SaveCancelBtnBlock
                    onSave={handleSave}
                    saveTitle="Simpan"
                    saveBgColor="bg-green-500"
                    saveBgHoverColor="hover:bg-green-600"
                    saveIcon="IoSaveOutline"
                    onCancel={initBiayaList}
                    cancelTitle="Reset"
                    cancelTxtColor="text-green-600"
                    cancelBorderColor="border-green-500"
                    cancelIcon="IoCloseOutline"
                    loading={saving}
                />
            }
        </div>
    )
}
