import { post, HOST } from "./Global";
export const getLoketEdit = async ({onSuccess,lok_id,kun_id}) => {
    let result = await post(`${HOST}/kunjungan/readone`,{lok_id,kun_id});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess(null);
    }else{
        const {data} = result;
        console.log(result);
        if(data && data.result){
            onSuccess(data.result);
        }else{
            console.log("error: data undefined");
            onSuccess(null);
        }
    }
}
export const saveLoket = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/kunjungan/save`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        const {status, row, errmsg} = result.data;
        if(status === "success"){
            onSuccess(row);
        }else{
            onError(errmsg? errmsg : "Error saat menyimpan data pasien");
        }
    }
}


export const getManusiaLoketList = async ({man_com_id, q, onSuccess}) => {
    const result = await post(`${HOST}/manusia/search`, {
        man_com_id, 
        q
    });
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.man_nama,
                value: d.man_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getLayanan = async ({onSuccess, lok_id}) => {
    let result = await post(`${HOST}/config/read`, {
        lok_id
    });
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data.layanan && data.layanan.length > 0){
            onSuccess(data.layanan.map(d => ({
                label: d.yan_label,
                value: d.yan_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}