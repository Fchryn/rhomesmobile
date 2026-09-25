import { data } from "autoprefixer";
import { post, HOST } from "./Global";
export const getKunPeriksaList = async ({man_id, kun_id, onSuccess, onError}) => {
    let result;
    result = await post(`${HOST}/kunperiksa/read`, {
        man_id,
        kun_id
    });
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        const {rows} = result.data;
        console.log("result="+JSON.stringify(result.data))
        if(rows){
            onSuccess(rows, rows.length);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([],0);
        }
    }
    
}
export const saveKunperiksa = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/kunperiksa/save`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        const {status, row, errmsg} = result.data;
        if(status === "success"){
            onSuccess(row);
        }else{
            onError(errmsg? errmsg : "Error saat menyimpan data pemeriksaan");
        }
    }
}
export const searchICD9 = async ({q, onSuccess}) => {
    const result = await post(`${HOST}/penyakit/search`, {q});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            console.log(data);
            onSuccess(data.map(d => ({
                label: d.kit_nama,
                value: d.kit_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}