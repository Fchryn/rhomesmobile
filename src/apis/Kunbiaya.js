import { post, HOST } from "./Global";
export const getBiayaList = async ({man_id, hwn_id, kun_id, page, rows, onSuccess, onError}) => {
    const result = await post(`${HOST}/kunbiaya/read`, {
        man_id,
        hwn_id,
        kun_id,
        page,
        rows
    });
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        const {rows} = result.data;
        if(rows){
            onSuccess(rows, rows.length);
        }else{
            onError("Data biaya tidak ditemukan");
        }
    }
}

export const saveBiaya = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/kunbiaya/save`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        const {status, row, errmsg} = result.data;
        if(status === "success"){
            onSuccess(row);
        }else{
            onError(errmsg? errmsg : "Error saat menyimpan biaya");
        }
    }
}

export const deleteBiaya = async ({onSuccess, onError, kbi_id})=>{
    const result = await post(`${HOST}/kunbiaya/delete`, {kbi_id});
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        const {status} = result.data;
        if(status === "success"){
            onSuccess();
        }else{
            onError("Error saat menghapus biaya");
        }
    }
}

export const getBiayaKeseluruhan = async ({kun_id, onSuccess}) => {
    const result = await post(`${HOST}/kunbayar/read`, {
        kun_id
    });
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess(null);
    }else{
        const {data} = result;
        if(data){
            onSuccess(data);
        }else{
            console.log("error: data undefined");
            onSuccess(null);
        }
    }
}

export const saveBayar = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/kunbayar/save`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {status, row_mobile, errmsg} = result.data;
        if(status === "success"){
            onSuccess(row_mobile);
        }else{
            onError(errmsg? errmsg : "Error saat menyimpan biaya");
        }
    }
}