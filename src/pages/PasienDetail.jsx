import Cleave from 'cleave.js/react';
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { searchArea, searchAreaDesa } from "../apis/Area";
import { getMasterAgama, getMasterBangsa, getMasterFamily, getMasterGolDarah, getMasterKelamin, getMasterKerja, getMasterPembayaran, getMasterPendidikan, getMasterStatusNikah, getMasterSuku } from "../apis/Master";
import { getIbuList } from "../apis/Manusia";
import { AppContext } from "../App";
import { AppBar } from "../components/AppBar";
import { ButtonBlock } from "../components/ButtonBlock";
import { DatePicker } from "../components/DatePicker";
import { LoadingOverlay } from "../components/Loading";
import { RadioButton } from "../components/RadioButton";
import { SelectAsync } from "../components/SelectAsync";
import { SelectSimple } from "../components/SelectSimple";
import { CLASS_FIELD_LABEL, CLASS_FIELD_LABEL_ERROR, CLASS_TEXTFIELD, CLASS_TEXTFIELD_ERROR } from "../constants/Styles";
import { PhoneInput } from '../components/PhoneInput';

const pasienModel = {
    man_nama:null,//
    man_kelamin: null,
    man_lahir_are_id:null, //
    man_tglahir:null,//
    man_alamatktp:null,//
    man_alamatskrng:null,//
    man_kodepos:null,//
    man_are_id:null,//
    man_are_desa_id:null,//
    man_dusun:null,
    man_rt:null,
    man_rw:null,
    man_bahasa:null,
    man_pembayaran:null,
    man_noasuransi:null, 
    man_nik:null,
    man_nokk:null,
    man_telpon:null,
    man_goldarah:null, 
    man_ibu_man_id:null, 
    man_kebangsaan:null,
    man_sukubangsa:null,
    man_pekerjaan:null,
    man_pendakhir:null,
    man_statusnikah:null,
    man_agama:null,
    man_namafam:null,
    man_hubfam:null,
    man_alamatfam:null, 
    man_telpfam:null,
    are_kotalahir:null,
};

const mandatory = ["man_nama", "man_kelamin"];

export const PasienDetail = ({title, dataProp, onSave, isLoading, backIcon, backRoute}) => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [canSave, setCanSave] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    //complex form data
    const [tempatLahir, setTempatLahir] = useState(null);
    const [kota, setKota] = useState(null);
    const [desa, setDesa] = useState(null);
    const [dataIbu,setDataIbu] = useState(null);

    //master data
    const [kelaminList, setKelaminList] = useState([]);
    const [bayarList, setBayarList] = useState([]);
    const [golDarahList, setGolDarahList] = useState([]);
    const [bangsaList, setBangsaList] = useState([]);
    const [sukuList, setSukuList] = useState([]);
    const [kerjaList, setKerjaList] = useState([]);
    const [pendidikanList, setPendidikanList] = useState([]);
    const [statusNikahList, setStatusNukahList] = useState([]);
    const [agamaList, setAgamaList] = useState([]);
    const [familyList, setFamilyList] = useState([]);

    //transaction data
    const [data, setData] = useState(dataProp? dataProp : pasienModel);
    const [emptyFields, setEmptyFields] = useState([]);

    const updateData = (key, value) => {
        setData({
            ...data, [key]: value
        });
        setCanSave(true);
    }

    const updateTempatLahir= ({label, value})=>{
        setTempatLahir({label, value});
        updateData("man_lahir_are_id", value);
    }

    const updateKota = ({label, value}) => {
        setKota({label, value});
        updateData("man_are_id", value);
    }

    const updateDesa = ({label, value}) => {
        setDesa({label, value});
        updateData("man_are_desa_id", value);
    }

    const updateDataIbu = ({label, value}) => {
        setDataIbu({label,value});
        updateData("man_ibu_man_id", value);
    }

    const searchKota = ({keyword, onLoaded})=>searchArea({
        q: keyword,
        onSuccess: onLoaded
    });
    const searchDesa = ({keyword, onLoaded})=>searchAreaDesa({
        q: keyword, 
        are_id: data.man_are_id, 
        onSuccess: onLoaded
    });
    const searchIbu = ({keyword, onLoaded})=>getIbuList({
        man_com_id: context.config.com_id,
        q: keyword,
        onSuccess: onLoaded
    });

    const handleSave = () =>{
        //Cek apakah mandatory field ada yang kosong
        const empty = Object.keys(data).filter(key => {
            if(mandatory.includes(key) && !data[key]){
                return true;
            }
            return false;
        });
        if(empty.length > 0){
            setEmptyFields(empty);
            setActiveTab(0);
            window.pushToast("Data mandatory harus diisi", "error");
        }else{
            setEmptyFields([]);
            onSave(data);
        }
    }

    useEffect(()=>{
        const currentData = dataProp? dataProp : pasienModel;
        setData(currentData);
        if(currentData.are_kotalahir){
            setTempatLahir({label:currentData.are_kotalahir, value:currentData.man_lahir_are_id});
        }
        if(currentData.namaibu){
            setDataIbu({label:currentData.namaibu, value:currentData.man_ibu_man_id});
        }
        if(currentData.are_nama){
            setKota({label:currentData.are_nama, value:currentData.man_are_id});
        }
        if(currentData.are_namadesa){
            setDesa({label:currentData.are_namadesa, value:currentData.man_are_desa_id});
        }
        setActiveTab(0);
    },[JSON.stringify(dataProp)]);

    useEffect(()=>{
        setLoading(true);
        Promise.all([
            getMasterKelamin({onSuccess: setKelaminList}),
            getMasterPembayaran({onSuccess: setBayarList}),
            getMasterGolDarah({onSuccess: setGolDarahList}),
            getMasterBangsa({onSuccess: setBangsaList}),
            getMasterSuku({onSuccess: setSukuList}),
            getMasterKerja({onSuccess: setKerjaList}),
            getMasterPendidikan({onSuccess: setPendidikanList}),
            getMasterStatusNikah({onSuccess: setStatusNukahList}),
            getMasterAgama({onSuccess: setAgamaList}),
            getMasterFamily({onSuccess: setFamilyList})
        ]).then(()=>{
            setLoading(false);
        });
    },[]);

    useEffect(()=>{
        if(!loading){
            updateDesa({label:null, value:null});
        }
    },[data.man_are_id]);

    return(
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar
                bgColor="bg-pink-500" 
                bgHoverColor="hover:bg-pink-600"
                tabs={["Umum", "Detail"]}
                tabActive={activeTab}
                onTabSelect={setActiveTab}
                tabActiveColor="bg-pink-200"
                backIcon={backIcon}
                onBackClick={()=>navigate(backRoute?backRoute : "/")}
            >
                {title}
            </AppBar>
            {
                !loading? null : 
                <LoadingOverlay/>
            }
            {
                activeTab === 0 ?
                <div className="pt-28 px-4">
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            NIK
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                maxLength={16}
                                value={data.man_nik}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("man_nik",e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <div 
                            className={
                                emptyFields.includes("man_nama")?CLASS_FIELD_LABEL_ERROR :CLASS_FIELD_LABEL
                            }
                        >
                            Nama Lengkap
                        </div>
                        <div className="relative">
                            <input type="text" 
                                className={emptyFields.includes("man_nama")? CLASS_TEXTFIELD_ERROR : CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("man_nama", e.target.value)}
                                value={data.man_nama}
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <div 
                            className={
                                emptyFields.includes("man_kelamin")?CLASS_FIELD_LABEL_ERROR :CLASS_FIELD_LABEL
                            }
                        >
                            Jenis Kelamin
                        </div>
                        <div className={`flex items-center rounded-xl ${emptyFields.includes("man_kelamin") ? "border border-red-500 p-3": ""}`}>
                        {
                            kelaminList.map((kl,index)=>(
                                <div className="flex items-center flex-grow" key={index}>
                                    <RadioButton
                                        checkedColor={"checked:bg-pink-500"}
                                        borderColor={"border-pink-500"}
                                        onClick={()=>updateData("man_kelamin", kl.value)}
                                        isChecked={data.man_kelamin === kl.value}
                                    />
                                    <div>
                                        {kl.label}
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            No. Telepon/HP
                        </div>
                        <PhoneInput value={data.man_telpon}
                            onChange={(e)=>updateData("man_telpon",e.target.value)}
                        />
                    </div>
                </div>
                :
                <div className="py-28 px-4">     
                    <div className="mb-5 text-xl font-bold">Detail Pribadi</div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            No. KK
                        </div>
                        <div className="relative">
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                maxLength={16}
                                value={data.man_nokk}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("man_nokk",e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Tempat Lahir
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
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Tanggal Lahir
                        </div>
                        <div className="relative">
                            <DatePicker
                                dateValue={data.man_tglahir}
                                onDateChange={(date)=>updateData("man_tglahir",date)}
                            />
                        </div>
                    </div>
                    
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Golongan Darah
                        </div>
                        <div className="flex items-center">
                        {
                            golDarahList.map((gd,index)=>(
                                <div className="flex items-center flex-grow" key={index}>
                                    <RadioButton
                                        checkedColor={"checked:bg-pink-500"}
                                        borderColor={"border-pink-500"}
                                        onClick={()=>updateData("man_goldarah", gd.value)}
                                        isChecked={data.man_goldarah === gd.value}
                                    />
                                    <div>
                                        {gd.label}
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Status Nikah
                        </div>
                        <SelectSimple
                            onChange={(obj)=>updateData("man_statusnikah", obj.value)}
                            selected={statusNikahList.find(s=>s.value === data.man_statusnikah)}
                            options={statusNikahList}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Nama Ibu
                        </div>
                        <SelectAsync
                            placeholder="ibu: Ketik 3 huruf untuk mencari..."
                            onLoad={searchIbu}
                            onChange={updateDataIbu}
                            selected={dataIbu}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Agama
                        </div>
                        <SelectSimple
                            onChange={(obj)=>updateData("man_agama", obj.value)}
                            selected={agamaList.find(a=>a.value === data.man_agama)}
                            options={agamaList}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Kebangsaan
                        </div>
                        <SelectSimple
                            onChange={(obj)=>updateData("man_kebangsaan", obj.value)}
                            selected={bangsaList.find(b=>b.value === data.man_kebangsaan)}
                            options={bangsaList}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Suku Bangsa
                        </div>
                        <SelectSimple
                            onChange={(obj)=>updateData("man_sukubangsa", obj.value)}
                            selected={sukuList.find(s=>s.value === data.man_sukubangsa)}
                            options={sukuList}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Pekerjaan
                        </div>
                        <SelectSimple
                            onChange={(obj)=>updateData("man_pekerjaan", obj.value)}
                            selected={kerjaList.find(k=>k.value === data.man_pekerjaan)}
                            options={kerjaList}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Pendidikan Terakhir
                        </div>
                        <SelectSimple
                            onChange={(obj)=>updateData("man_pendakhir", obj.value)}
                            selected={pendidikanList.find(p=>p.value === data.man_pendakhir)}
                            options={pendidikanList}
                        />
                    </div>
                    <div className="mt-10 mb-5 text-xl font-bold">Alamat</div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Kabupaten/Kota
                        </div>
                        <SelectAsync
                            placeholder="kota Ketik 3 huruf untuk mencari..."
                            onLoad={searchKota}
                            onChange={updateKota}
                            selected={kota}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Desa/Kelurahan
                        </div>
                        <SelectAsync
                            placeholder="desa Ketik 3 huruf untuk mencari..."
                            onLoad={searchDesa}
                            onChange={updateDesa}
                            selected={desa}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Dusun
                        </div>
                        <input type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("man_dusun", e.target.value)}
                            value={data.man_dusun}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="mb-5">
                            <div className={CLASS_FIELD_LABEL}>
                                RT
                            </div>
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                maxLength={5}
                                value={data.man_rt}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("man_rt",e.target.value)}
                            />
                        </div>
                        <div className="mb-5">
                            <div className={CLASS_FIELD_LABEL}>
                                RW
                            </div>
                            <Cleave
                                options={{
                                    numericOnly:true,
                                }}
                                maxLength={5}
                                value={data.man_rw}
                                className={CLASS_TEXTFIELD}
                                onChange={(e)=>updateData("man_rw",e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Jalan
                        </div>
                        <input type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("man_alamatskrng", e.target.value)}
                            value={data.man_alamatskrng}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Kode Pos
                        </div>
                        <Cleave
                            options={{
                                numericOnly:true,
                            }}
                            maxLength={10}
                            value={data.man_kodepos}
                            className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("man_kodepos",e.target.value)}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Alamat KTP
                        </div>
                        <input type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("man_alamatktp", e.target.value)}
                            value={data.man_alamatktp}
                            placeholder="Kosongkan jika sama dengan alamat di atas"
                        />
                    </div>
                    <div className="mt-10 mb-5 text-xl font-bold">
                        Keuangan
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Pembayaran
                        </div>
                        <div className="relative">
                            <SelectSimple
                                onChange={(obj)=>updateData("man_pembayaran", obj.value)}
                                selected={bayarList.find(b=>b.value === data.man_pembayaran)}
                                options={bayarList}
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            No. Asuransi
                        </div>
                        <input type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("man_noasuransi", e.target.value)}
                            value={data.man_noasuransi}
                        />
                    </div>
                    <div className="mt-10 mb-5  text-xl font-bold">
                        Keluarga Terdekat yang Bisa Dihubungi
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Nama 
                        </div>
                        <input type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("man_namafam", e.target.value)}
                            value={data.man_namafam}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Hubungan Keluarga 
                        </div>
                        <SelectSimple
                            onChange={(obj)=>updateData("man_hubfam", obj.value)}
                            selected={familyList.find(f=>f.value === data.man_hubfam)}
                            options={familyList}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            No. Telepon/HP
                        </div>
                        <PhoneInput value={data.man_telpfam}
                            onChange={(e)=>updateData("man_telpfam",e.target.value)}
                        />
                    </div>
                    <div className="mb-5">
                        <div className={CLASS_FIELD_LABEL}>
                            Alamat
                        </div>
                        <input type="text" className={CLASS_TEXTFIELD}
                            onChange={(e)=>updateData("man_alamatfam", e.target.value)}
                            value={data.man_alamatfam}
                        />
                    </div>
                </div>
            }
            <ButtonBlock
                onClick={handleSave}
                title="Simpan Data"
                bgColor="bg-pink-500"
                bgHoverColor="hover:bg-pink-600"
                icon="IoSaveOutline"
                disabled = {!canSave}
                loading={isLoading}
            />
        </div>
    )
}