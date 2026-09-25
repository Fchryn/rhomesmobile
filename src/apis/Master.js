import { post, HOST } from "./Global";

export const getMasterKelamin = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/kelamin`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.kel_nama,
                value: d.kel_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterPembayaran = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/pembayaran`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.byr_nama,
                value: d.byr_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterGolDarah = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/goldarah`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.gol_nama,
                value: d.gol_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterBangsa = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/kebangsaan`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.bgs_nama,
                value: d.bgs_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterSuku = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/sukubangsa`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.suk_nama,
                value: d.suk_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterKerja = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/pekerjaan`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.ker_nama,
                value: d.ker_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterPendidikan = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/pendakhir`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.dik_nama,
                value: d.dik_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterStatusNikah = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/statusnikah`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.sta_nama,
                value: d.sta_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterAgama = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/agama`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.agm_nama,
                value: d.agm_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterFamily = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/hubfam`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.hub_nama,
                value: d.hub_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getBiaya = async ({onSuccess, q, jns_id, com_id, lok_id, yan_id, lok_jenis})=>{
    const result = await post(`${HOST}/master/biaya`, {
        jns_id, 
        com_id, 
        lok_id,
        yan_id,
        lok_jenis,
        q
    });
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.bea_nama,
                value: d.bea_id,
                harga: d.bea_harga
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getDosisObat = async ({onSuccess}) =>{
    let result = await post(`${HOST}/master/dosisobat`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.dos_nama,
                value: d.dos_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterKeperluan = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/keperluan`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.prl_nama,
                value: d.prl_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterMitra = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/mitra`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.mit_nama,
                value: d.mit_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterRujukan = async ({onSuccess}) => {
    let result = await post(`${HOST}/master/rujukan`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.ru_nama,
                value: d.ru_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getLayanan = async ({onSuccess,lok_id, lok_jenis}) => {
    let result = await post(`${HOST}/layanan/read`,{lok_id, lok_jenis});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        console.log(result)
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.yan_nama,
                value: d.yan_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMasterJabatan = async ({onSuccess, com_id}) => {
    let result = await post(`${HOST}/jabatan/read`, {com_id});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.jab_nama,
                value: d.jab_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}
//////////////////master agama/////////////////
export const getMasterAgamaList = async ({
    onSuccess, 
    onError
}) => {
let result;
    result = await post(`${HOST}/master/agama`);
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        console.log(result)
        const {data} = result;
        if(data){
            onSuccess(data);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([],0);
        }
    }
}
////////////////master pegawai///////////////////
export const getMasterPegawaiList = async ({onSuccess, com_id, page, rows, q, onError
    }) => {
    let result;
    if(q){
        result = await post(`${HOST}/sdm/search`,{com_id, page, rows, q});
        if(!result || result.error){
            onError(!result? "System error" : result.error);
        }else{
            const {data} = result;
            if(data){
                onSuccess(data, data.length);
            }else{
                console.log("Data pasien tidak ditemukan");
                onSuccess([],0);
            }
        }
    }
    else{
        result = await post(`${HOST}/sdm/read`,{com_id, page, rows, q});
        if(!result || result.error){
            onError(!result? "System error" : result.error);
        }else{
            const {rows, total} = result.data;
            if(rows){
                onSuccess(rows, total);
            }else{
                console.log("Data pasien tidak ditemukan");
                onSuccess([],0);
            }
        }
    }
}

export const savePegawai = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/sdm/save`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {status, data, msg} = result.data;
        if(status === "success"){
            onSuccess(data);
        }else{
            onError(msg? msg : "Error saat menyimpan data pasien");
        }
    }
}
///////////////////////master kamar/////////////////////
export const getMasterKamarList = async ({onSuccess, lok_id, page, rows, onError
}) => {
    let result;
    result = await post(`${HOST}/kamar/read`,{lok_id, page, rows});
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        const {rows, total} = result.data;
        if(rows){
            onSuccess(rows, total);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([],0);
        }
    }
}

export const saveKamar = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/kamar/save`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {status, data, msg} = result.data;
        if(status === "success"){
            onSuccess(data);
        }else{
            onError(msg? msg : "Error saat menyimpan data pasien");
        }
    }
}

export const getBangsalList = async ({q, onSuccess}) => {
    const result = await post(`${HOST}/kamar/bangsal`, {q});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.kmr_bangsal,
                value: d.kmr_bangsal
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getRuangList = async ({q, onSuccess}) => {
    const result = await post(`${HOST}/kamar/ruang`, {q});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.kmr_ruang,
                value: d.kmr_ruang
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([{label:q,value:q}]);
        }
    }
}
////////////////////master penyakit/////////////////

export const getMasterPenyakitList = async ({onSuccess, com_id, page, rows, q, onError}) => {
    let result;
    if(q){
        result = await post(`${HOST}/penyakit/searchmaster`,{com_id, page, rows, q});
        if(!result || result.error){
            onError(!result? "System error" : result.error);
        }else{
            const {data} = result;
            if(data){
                onSuccess(data, data.length);
            }else{
                console.log("Data pasien tidak ditemukan");
                onSuccess([],0);
            }
        }
    }
    else{
        result = await post(`${HOST}/penyakit/read`,{com_id, page, rows, q});
        if(!result || result.error){
            onError(!result? "System error" : result.error);
        }else{
            const {rows, total} = result.data;
            if(rows){
                onSuccess(rows, total);
            }else{
                console.log("Data pasien tidak ditemukan");
                onSuccess([],0);
            }
        }
    }
}

export const savePenyakit = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/penyakit/save`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {row} = result.data;
        if(row){
            onSuccess(row);
        }else{
            onError("Error saat menyimpan data pasien");
        }
    }
}

//////////////////////master tindakan///////////////////
export const getMasterTindakanList = async ({
    onSuccess, lok_id, com_id, lok_jenis, page, rows, onError
}) => {
let result;
    if(lok_jenis=='1')
    result = await post(`${HOST}/tindakan/read_master_dks`,{lok_id, page, rows});
    else
    result = await post(`${HOST}/tindakan/read_master`,{com_id, page, rows});
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        const {rows} = result.data;
        if(rows){
            onSuccess(rows);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([],0);
        }
    }
}
export const dghrMasterList = async ({onSuccess}) => {
    let result = await post(`${HOST}/tindakan/dghr`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.dghr_nama,
                value: d.dghr_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}
export const dgtiMasterList = async ({onSuccess}) => {
    let result = await post(`${HOST}/tindakan/dgti`);
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.dgti_nama,
                value: d.dgti_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}
export const saveTindakan = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/tindakan/save`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {status, data, msg} = result.data;
        if(status === "success"){
            onSuccess(data);
        }else{
            onError(msg? msg : "Error saat menyimpan data pasien");
        }
    }
}
export const saveDksTindakan = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/tindakan/save_dks`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {status, row, msg} = result.data;
        if(row){
            onSuccess(row);
        }else{
            onError(msg? msg : "Error saat menyimpan data pasien");
        }
    }
}
///////////////////master layanan///////////////////////
export const getMasterLayananList = async ({onSuccess, lok_jenis, lok_id, page, rows, onError
}) => {
    let result;
    result = await post(`${HOST}/layanan/read`,{lok_id, lok_jenis, page, rows});
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        console.log(result)
        const {data} = result;
        if(data){
            onSuccess(data);
        }else{
            console.log("Data layanan tidak ditemukan");
            onSuccess([],0);
        }
    }
}
export const getKlinikLayananList = async ({q, onSuccess, lok_id}) => {
    const result = await post(`${HOST}/layanan/klinik`, {q, lok_id});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.yan_klinik,
                value: d.yan_klinik
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([{label:q,value:q}]);
        }
    }
}
export const saveLayanan = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/layanan/save`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {row} = result.data;
        if(row){
            onSuccess(row);
        }else{
            onError("Error saat menyimpan data pasien");
        }
    }
}