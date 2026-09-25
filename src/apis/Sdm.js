import { post, HOST } from "./Global";

export const getDokter = async ({onSuccess, com_id, kelamin}) => {
    let result = await post(`${HOST}/sdm/dokter`, {
        com_id, kelamin
    });
    if(!result || result.error){
        console.log("error: "+ (!result? "API failed": result.error));
        onSuccess([]);
    }else{
        const {data} = result;
        if(data && data.length > 0){
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