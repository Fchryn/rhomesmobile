import { post, HOST } from "./Global";

export const getGraphKunjungan = async ({onSuccess,lok_jenis,lok_id,datefrom,dateto}) => {
    let result = await post(`${HOST}/dashboard/graph_new_kunjungan`,{lok_jenis,lok_id,datefrom,dateto});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.result){
            onSuccess(data.result);
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}
export const getGraphHitungGenderPasien = async ({onSuccess,lok_jenis,com_id,datefrom,dateto}) => {
    let result = await post(`${HOST}/dashboard/graph_new_hitung_gender_pasien`,{lok_jenis,com_id,datefrom,dateto});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.result){
            onSuccess(data.result);
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}
export const getGraphHitungPekerjaanPasien = async ({onSuccess,com_id,datefrom,dateto}) => {
    let result = await post(`${HOST}/dashboard/graph_new_hitung_pekerjaan_pasien`,{com_id,datefrom,dateto});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.result){
            onSuccess(data.result);
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}
export const getGraphHitungTindakan = async ({onSuccess,lok_jenis,lok_id,datefrom,dateto}) => {
    let result = await post(`${HOST}/dashboard/graph_new_hitung_tindakan`,{lok_jenis,lok_id,datefrom,dateto});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.result){
            onSuccess(data.result);
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}
export const getGraphTop10Penyakit = async ({onSuccess,lok_id,datefrom,dateto}) => {
    let result = await post(`${HOST}/dashboard/graph_new_top10_penyakit`,{lok_id,datefrom,dateto});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.result){
            onSuccess(data.result);
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const getMinDate = async ({onSuccess,com_id}) => {
    let result = await post(`${HOST}/manusia/min_date`,{com_id});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess(null);
    }else{
        const {data} = result;
        if(data && data.result){
            onSuccess(data.result.minimum);
        }else{
            console.log("error: data undefined");
            onSuccess(null);
        }
    }
}