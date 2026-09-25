import React, { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { AppBar } from "../components/AppBar.jsx";
import { LoadingOverlay } from "../components/Loading.jsx";
import { Modal } from "../components/Modal.jsx";
import { RadioButton } from "../components/RadioButton.jsx";
import {reports} from "../constants/Entities";
import { LaporanInventory } from "./LaporanInvetory.jsx";


export const Laporan = ()=> {
    const [indexLaporan, setIndexLaporan] = useState(null);
    const [laporanModal, setLaporanModal] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(()=>{
        if(indexLaporan === null){
            setLaporanModal(true);
        }
    },[indexLaporan]);

    const closeModal = () => {
        if(indexLaporan === null){
            setIndexLaporan(0);
        }
        setLaporanModal(false);
    }

    const handleSearch = (searchKey) => {
        
    }

    let component = null;

    if(indexLaporan !== null){
        switch(reports[indexLaporan].value){
            case "INVENTORY":
                component = <LaporanInventory/>
                break;
            default:
                component = null;
        }
    }

    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar bgColor="bg-cyan-500" searchPlaceholder="Cari Agama">
                <div className="flex items-center">
                    <div className="mr-3 cursor-pointer flex items-center hover:text-pink-100" onClick={()=>setLaporanModal(true)}>
                        <div className="mr-2">
                            <div>Laporan</div>
                            {
                                indexLaporan === null? null : <div className="text-xs font-light">{reports[indexLaporan].label}</div>
                            }
                        </div>
                        <IoChevronDown/>
                    </div>
                </div>
            </AppBar>
            <div>
            {
                !loading? null: <LoadingOverlay/>
            }
            {component}
            </div>
            {
                !laporanModal? null:
                <Modal title="Pilih Jenis Laporan"
                    onCancel={closeModal}
                >
                {
                    reports.map((l,idx) => (
                        <div className="flex items-center flex-grow mb-3" key={idx}>
                            <RadioButton
                                checkedColor={"checked:bg-cyan-500"}
                                borderColor={"border-cyan-500"}
                                onClick={()=>setIndexLaporan(idx)}
                                isChecked={idx === indexLaporan}
                            />
                            <div>
                               {l.label}
                            </div>
                        </div>
                    ))
                }
                </Modal>
            }
        </div>
    )
}