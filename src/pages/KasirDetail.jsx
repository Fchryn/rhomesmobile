import React, { useContext, useEffect, useState } from "react";
import { getBiayaList, getBiayaKeseluruhan, saveBayar} from "../apis/Kunbiaya";
import { AppContext } from "../App";
import { AppBar } from "../components/AppBar";
import { DEFAULT_ITEM_COUNT, DEFAULT_LIMIT} from "../constants/Entities";
import { CardBiaya } from "../components/CardBiaya";
import { CardBiayaTitle } from "../components/CardBiayaTitle";
import { CLASS_FIELD_LABEL, CLASS_TEXTFIELD } from "../constants/Styles";
import { getBiayaTotal } from "../helper/BiayaHelper";
import { numberToCurrency } from "../helper/Formatter";
import { LoadingOverlay } from "../components/Loading";
import { getKlinikList } from "../apis/Layanan";
import { useNavigate } from "react-router";
import { routes } from "../constants/Urls";
import { Modal } from "../components/Modal";
import { cloneDeep, replace } from "lodash";
import Cleave from "cleave.js/react";
import { ButtonBlock } from "../components/ButtonBlock";

export const KasirDetail = () => {
    const {user, pasienKlinik} = useContext(AppContext);
    const navigate = useNavigate();
    const [listDokter, setListDokter] = useState([]);
    const [listPerawat, setListPerawat] = useState([]);
    const [listTindakan, setListTindakan] = useState([]);
    const [listObat, setListObat] = useState([]);
    const [listInjeksi, setListInjeksi] = useState([]);
    const [listLaborat, setListLaborat] = useState([]);
    const [listRadiologi, setListRadiologi] = useState([]);
    const [listKamar, setListKamar] = useState([]);  
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState([]);
    const [bayarModal, setBayarModal] = useState(false);
    const [bayar, setBayar] = useState([]);
    const [valueKasir, setValueKasir] = useState([]);
    const [checkBank, setCheckBank] = useState(false);
    const [checkPiutang, setCheckPiutang] = useState(false);
    const initBiayaList = async () => {
        if(pasienKlinik < 1){
            navigate("/");
            return;
        }
        setLoading(true);
        let biayaList = [];
        let kunIdList = [];
        
        await Promise.all([
            getBiayaList({
                man_id: pasienKlinik.kun_man_id,
                kun_id: pasienKlinik.kun_id,
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
                man_id: pasienKlinik.kun_man_id,
                onSuccess: (rows)=>{
                    kunIdList = rows.map(row => row.kun_id);
                }
            }),
            getBiayaKeseluruhan({
                kun_id: pasienKlinik.kun_id,
                onSuccess:(rows)=>{
                    console.log(rows);
                    setTotal(rows[2].value);
                    setBayar(rows);
                    
                },
            })
        ]);
        setTimeout(()=>{
            if(biayaList.length > 0){
                let kbiSekarang = [];
                if(kunIdList.length > 0){
                    biayaList.forEach(r=> {
                        kbiSekarang.push(r);
                    });
                }
                setListDokter(kbiSekarang.filter(r=> r.kbi_jns_id === "D"));
                setListPerawat(kbiSekarang.filter(r=> r.kbi_jns_id === "P"));
                setListTindakan(kbiSekarang.filter(r=> r.kbi_jns_id === "T"));
                setListObat(kbiSekarang.filter(r=> r.kbi_jns_id === "O"));
                setListInjeksi(kbiSekarang.filter(r=> r.kbi_jns_id === "I"));
                setListRadiologi(kbiSekarang.filter(r=> r.kbi_jns_id === "R"));
                setListLaborat(kbiSekarang.filter(r=> r.kbi_jns_id === "L"));
                setListKamar(kbiSekarang.filter(r=> r.kbi_jns_id === "K"));
                
            }else{
                setListDokter([]);
                setListPerawat([]);
                setListTindakan([]);
                setListObat([]);
                setListInjeksi([]);
                setListRadiologi([]);
                setListLaborat([]);
                setListKamar([]);
            }
            setLoading(false);
        },100);
    }
    const updateData = (key, value) => {
        setValueKasir({
            ...valueKasir, [key]: value,
        });
    } //mengganti data dari data yang sudah ada

    useEffect(()=>{
        initBiayaList();
    },[]);

    const handleBayar = () =>{
        setBayarModal(true);
        var jsonkasir;
        jsonkasir='{"total_biaya":'+bayar[2].value+','+
        '"kas":'+bayar[8].value+','+
        '"bca":'+bayar[9].value+','+
        '"niaga":'+bayar[10].value+','+
        '"bri":'+bayar[11].value+','+
        '"mandiri":'+bayar[12].value+','+
        '"piutang_bpjs_tkerja":'+bayar[13].value+','+
        '"piutang_bpjs_kesehatan":'+bayar[14].value+','+
        '"piutang_askes":'+bayar[15].value+','+
        '"piutang_taspen":'+bayar[16].value+','+
        '"potongan_harga":'+bayar[17].value+'}'

        var objkasir=JSON.parse(jsonkasir);
        setValueKasir(objkasir);
    }

    const handleSave = () =>{
        let ids = {};  
        let today = new Date();
        var jsonstr='{"total": "18","rows":[]}';
        var obj=JSON.parse(jsonstr);
        var kembalian, kembali, kurangbayar;
        kembalian=bayar[8].value-bayar[2].value
        if(kembalian<0){
            kembali=0;
            kurangbayar=Math.abs(kembalian);
        }
        else{
            kembali=kembalian;
            kurangbayar=0;
        }
        
        bayar.map((item, index) => {ids[item.id] = index});
        bayar[ids["kun_tgbayar"]].value = today.toLocaleDateString(['ban', 'id']);
        bayar[ids["kun_totalbayar"]].value = valueKasir.total_biaya;
        bayar[ids["kun_kembalian"]].value = kembali;
        bayar[ids["kun_kurangbayar"]].value = kurangbayar;
        bayar[ids["61"]].value = valueKasir.kas;
        bayar[ids["57"]].value = valueKasir.bca;
        bayar[ids["58"]].value = valueKasir.niaga;
        bayar[ids["59"]].value = valueKasir.bri;
        bayar[ids["60"]].value = valueKasir.mandiri;
        bayar[ids["64"]].value = valueKasir.piutang_bpjs_tkerja;
        bayar[ids["65"]].value = valueKasir.piutang_bpjs_kesehatan;
        bayar[ids["66"]].value = valueKasir.piutang_askes;
        bayar[ids["67"]].value = valueKasir.piutang_taspen;
        bayar[ids["73"]].value = valueKasir.potongan_harga;
        
        obj['rows'].push(bayar);
        var jsonstr2 = JSON.stringify(obj)
        var jsonstr3 = jsonstr2.split('[[').join('[')
        var jsonstr4 = jsonstr3.split(']}').join('}')
        var prop=JSON.parse(jsonstr4);
        console.log(bayar)
        saveBayar({
            onSuccess: (savedData)=>{
                setBayar(savedData);
                navigate(routes.kasir);
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
            kun_id: pasienKlinik.kun_id,
            sdm_id: user.sdm_id,
            prop: prop,
            ...bayar
        })
    }
    
    return (
        <div className="absolute bg-gray-50 overflow-auto z-10 inset-0">
            <AppBar
                bgColor="bg-orange-400"
                backIcon="IoChevronBackOutline"
                onBackClick={()=>navigate(routes.kasir)}
                bgHoverColor="hover:bg-orange-500"
            >
            <div className="mr-2">
                <div>Kasir Detail Pasien {pasienKlinik.man_nama}</div>
            </div>
            </AppBar>
            { bayarModal==false ? null : 
            <Modal title="Pembayaran" onCancel={()=>setBayarModal(false)}>
                {
                <div>
                    <div className="mb-10">
                        <div className={CLASS_FIELD_LABEL}>
                            Total Biaya
                        </div>
                        <Cleave
                            options={{
                                numeral: true,
                                numeralThousandsGroupStyle: "thousand",
                                prefix:"Rp."
                            }}
                            value={valueKasir.total_biaya}
                            className={CLASS_TEXTFIELD}
                            disabled={true}
                        />
                    </div>
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                            Kembalian
                        </div>
                        <Cleave
                            options={{
                                numeral: true,
                                numeralThousandsGroupStyle: "thousand",
                                prefix:"Rp."
                            }}
                            value={(valueKasir.kas-valueKasir.total_biaya)>0?valueKasir.kas-valueKasir.total_biaya:0}
                            className={CLASS_TEXTFIELD}
                            disabled={true}
                        />
                    </div>
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                            Kurang Bayar
                        </div>
                        <Cleave
                            options={{
                                numeral: true,
                                numeralThousandsGroupStyle: "thousand",
                                prefix:"Rp."
                            }}
                            value={(valueKasir.kas-valueKasir.total_biaya)>0?0:Math.abs(valueKasir.kas-valueKasir.total_biaya)}
                            className={CLASS_TEXTFIELD}
                            disabled={true}
                        />
                    </div>
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                        Kas Lancar
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("kas", e.target.value)}
                                value={valueKasir.kas}
                            />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="mb-5">
                            <div className={CLASS_FIELD_LABEL}>
                                Bank
                            </div>
                            <input type="checkbox" style={{zoom: 1.5}} className={`${"checked:bg-orange-500"} w-3 h-3 cursor-pointer`}
                            checked={checkBank}
                            onChange={()=>setCheckBank(!checkBank)}
                        />
                        </div>
                        <div className="mb-5">
                            <div className={CLASS_FIELD_LABEL}>
                                Piutang
                            </div>
                            <input type="checkbox" style={{zoom: 1.5}} className={`${"checked:bg-orange-500"} w-3 h-3 cursor-pointer`}
                            checked={checkPiutang}
                            onChange={()=>setCheckPiutang(!checkPiutang)}
                        />
                        </div>
                        
                    </div>
                   
                    {!checkBank?
                    <div></div>:
                    <div>
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                        BCA
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("bca", e.target.value)}
                                value={valueKasir.bca}
                            />
                        </div>
                    </div>
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                        Niaga
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("niaga", e.target.value)}
                                value={valueKasir.niaga}
                            />
                        </div>
                    </div>
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                        BRI
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("bri", e.target.value)}
                                value={valueKasir.bri}
                            />
                        </div>
                    </div>
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                        Mandiri
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("mandiri", e.target.value)}
                                value={valueKasir.mandiri}
                            />
                        </div>
                    </div>
                    </div>
                    }
                    {!checkPiutang?
                    <div></div>:
                    <div>
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                        Piutang BPJS Tenaga Kerja
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("piutang_bpjs_tkerja", e.target.value)}
                                value={valueKasir.piutang_bpjs_tkerja}
                            />
                        </div>
                    </div>
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                        Piutang BPJS Kesehatan
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("piutang_bpjs_kesehatan", e.target.value)}
                                value={valueKasir.piutang_bpjs_kesehatan}
                            />
                        </div>
                    </div>
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                        Piutang Askes
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("piutang_askes", e.target.value)}
                                value={valueKasir.piutang_askes}
                            />
                        </div>
                    </div>
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                        Piutang Taspen
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("piutang_taspen", e.target.value)}
                                value={valueKasir.piutang_taspen}
                            />
                        </div>
                    </div>
                    </div>
                    }
                    <div className="mb-12">
                        <div className={CLASS_FIELD_LABEL}>
                        Potongan Harga
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("potongan_harga", e.target.value)}
                                value={valueKasir.potongan_harga}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center px-8 pb-8">
                        <div className="flex items-center justify-center mt-5 w-full md:w-1/2 text-white bg-cyan-500 font-bold p-4 rounded-xl shadow-xl hover:bg-cyan-600"
                            onClick={handleSave}
                        >
                            Terapkan
                        </div>
                    </div>

                </div>    
                }
            </Modal>
            }
            {
                !loading? null :
                <LoadingOverlay/>
            }
            {
                pasienKlinik.length < 1 ? 
                <div className="text-center text-slate-600 pt-20">
                    Belum ada data biaya
                </div> :
                <div className="py-14 px-4">
                    <div className="text-slate-600 flex justify-between p-2">
                        <div className="text-left py-2">Total Biaya = {numberToCurrency(total)}</div>
                        {total<=0?
                        <div></div>:
                        <div className="text-left"><div className="flex w-full md:w-1/2 text-white bg-cyan-500 font-bold py-2 px-4 text-sm rounded-xl shadow-xl hover:bg-cyan-600"
                            onClick={handleBayar}>
                            Bayar
                            </div>
                        </div>
                        }
                    </div>
                    
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
