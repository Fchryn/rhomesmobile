import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { cloneDeep } from "lodash";
import { toBlob,toPng } from 'html-to-image';
import { IoChevronDown } from "react-icons/io5";
import { useNavigate } from "react-router";
import { queueGetReceipt, queueRegister } from "../apis/Antrian";
import {  saveManusia } from "../apis/Manusia";
import { AppContext } from "../App";
import { AppBar } from "../components/AppBar";
import { CardMenu } from "../components/CardMenu";
import { Modal } from "../components/Modal";
import { RadioButton } from "../components/RadioButton";
import { jenisAntrian } from "../constants/Entities";
import { SaveCancelBtnBlock } from "../components/SaveCancelBtnBlock";
import { LoadingOverlay } from "../components/Loading";
import {Filesystem, Directory} from "@capacitor/filesystem";
import {Capacitor} from "@capacitor/core";
import { format } from "date-fns";
import { convertBlobToBase64 } from "../helper/FileHelper";

export const Antrian = () => {
    const {pasienList, setPasienIndex, updatePasien, user} = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const {currentLocation} = user;
    const [receipt, setReceipt] = useState(null);
    const [pasienModal, setPasienModal] = useState(false);
    const navigate = useNavigate();
    const ref = useRef(null);
    const index = user.pasienIndex === undefined? 0 : user.pasienIndex;

    const selectQueue = (idx) => {
        setLoading(true);
        queueRegister({
            index: idx, 
            onSuccess:(data) => {
                saveQueueId(data.id);
                getQueueReceipt(data.id);
            },
            onError:(err) => {
                window.pushToast(err, "error");
                setLoading(false);
            }
        })
    }

    const saveQueueId = (id) => {
        const dataManusia = cloneDeep(pasienList[index]);
        dataManusia.man_queue_id = id;
        setLoading(true);
        saveManusia({
            onSuccess: (data)=>{
                setLoading(false);
                if(data){
                    updatePasien(data);
                    if(!id){
                        window.pushToast(`${data.man_nama} dipisahkan dari antrian`, "error");
                        setReceipt(null);
                    }else{
                        window.pushToast(`${data.man_nama} berhasil didaftarkan di antrian`);
                    }
                }
            },
            onError:(err) => {
                window.pushToast(err, "error");
                setLoading(false);
            },
            ...dataManusia
        })
    }

    const getQueueReceipt = (id) => {
        setLoading(true);
        queueGetReceipt({
            id,
            onSuccess: (data)=>{
                setReceipt(data);
                setLoading(false);
            },
            onError:(err) => {
                window.pushToast(err, "error");
                setReceipt(null);
                setLoading(false);
            },
            onExpired:(exp) => {
                window.pushToast(exp, "error");
                setReceipt(null);
                saveQueueId(null);
            }
        })
    }

    const onDownload = useCallback(() => {
        if (ref.current === null) {
          return;
        }
        const date = new Date();
        const fileName = `No-Antrian-${format(date, "ddMMM")}-${date.getTime()}.png`;
        if(Capacitor.isNativePlatform()){
            toBlob(ref.current)
            .then(blob => {
                return convertBlobToBase64(blob);
            })
            .then(base64Data => {
                return Filesystem.writeFile({
                    path: `rhocs/${fileName}`,
                    data: base64Data,
                    directory: Directory.Documents,
                    recursive: true
                });
            })
            .then(() => window.pushToast(`Berhasil download no. antrian: Documents/rhocs/${fileName}`))
            .catch((err) => {
                console.log(err);
                window.pushToast("Gagal mendownload no. antrian: "+err, "error");
            });
        }else{
            toPng(ref.current, { cacheBust: true, }).then((dataUrl) => {
                const link = document.createElement('a');
                link.download = fileName;
                link.href = dataUrl;
                link.click();
            }).catch((err) => {
                console.log(err);
                window.pushToast("Gagal mendownload no. antrian: "+err, "error");
            })
        }
    },[ref]);

    useEffect(()=>{
        if(pasienList.length < 1 || !currentLocation){
            navigate("/");
            return;
        }
        setReceipt(null);
        const queueId = pasienList[index].man_queue_id; 
        if(queueId){
            getQueueReceipt(queueId);
        }
    },[index]);

    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar
                bgColor="bg-indigo-500" 
                bgHoverColor="hover:bg-indigo-600" 
            >
                <div className="flex items-center">
                    <div className="mr-3 cursor-pointer flex items-center hover:text-pink-100" onClick={()=>setPasienModal(true)}>
                        <div className="mr-2">
                            <div>Antrian</div>
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
                !receipt?
                <div className="flex justify-center px-4 pt-24 pb-4">
                    <div className="grid grid-cols-3 gap-4">
                        {
                            jenisAntrian.map((an)=>(
                                <div className=" m-auto" key={an.value} onClick={()=>selectQueue(an.value)}>
                                    <CardMenu bigger icon={an.icon} iconClassName="text-indigo-600" title={an.label}/>
                                </div>
                            ))
                        }
                    </div>
                </div>:
                <div>
                    <div className="py-20 px-5 bg-gray-50" ref={ref}>
                        {
                            !currentLocation || !currentLocation.lok_nama ? null:
                            <div className="text-center font-bold">
                                {currentLocation.lok_nama}
                            </div>
                        }
                        {
                            !currentLocation || !currentLocation.lok_alamat? null:
                            <div className="text-center text-xs">
                                {currentLocation.lok_alamat} {currentLocation.lok_kodepos? currentLocation.lok_kodepos:null}
                            </div>
                        }
                        {
                            !currentLocation || !currentLocation.lok_telpon? null:
                            <div className="text-center text-xs">
                                Telp. {currentLocation.lok_telpon}
                            </div>
                        }
                        <div className="border-t border-slate-400 my-3"/>
                        <div className="text-center mb-4">
                            {receipt.hartgljam}
                        </div>
                        <div className="text-center">
                            Nomor antrian pendaftaran anda:
                        </div>
                        <div className="text-center font-bold text-5xl mb-4">
                            {receipt.qregnum}
                        </div>
                        <div className="text-center">
                            Nomor antrian klinik anda:
                        </div>
                        <div className="text-center font-bold text-5xl mb-6">
                            {receipt.qsrvnum}
                        </div>
                        <div className="text-center">
                            Terimakasih atas kesediaannya menunggu
                        </div>
                        <div className="text-center">
                            Yang masih antri pendaftaran: {receipt.qregrest} orang
                        </div>
                        <div className="text-center">
                            Yang masih antri di klinik: {receipt.qsrvrest} orang
                        </div>
                    </div>
                    <div>
                        <SaveCancelBtnBlock
                            cancelTitle="Batalkan"
                            cancelIcon="IoCloseOutline"
                            onCancel={()=>saveQueueId(null)}
                            saveTitle="Download"
                            saveIcon="IoDownloadOutline"
                            onSave={onDownload}
                        />
                    </div>
                </div>   
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
                loading?<LoadingOverlay/> : null
            }
        </div>
    )
}