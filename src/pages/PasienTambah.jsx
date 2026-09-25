import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { saveManusia } from "../apis/Manusia";
import { AppContext } from "../App";
import { routes } from "../constants/Urls";
import { PasienDetail } from "./PasienDetail";

export const PasienTambah = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSave = (data) => {
        setLoading(true);
        saveManusia({
            onSuccess: (savedData)=>{
                window.pushToast(`Pasien ${savedData.man_nama} berhasil ditambahkan`);
                setLoading(false);
                navigate(routes.pasien);
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
            man_id: '0', //'0' means add new 
            man_com_id: context.user.currentLocation.com_id,
            ...data
        });
    }

    return( 
        <PasienDetail title="Tambah Pesien"
            onSave={handleSave}
            isLoading = {loading}
            backIcon = "IoChevronBackOutline"
            backRoute = {routes.pasien} 
        />
    )
}