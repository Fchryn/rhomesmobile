import { post, HOST } from "./Global";
export const getPOList = async ({onSuccess, onError}) => {
    const result = await post(`${HOST}/po/read`);
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        const {rows,total} = result.data;
        if(rows){
            onSuccess(rows,total);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([]);
        }
    }
}
export const getSupplierList = async ({onSuccess, onError}) => {
    const result = await post(`${HOST}/supplier/read`);
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        const {data} = result;
        if(data){
            onSuccess(data);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([]);
        }
    }
}
export const getReadItemList = async ({onSuccess, onError, po_id}) => {
    const result = await post(`${HOST}/po/read_items`,{po_id});
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        console.log(result)
        const {rows} = result.data;
        if(rows){
            onSuccess(rows);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([]);
        }
    }
}

export const getObatList = async ({onSuccess, onError, cbt_com_id, page, rows, key_val}) => {
    const result = await post(`${HOST}/obat/browse`,{cbt_com_id, page, rows, key_val});
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        console.log(result)
        const {rows,total} = result.data;
        if(rows){
            onSuccess(rows,total);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([]);
        }
    }
}

export const savePO = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/po/save`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {status, row, errmsg} = result.data;
        if(row){
            onSuccess(row);
        }else{
            onError(errmsg? errmsg : "Error saat menyimpan data pasien");
        }
    }
}

export const addItem = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/po/add_item`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {status, row, errmsg} = result.data;
        if(row){
            onSuccess(row);
        }else{
            onError(errmsg? errmsg : "Error saat menyimpan data pasien");
        }
    }
}

export const saveItem = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/po/save_item`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {status, row, errmsg} = result.data;
        if(row){
            onSuccess(row);
        }else{
            onError(errmsg? errmsg : "Error saat menyimpan data pasien");
        }
    }
}
///////////////////////////receive////////////////////////////
export const getReceiveList = async ({onSuccess, onError, page, rows}) => {
    const result = await post(`${HOST}/receive/read`,{page, rows});
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        console.log(result)
        const {rows,total} = result.data;
        if(rows){
            onSuccess(rows,total);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([]);
        }
    }
}

export const getReadItemRcList = async ({onSuccess, onError, rcv_id}) => {
    const result = await post(`${HOST}/receive/read_items`,{rcv_id});
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        console.log(result)
        const {rows} = result.data;
        if(rows){
            onSuccess(rows);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([]);
        }
    }
}

export const getOrderedItem = async ({onSuccess, onError, rcv_id}) => {
    const result = await post(`${HOST}/receive/ordered_items`,{rcv_id});
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        console.log(result)
        const {rows} = result.data;
        if(rows){
            onSuccess(rows);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([]);
        }
    }
}

export const saveRcItem = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/receive/save_item`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {status, row, errmsg} = result.data;
        if(row){
            onSuccess(row);
        }else{
            onError(errmsg? errmsg : "Error saat menyimpan data pasien");
        }
    }
}
export const addRcv = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/receive/add`, data);
    if(!result || result.error){
        onError(!result? "System error" : JSON.stringify(result.error));
    }else{
        console.log(result)
        const {status, row, po_row, errmsg} = result.data;
        if(row){
            onSuccess(row, po_row);
        }else{
            onError(errmsg? errmsg : "Error saat menyimpan data pasien");
        }
    }
}