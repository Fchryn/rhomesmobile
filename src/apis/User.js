import { post, HOST, IS_DEMO } from "./Global";
export const login = async ({username, password, onSuccess, onError}) => {
    const result = await post(`${HOST}/main/loginsubmit`, {
        username, 
        password
    });
    if(result.error){
        onError(result.error);
    }else{
        const {login_data, status} = result.data;
        if(status === "success"){
            onSuccess(login_data);
        }else{
            onError("Username/password salah");
        }
    }
}

export const loginOTP = async ({phone, onSuccess, onError}) => {
    const result = await post(`${HOST}/main/loginsubmitOTP`, {otp_phone:phone, is_demo: IS_DEMO});
    if(result.error){
        onError(result.error);
    }else{
        const {status, error_message, message, code} = result.data;
        if(status === "success"){
            onSuccess(code);
        }else if(error_message){
            onError(error_message);
        }else if(message){
            onError(message);
        }else{
            onError("Error saat cek no. HP");
        }
    }
}


export const verifyOTP = async ({code, phone, onSuccess, onError}) => {
    const result = await post(`${HOST}/main/verifyOTP`, {otp_phone:phone, otp_code:code});
    if(result.error){
        onError(result.error);
    }else{
        const {status, user} = result.data;
        if(status === "success"){
            onSuccess(user);
        }else{
            onError("Verifikasi gagal");
        }
    }
}


export const getConfig = async ({lok_id, onSuccess, onError}) => {
    const result = await post(`${HOST}/config/read`, {lok_id});
    if(result.error){
        onError(result.error);
    }else{
        onSuccess(result.data);
    }
}