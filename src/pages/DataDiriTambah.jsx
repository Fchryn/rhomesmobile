import { cloneDeep } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getManusiaByProps, saveManusia } from "../apis/Manusia";
import { AppContext } from "../App";
import { Loading } from "../components/Loading";
import { Modal } from "../components/Modal";
import { routes } from "../constants/Urls";
import { PasienDetail } from "./PasienDetail";

export const DataDiriTambah = () => {
    const {user, pasienList, addPasien} = useContext(AppContext);
    const navigate = useNavigate();
    const [modalStep, setModalStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [otherPasienList, setOtherPasienList] = useState([]);
    const [pasienData, setPasienData] = useState(null);

    useEffect(()=>{
        if(!user.currentLocation){
            navigate(routes.lokasi);
            return;
        }
        setModalStep((pasienList && pasienList.length >0) ? 1 : 0);
    },[]);

    useEffect(()=>{
        if(modalStep === 1){
            setLoading(true);
            getManusiaByProps({
                man_usr_id: user.usr_id,
                man_telpon: user.man_telpon,
                onSuccess: (list)=>{
                    setLoading(false);
                    if(list.length > 0){
                        setOtherPasienList(
                            //hanya tampilkan pasien yang diluar com_id sekarang
                            list.filter( li => li.man_com_id !== user.currentLocation.com_id)
                        );
                    }else{
                        setModalStep(2);
                    }
                },
                onError: ()=>{
                    setLoading(false);
                    setModalStep(2);
                }
            })
        }
    },[modalStep]);

    const handleSelectRegisteredPasien = (index) => {
        setPasienData(cloneDeep(otherPasienList[index]));
        setModalStep(2);
    }

    const handleSave = (data) => {
        if(!user.currentLocation){
            return;
        }
        setLoading(true);
        data.man_id = '0'; //'0' means add new 
        data.man_com_id = user.currentLocation.com_id;
        data.man_usr_id = user.usr_id;
        saveManusia({
            onSuccess: (savedData)=>{
                addPasien(savedData);
                navigate("/");
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
            ...data
        });
    }

    return( 
        <div>
            <PasienDetail title="Registrasi"
                dataProp={pasienData ? pasienData : {man_telpon: user.usr_phone}}
                onSave={handleSave}
                isLoading = {loading}
            />
            {
                modalStep === 0? 
                <Modal title="Welcome"
                    confirmButton="Mengerti"
                    onCancel={()=>setModalStep(1)}
                    onConfirm={()=>setModalStep(1)}
                >
                {
                    !user.currentLocation? null:
                    <span>Selamat datang di {user.currentLocation.com_nama}. Karena data anda belum terdaftar di sini maka silahkan mengisi form registrasi berikut.</span>
                }
                </Modal>:
                (
                    modalStep === 1? 
                    <Modal title="Mencari Data" unclosable>
                        <div>
                        {loading? <Loading color="bg-indigo-500"/> : null}
                        {
                            otherPasienList.length < 1 ? null:
                            <div>
                                <p>Ditemukan data berikut di rumah sakit/klinik lain, silahkan pilih jika ingin menggunakan</p>
                                <div className="flex snap-x snap-mandatory space-x-3 overflow-scroll p-3">
                                {
                                    otherPasienList.map((p, index) => (
                                        <div className="snap-center" key={p.man_id}>
                                            <div className="rounded-xl bg-gray-100 text-center p-4 w-64 min-w-fit">
                                                <div className="font-bold">
                                                    {p.man_nama} 
                                                </div>
                                                <div>
                                                    {p.man_telpon}
                                                </div>
                                                <div className="text-gray-500">
                                                    {p.man_alamatskrng}
                                                </div>
                                                <div className="underline font-bold text-indigo-500 cursor-pointer"
                                                    onClick={()=>handleSelectRegisteredPasien(index)}
                                                >
                                                    Pilih
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                                </div>
                                <div className="text-center mt-5">
                                    <button className="rounded-full p-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold"
                                        onClick={()=>setModalStep(2)}
                                    >
                                        Saya ingin mengisi data baru
                                    </button>
                                </div>
                            </div>
                        }
                        </div>
                    </Modal>: 
                    null
                )
            }
        </div>
    )
}