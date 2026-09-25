import { post, HOST } from "./Global";
export const getManusiaList = async ({man_com_id, page, rows, q, onSuccess, onError}) => {
    let result;
    if(q){
        result = await post(`${HOST}/manusia/search`, {
            man_com_id, 
            page, 
            rows,
            q
        });
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
    }else{
        result = await post(`${HOST}/manusia/read`, {
            man_com_id, 
            page, 
            rows
        });
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

export const getManusiaByProps = async ({man_com_id, man_usr_id, man_telpon, onSuccess, onError}) => {
    const result = await post(`${HOST}/manusia/readbyuserorphone`, {
        man_com_id, 
        man_usr_id,
        man_telpon
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

export const getIbuList = async ({man_com_id, q, onSuccess}) => {
    const result = await post(`${HOST}/manusia/ibusearch`, {
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
                label: `${d.man_norm}_${d.man_nama}`,
                value: d.man_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const saveManusia = async ({onSuccess, onError, ...data}) => {
    const result = await post(`${HOST}/manusia/save`, data);
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
