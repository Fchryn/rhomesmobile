import { post, HOST } from "./Global";

export const searchArea = async ({q, onSuccess}) => {
    const result = await post(`${HOST}/area/read`, {q});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.are_nama,
                value: d.are_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}

export const searchAreaDesa = async ({q, are_id, onSuccess}) => {
    const result = await post(`${HOST}/area/desaread`, {q, are_id});
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
            onSuccess(data.map(d => ({
                label: d.are_nama,
                value: d.are_id
            })));
        }else{
            console.log("error: data undefined");
            onSuccess([]);
        }
    }
}
