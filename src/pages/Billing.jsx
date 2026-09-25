import React, { useContext, useEffect, useState } from "react";
import { getBiayaList} from "../apis/Kunbiaya";
import { AppContext } from "../App";
import { AppBar } from "../components/AppBar";
import { DEFAULT_ITEM_COUNT, DEFAULT_LIMIT} from "../constants/Entities";
import {CardBiaya} from "../components/CardBiaya";
import { CLASS_FIELD_LABEL, CLASS_TEXTFIELD } from "../constants/Styles";
import { getBiayaTotal } from "../helper/BiayaHelper";
import { cloneDeep, uniqBy } from "lodash";
import { numberToCurrency } from "../helper/Formatter";
import { LoadingOverlay } from "../components/Loading";
import { IoChevronDown } from "react-icons/io5";
import { getKlinikList } from "../apis/Layanan";
import { Modal } from "../components/Modal";
import { RadioButton } from "../components/RadioButton";
import { useNavigate } from "react-router";

const TAB_TITLE ="Tagihan/Belum Lunas";
export const Billing = ({onClose}) => {
    const {pasienList, setPasienIndex, user} = useContext(AppContext);
    const navigate = useNavigate();
    const [listLama, setListLama] = useState([]);
    const [listDokter, setListDokter] = useState([]);
    const [listPerawat, setListPerawat] = useState([]);
    const [listTindakan, setListTindakan] = useState([]);
    const [listObat, setListObat] = useState([]);
    const [listInjeksi, setListInjeksi] = useState([]);
    const [listLaborat, setListLaborat] = useState([]);
    const [listRadiologi, setListRadiologi] = useState([]);
    const [listKamar, setListKamar] = useState([]);
    
    const [tabs, setTabs] = useState([{kun_id:"", title:TAB_TITLE}]);    
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [pasienModal, setPasienModal] = useState(false);
    
    const index = user.pasienIndex === undefined? 0 : user.pasienIndex;

    const initBiayaList = async () => {
        if(pasienList.length < 1){
            navigate("/");
            return;
        }
        setLoading(true);
        let biayaList = [];
        let kunIdList = [];
        await Promise.all([
            getBiayaList({
                man_id: pasienList[index].man_id,
                hwn_id: null,
                page: 1,
                rows: DEFAULT_LIMIT,
                onSuccess:(rows)=>{
                    biayaList = rows;
                },
                onError:(err)=>{
                    window.pushToast(err, "error");
                }
            }),
            getKlinikList({
                page: 1,
                lok_id:user.currentLocation.lok_id,
                rows: DEFAULT_ITEM_COUNT,
                man_id: pasienList[index].man_id,
                onSuccess: (rows)=>{
                    kunIdList = rows.map(row => row.kun_id);
                }
            })
        ]);
        setTimeout(()=>{
            if(biayaList.length > 0){
                let kbiSekarang = [];
                let kbiLama = [];
                if(kunIdList.length > 0){
                    biayaList.forEach(r=> {
                        if(kunIdList.includes(r.kbi_kun_id)){
                            kbiSekarang.push(r);
                        }else{
                            kbiLama.push(r);
                        }
                    });
                }else{
                    kbiLama = biayaList;
                }
                setListLama(kbiLama);
                setListDokter(kbiSekarang.filter(r=> r.kbi_jns_id === "D"));
                setListPerawat(kbiSekarang.filter(r=> r.kbi_jns_id === "P"));
                setListTindakan(kbiSekarang.filter(r=> r.kbi_jns_id === "T"));
                setListObat(kbiSekarang.filter(r=> r.kbi_jns_id === "O"));
                setListInjeksi(kbiSekarang.filter(r=> r.kbi_jns_id === "I"));
                setListRadiologi(kbiSekarang.filter(r=> r.kbi_jns_id === "R"));
                setListLaborat(kbiSekarang.filter(r=> r.kbi_jns_id === "L"));
                setListKamar(kbiSekarang.filter(r=> r.kbi_jns_id === "K"));
                const tabsLama = uniqBy(kbiLama, "kbi_kun_id").map(kbi => ({
                        kun_id: kbi.kbi_kun_id, 
                        title:`${kbi.kun_noregistrasi} (${kbi.kun_tgcheckin.split(" ")[0]})`
                }));
                setTabs([
                    {kun_id: '0', title: TAB_TITLE}, 
                    ...tabsLama
                ]);
            }else{
                setListLama([]);
                setListDokter([]);
                setListPerawat([]);
                setListTindakan([]);
                setListObat([]);
                setListInjeksi([]);
                setListRadiologi([]);
                setListLaborat([]);
                setListKamar([]);
                setTabs([]);
            }
            setLoading(false);
            setActiveTab(0);
        },100);
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

    useEffect(()=>{
        initBiayaList();
    },[index]);

    return (
        <div className="absolute bg-gray-50 overflow-auto z-10 inset-0">
            <AppBar backIcon="IoChevronBack"
                bgColor="bg-green-500"
                onBackClick={onClose}
                bgHoverColor="hover:bg-green-500"
                tabActive={activeTab}
                tabActiveColor="bg-green-100"
                onTabSelect = {handleSelectTab}
                tabs = {tabs.map(t=>t.title)}
                tabSmall
                disableMenu
            >
                <div className="flex items-center">
                    <div className="mr-3 cursor-pointer flex items-center hover:text-pink-100" onClick={()=>setPasienModal(true)}>
                        <div className="mr-2">
                            <div>Biaya Kunjungan</div>
                            {
                                pasienList.length < 1 ? null : 
                                <div className="text-xs font-light">
                                    {pasienList[index].man_nama}
                                </div>
                            }
                        </div>
                        <IoChevronDown/>
                    </div>
                </div>
            </AppBar>
            {
                !loading? null :
                <LoadingOverlay/>
            }
            {
                !pasienModal? null:
                <Modal title="Pilih Pasien"
                    onCancel={()=>setPasienModal(false)}
                >
                {
                    pasienList.map((p,idx) => (
                        <div className="flex items-center flex-grow mb-3" key={idx}>
                            <RadioButton
                                checkedColor={"checked:bg-pink-500"}
                                borderColor={"border-pink-500"}
                                onClick={()=>setPasienIndex(idx)}
                                isChecked={idx === index}
                            />
                            <div>
                                {p.man_nama} ({p.man_kelamin})
                            </div>
                        </div>
                    ))
                }
                </Modal>
            }
            {
                tabs.length < 1 ? 
                <div className="text-center text-slate-600 pt-20">
                    Belum ada data biaya
                </div> :
                <div className="py-28 px-4">
                    <CardBiaya
                        title= "Dokter"
                        biayaCount={listDokter.length}
                        biayaTotal={getBiayaTotal(listDokter)}
                        icon="IoPersonOutline"
                    >
                    {
                        listDokter.map((dok, index) => (
                            <div key={index} className="bg-slate-100 rounded-xl border p-2 mb-5">
                                <div className="mb-5">
                                    <div className={CLASS_FIELD_LABEL}
                                    >
                                        Nama Dokter
                                    </div>
                                    <div className="relative">
                                        <div className={CLASS_TEXTFIELD}>{dok.bea_nama}</div>
                                    </div>
                                </div>  
                                <div className="mb-2">
                                    <div className={CLASS_FIELD_LABEL}>
                                        Harga
                                    </div>
                                    <div className="relative">
                                        <div className={CLASS_TEXTFIELD}>
                                            {
                                                numberToCurrency(dok.kbi_harga)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
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
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5">
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}
                                        >
                                            Nama Perawat
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{prw.bea_nama}</div>
                                        </div>
                                    </div>  
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency(prw.kbi_harga)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
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
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5">
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}
                                        >
                                            Nama Tindakan
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{tin.bea_nama}</div>
                                        </div>
                                    </div>  
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency(tin.kbi_harga)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
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
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5">
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}
                                        >
                                            Nama Obat
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{obt.bea_nama}</div>
                                        </div>
                                    </div>  
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Nama Dokter
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{obt.sdm_nama}</div>
                                        </div>
                                    </div> 
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Dosis
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{obt.kbi_dos_id}</div>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency( obt.kbi_harga )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Qty
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{obt.kbi_obt_qty}</div>
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
                                                    parseInt(obt.kbi_obt_qty) * parseInt(obt.kbi_harga)
                                                )
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
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
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5">
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}
                                        >
                                            Nama Injeksi
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{inj.bea_nama}</div>
                                        </div>
                                    </div>  
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Nama Dokter
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{inj.sdm_nama}</div>
                                        </div>
                                    </div> 
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Dosis
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{inj.kbi_dos_id}</div>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency( inj.kbi_harga)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Qty
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{inj.kbi_obt_qty}</div>
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
                                                    parseInt(inj.kbi_obt_qty) * parseInt(inj.kbi_harga)
                                                )
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
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
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5">
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL }
                                        >
                                            Nama Lab
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{lab.bea_nama}</div>
                                        </div>
                                    </div>  
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                            {
                                                numberToCurrency( lab.kbi_harga)
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
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
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5">
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}
                                        >
                                            Nama Radiologi
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{rad.bea_nama}</div>
                                        </div>
                                    </div>  
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency(rad.kbi_harga)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
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
                                <div key={index} className="bg-slate-100 rounded-xl border p-3 mb-5">
                                    <div className="mb-5">
                                        <div className={CLASS_FIELD_LABEL}
                                        >
                                            Nama Kamar
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>{kmr.bea_nama}</div>
                                        </div>
                                    </div>  
                                    <div className="mb-2">
                                        <div className={CLASS_FIELD_LABEL}>
                                            Harga
                                        </div>
                                        <div className="relative">
                                            <div className={CLASS_TEXTFIELD}>
                                                {
                                                    numberToCurrency(kmr.kbi_harga)
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        } 
                    </CardBiaya>
                </div>
            }
        </div>
    )
}
