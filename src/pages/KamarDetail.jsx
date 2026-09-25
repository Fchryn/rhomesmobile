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
import { getBangsalList, getRuangList, saveKamar } from "../apis/Master";
import { PhoneInput } from "../components/PhoneInput";
import { searchArea } from "../apis/Area";

const kamarModel = {
    kmr_bangsal:"",
    kmr_kelas_ruang:"",
    kmr_nomorbed:"",
    kmr_ruang:"",
    kmr_tarif_ruang:"",
};

export const KamarDetail = () => {
    const {master,user,canEdit,setCanEdit} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [kamar, setKamar] = useState(canEdit==true?(master? cloneDeep(master): {}):cloneDeep(kamarModel));
    const [canSave, setCanSave] = useState(false);
    const [ruangList, setRuangList] = useState([]);
    const [bangsalList, setBangsalList] = useState([]);

    useEffect(()=>{
        if(canEdit==true){
            if(!master){
                navigate(routes.pegawai);
                return;
            }
        }
    },[]) //eksekusi load kamar jika ada datanya

    const updateData = (key, value) => {
        setKamar({
            ...kamar, [key]: value
        });
        setCanSave(true);
    } //mengganti data dari data yang sudah ada

    // useEffect(()=>{
    //     setLoading(true);
    //     Promise.all([
    //         getKamarBangsal({onSuccess: setBangsalList}),
    //         getKamarRuang({onSuccess: setRuangList})
    //     ]).then(()=>{
    //         setLoading(false);
    //     });
    // },[]); //load semua dropdownlist yang bukan search
   
    useEffect(()=>{
        if(canEdit==true){
            if(master){
                const currentData = cloneDeep(master);
                setKamar(currentData);
                if(currentData.kmr_bangsal){
                    setBangsalList({label:currentData.kmr_bangsal, value:currentData.kmr_bangsal});
                }
                if(currentData.kmr_ruang){
                    setRuangList({label:currentData.kmr_ruang, value:currentData.kmr_ruang});
                }
            }
        }
        else{
            const currentData = cloneDeep(kamarModel);
            setKamar(currentData);
            if(currentData.kmr_bangsal){
                setBangsalList({label:currentData.kmr_bangsal, value:currentData.kmr_bangsal});
            }
            if(currentData.kmr_ruang){
                setRuangList({label:currentData.kmr_ruang, value:currentData.kmr_ruang});
            }

        }
    },[JSON.stringify(master)]); //meload data pasien
    
    const updateKamarBangsal= ({label, value})=>{
        setBangsalList({label, value});
        updateData("kmr_bangsal", value);
    }
    const updateKamarRuang= ({label, value})=>{
        console.log(label+"-"+value)
        setRuangList({label, value});
        updateData("kmr_ruang", value);
    }
    const searchBangsal = ({keyword, onLoaded})=>getBangsalList({
        q: keyword,
        onSuccess: onLoaded
    });
    const searchRuang = ({keyword, onLoaded})=>getRuangList({
        q: keyword,
        onSuccess: onLoaded
    });
    const handleSave = (data) => {
        console.log(canEdit)
        setLoading(true);
        if(canEdit==true){
            saveKamar({
                onSuccess: (savedData)=>{
                    setKamar(savedData);
                    navigate(routes.kamar);
                    setCanEdit(false)
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                },
                kmr_lok_id:user.currentLocation.lok_id,
                ...data
            })
        }
        else{
            saveKamar({
                
                onSuccess: (savedData)=>{
                    setKamar(savedData);
                    navigate(routes.kamar);
                },
                onError: (err)=>{
                    window.pushToast(err, "error");
                    setLoading(false);
                },
                kmr_lok_id:user.currentLocation.lok_id,
                kmr_id:'0',
                ...data,
                
            })

        }
        
    }
    const handleBack = () => {
        navigate(routes.kamar);
        setCanEdit(false);
    }
    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            {canEdit==true?
                <AppBar bgColor="bg-red-500" bgHoverColor="hover:bg-red-600"
                    backIcon="IoChevronBackOutline"
                    onBackClick={()=>handleBack()}
                >
                    Kamar Edit
                </AppBar>
                :
                <AppBar bgColor="bg-red-500" bgHoverColor="hover:bg-red-600"
                    backIcon="IoChevronBackOutline"
                    onBackClick={()=>handleBack()}
                >
                    Kamar Tambah
                </AppBar>
            }
            <div className="py-20 px-4">     
                <div className="mb-5 text-xl font-bold">Pengisian kamar</div>
                <div className="flex space-x-4">
                    <div className="mb-5">  
                        <div className={CLASS_FIELD_LABEL}>
                            ID
                        </div>
                        {canEdit==true?
                        <div className="relative">
                            <Cleave type="text" className={CLASS_TEXTFIELD}
                                value={kamar.kmr_id}
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
                        Nama Ruang
                    </div>
                    <SelectAsync
                        placeholder="Ketik 3 huruf untuk mencari..."
                        onLoad={searchRuang}
                        onChange={updateKamarRuang}
                        selected={ruangList}
                    />
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        Kelas
                    </div>
                    <Cleave
                        options={{
                            numericOnly:true,
                        }}
                        maxLength={3}
                        value={kamar.kmr_kelas_ruang}
                        className={CLASS_TEXTFIELD}
                        onChange={(e)=>updateData("kmr_kelas_ruang",e.target.value)}
                    />
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        Nomor Bed
                    </div>
                    <Cleave
                        options={{
                            numericOnly:true,
                        }}
                        maxLength={3}
                        value={kamar.kmr_nomorbed}
                        className={CLASS_TEXTFIELD}
                        onChange={(e)=>updateData("kmr_nomorbed",e.target.value)}
                    />
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        Tarif
                    </div>
                    <Cleave
                        options={{
                            numericOnly:true,
                        }}
                        maxLength={12}
                        value={kamar.kmr_tarif_ruang}
                        className={CLASS_TEXTFIELD}
                        onChange={(e)=>updateData("kmr_tarif_ruang",e.target.value)}
                    />
                </div>
                <div className="mb-12">
                    <div className={CLASS_FIELD_LABEL}>
                        Nama Bangsal
                    </div>
                    <SelectAsync
                        placeholder="Ketik 3 huruf untuk mencari..."
                        onLoad={searchBangsal}
                        onChange={updateKamarBangsal}
                        selected={bangsalList}
                    />
                </div>
            </div>
            <ButtonBlock
                onClick={()=>handleSave(kamar)}
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