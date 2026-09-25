import { get, HOST_QUEUE } from "./Global";

export const queueRegister = async ({index, onSuccess, onError}) => {
    const result = await get(`${HOST_QUEUE}/push?id=${index}`);
    if(!result || result.error){
        const errMsg = "error: "+ (!result? "API failed": result.error);
        console.log(errMsg);
        onError(errMsg);
    }else{
        const {data} = result;
        if(data && data.status === "success"){
            onSuccess(data.data);
        }else if(data && data.status === "failed"){
            onError("Proses pembuatan no. antrian gagal");
        }else{
            onError("error: data undefined");
        }
    }
}

export const queueGetReceipt = async ({id, onSuccess, onError, onExpired}) => {
    const result = await get(`${HOST_QUEUE}/receipt?id=${id}`);
    if(!result || result.error){
        const errMsg = "error: "+ (!result? "API failed": result.error);
        console.log(errMsg);
        onError(errMsg);
    }else{
        const {data} = result;
        if(data && data.status === "success"){
            if(data.data.qregrest < 0 || data.data.qsrvrest < 0){
                onExpired("No. antrian expired, silahkan daftar antrian lagi");
            }else{
                onSuccess(data.data);
            }
        }else{
            onError("error: data undefined");
        }
    }
}

