import { post, HOST } from "./Global";
export const initLokasi = async ({page, rows, q, onSuccess, onError}) => {
    let result;
    result = await post(`${HOST}/lokasi/read`, {
        page, 
        rows,
        q
    });
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        const {list} = result.data;
        if(list){
            onSuccess(list, list.length);
        }else{
            onError("Data lokasi tidak ditemukan");
        }
    }
}

export const getLokasi = async ({lok_id, onSuccess, onError}) => {
    let result;
    result = await post(`${HOST}/lokasi/read`, {lok_id});
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        const {data} = result.data;
        if(data){
            onSuccess(data);
        }else{
            onError("Data lokasi tidak ditemukan");
        }
    }
}