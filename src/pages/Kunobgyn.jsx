import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { IconButton } from "../components/IconButton";
import { SaveCancelBtnBlock } from "../components/SaveCancelBtnBlock";

const kunobgynModel = {
    kog_abortus: "",
    kog_dada: "",
    kog_efeksmp: "",
    kog_ektramilas: "",
    kog_gravida: "0",
    kog_gy_feto: "",
    kog_gy_pang: "",
    kog_gy_touch: "",
    kog_gy_vag: "",
    kog_gy_vul: "",
    kog_haidproblem: "",
    kog_id: "",
    kog_kardio: "",
    kog_kb: "",
    kog_kb_pli: "",
    kog_ketlain: "",
    kog_kondisi: "",
    kog_kpr_id: "",
    kog_kun_id: "",
    kog_kunulang: "",
    kog_lasthaid: "",
    kog_masalah: "",
    kog_mata: "",
    kog_menarrche: "",
    kog_nf_ctut: "",
    kog_nf_fut: "",
    kog_nf_loc: "",
    kog_nf_luk: "",
    kog_ob_abd: "",
    kog_ob_kon: "",
    kog_ob_konstat: "",
    kog_ob_kul: "",
    kog_ob_kulstat: "",
    kog_ob_letpung: "",
    kog_ob_pres: "",
    kog_ob_tfu: "",
    kog_paritas: "",
    kog_pelaksana: "",
    kog_rigyn: "",
    kog_rikawin: "",
    kog_rikit_kel: "",
    kog_rioperasi: "",
    kog_rirawat: "",
}

export const Kunobgyn = ({kpr_id}) => {
    const {pasienKlinik} = useContext(AppContext);
    const [data, setData] = useState(null);
    const [saving, setSaving] = useState(false);
    const clearData = () => {

    }

    return (
        <div className="bg-blue-500 p-4 text-white">
            <div className="mb-5 text-xl font-bold">Pemeriksaan Obgyn</div>
        </div>
    )
}