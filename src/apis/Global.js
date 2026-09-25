
import { Http} from "@capacitor-community/http";
export const RESPONSE_OK = 200;
export const RESPONSE_NOK = 500;
export const IS_DEMO = true;
//Development
// export const HOST = "http://localhost/rhomesrestapi";
//  export const HOST_QUEUE = "http://localhost/rhomesqueue/queue";
//Production
//export const HOST = "https://jobs.reendoo.com/rhomesrestapi";
export const HOST = "https://service.reendoo.com/rhomesrestapi";
//export const HOST_QUEUE = "https://jobs.reendoo.com/rsaqueue/queue";

let db = "livedb"; //default DB

export const post = async (url, data) => {
    try{
        let resp;
        if(data){
            resp = await Http.post({
                url,
                headers:{ 'Content-Type': 'application/json' },
                data: {...data, db}
            });
        }else{
            resp = await Http.post({url});
        }
        return {
            error: null,
            data: JSON.parse(resp.data)
        }
    }catch(err){
        return {
            data: null,
            error: JSON.stringify(err)
        }
    }
}


export const get = async (url, data) => {
    try{
        let resp;
        if(data){
            resp = await Http.get({
                url,
                headers:{ 'Content-Type': 'application/json' },
                data: {...data, db}
            });
        }else{
            resp = await Http.get({url});
        }
        return {
            error: null,
            data: JSON.parse(resp.data)
        }
    }catch(err){
        return {
            data: null,
            error: JSON.stringify(err)
        }
    }
}

export const setDb = (newDb) => {
    db = newDb;
}