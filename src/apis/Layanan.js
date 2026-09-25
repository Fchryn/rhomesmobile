import { post, HOST } from "./Global";

export const getKlinikList = async ({
        onSuccess, 
        lok_id, 
        man_id, 
        kun_statusbayar, 
        page, 
        rows, 
        q, 
        onError
    }) => {
    let result;
    if(q){
        result = await post(`${HOST}/kunjungan/search`,{lok_id, kun_statusbayar,  page, rows, q});
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
        result = await post(`${HOST}/kunjungan/read`,{lok_id, man_id, kun_statusbayar,  page, rows, q});
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

export const getKlinikByKunId = async ({man_com_id, man_usr_id, onSuccess, onError}) => {
    const result = await post(`${HOST}/kunjungan/readbyuserid`, {
        man_com_id, 
        man_usr_id
    });
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        const {rows} = result.data;
        if(rows){
            onSuccess(rows);
        }else{
            console.log("Data pasien tidak ditemukan");
            onSuccess([]);
        }
    }
}
export const listDokterByKelamin = async ({com_id, kelamin, onSuccess}) => {
    const result = await post(`${HOST}/sdm/dokter`, {com_id, kelamin});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            console.log(data);
            onSuccess(data.map(d => ({
                label: d.sdm_nama,
                value: d.sdm_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}
