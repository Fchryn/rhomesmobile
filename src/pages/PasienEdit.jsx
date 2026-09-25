import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { saveManusia } from "../apis/Manusia";
import { routes } from "../constants/Urls";
import { PasienDetail } from "./PasienDetail";
import { AppContext } from "../App";

export const PasienEdit = () => {
    const {pasienEdit} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(!pasienEdit){
            navigate(routes.pasien);
        }
    },[])

    const handleSave = (data) => {
        setLoading(true);
        saveManusia({
            onSuccess: (savedData)=>{
                window.pushToast(`Pasien atas nama ${savedData.man_nama} berhasil diupdate`);
                setLoading(false);
                navigate(routes.pasien);
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
            ...data
        })
    }
    return( 
        <PasienDetail title="Edit Pasien"
            dataProp={pasienEdit}
            onSave={handleSave}
            isLoading = {loading}
            backIcon = "IoChevronBackOutline"
            backRoute = {routes.pasien} 
        />
    )
}