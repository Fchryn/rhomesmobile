import { post, HOST } from "./Global";

export const laporanInventory = async ({
    date_from, 
    date_to,
    ith_event,
    asal,
    tujuan,
    onSuccess,
    onError
}) => {
    const result = await post(`${HOST}/laporan/inventory`, {
        date_from, 
        date_to,
        ith_event,
        asal,
        tujuan
    });
    if(!result || result.error){
        onError(!result? "System error" : result.error);
    }else{
        const {rows} = result.data;
        if(rows){
            onSuccess(
                rows.map(r => {
                    if(r.from_nama){
                        r.asal = `${r.from_norm}_${r.from_nama}`;
                    }else if(r.from_lokasi){
                        r.asal = r.from_lokasi;
                    }else if(r.from_supplier){
                        r.asal = r.from_supplier;
                    }else{
                        r.asal = "-";
                    }
                    if(r.to_nama){
                        r.tujuan = `${r.to_norm}_${r.to_nama}`;
                    }else if(r.to_lokasi){
                        r.tujuan = r.to_lokasi;
                    }else if(r.to_supplier){
                        r.tujuan = r.to_supplier;
                    }else{
                        r.tujuan = "-";
                    }
                    return r;
                })
            );
        }else{
            onSuccess([]);
            console.log("Data  tidak ditemukan");    
        }
    }
}