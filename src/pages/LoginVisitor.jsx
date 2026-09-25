import React, { useContext, useEffect, useState } from 'react';
import { CLASS_FIELD_LABEL, CLASS_TEXTFIELD} from '../constants/Styles';
import hospital from '../assets/hospital.jpg';
import { AppContext } from '../App';
import { loginOTP, verifyOTP } from '../apis/User';
import Cleave from 'cleave.js/react';
import OtpInput from 'react-otp-input';
import { IconButton } from '../components/IconButton';
import { useNavigate } from 'react-router';
import { ButtonBlock } from '../components/ButtonBlock';
import { Loading } from '../components/Loading';
import { PhoneInput } from '../components/PhoneInput';

export const LoginVisitor = () => {
    const context = useContext(AppContext);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState("phone");
    const [expiredCounter, setExpiredCounter] = useState(0);
    const [otpDemo, setOtpDemo] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        if(expiredCounter > 0){
            setTimeout(()=>{
                setExpiredCounter(expiredCounter - 1);
            }, 1000)
        }
    },[expiredCounter]);

    const handleLogin = () =>{
        setOtp("");
        setLoading(true);
        loginOTP({
            phone: phone.replace(/\s/g, ''),
            onSuccess: (code)=>{
                setStep("otp");
                setExpiredCounter(60);
                setOtpDemo(code);
                setLoading(false);
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
        });
    }

    const handleVerify = () => {
        setLoading(true);
        verifyOTP({
            phone: phone.replace(/\s/g, ''),
            code: otp,
            onSuccess: (userData) => context.setUserWithExpiryDate({
                ...userData, 
                man_telpon: phone.replace(/\s/g, '')
            }),
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
        });
    }

    return (
        <div className="absolute h-screen w-full bg-bgdefault z-10">
            {
                step === "phone" ?
                <div className="flex flex-col md:flex-row h-full">
                    <IconButton bigger icon="IoChevronBack"
                        bgColor="bg-gray-100" bgHoverColor="hover:bg-gray-200"
                        color="text-indigo-600"
                        title="Back"
                        onClick={()=>context.setUserType("")}
                        customClass="absolute left-3 top-8"
                    />
                    <img src={hospital} alt="welcome" className="w-full md:w-1/2 md:h-full object-cover"/>
                    <div className="flex flex-col justify-center flex-grow">
                        <div className="md:text-center text-2xl font-bold px-8">
                            RhoCS 
                        </div>
                        <div className="md:text-center text-lg text-gray-500 font-bold mb-8 px-8">
                            Sistem Informasi Rumah Sakit Terpadu 
                        </div>
                        <div className="md:w-1/2 mb-8 md:mx-auto px-8">
                            <div className="mb-5">
                                <div className={CLASS_FIELD_LABEL}>
                                    No. Handphone
                                </div>
                                <div className="relative">
                                    <PhoneInput value={phone}
                                        onChange={(e)=>setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center px-8 pb-8">
                            <div className="flex items-center justify-center mt-5 w-full md:w-1/2 text-white bg-indigo-600 font-bold p-4 rounded-xl shadow-xl hover:bg-indigo-700"
                                onClick={handleLogin}
                            >
                                {
                                    loading ? <div className="mr-12"><Loading/></div> : null
                                }
                                <div>Masuk</div>
                            </div>
                        </div>
                        <div className="text-center text-sm text-gray-400 py-4">
                            By <b>ReenDoo</b> {new Date().getFullYear()}
                        </div>
                    </div>
                </div>:
                <div className="flex flex-col justify-center h-full">
                                        
                    <IconButton bigger icon="IoChevronBack"
                        bgColor="bg-gray-100" bgHoverColor="hover:bg-gray-200"
                        color="text-indigo-600"
                        title="Back"
                        onClick={()=>setStep("phone")}
                        customClass="absolute left-3 top-8"
                    />
                    <div className="md:text-center text-xl font-bold mb-8 px-8">
                        Masukkan Kode Verifikasi di SMS
                    </div>
                    {
                        !otpDemo? null:
                        <div className="text-gray-300 text-xs text-center">{otpDemo} (demo only)</div>
                    }
                    <OtpInput
                        shouldAutoFocus={true}
                        value={otp}
                        onChange={setOtp}
                        numInputs={5}
                        containerStyle="space-x-3 mb-8 mx-auto px-8"
                        className="w-10"
                        inputStyle="p-2 rounded-lg border border-gray-300 focus:outline-none text-2xl min-w-full"
                    />
                    <div className="px-8 pb-8 flex justify-center">
                        <button className={`flex items-center justify-center mt-5 w-full md:w-1/2 text-white ${(otp.length < 5 || expiredCounter < 1)?'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700' } font-bold p-4 rounded-xl shadow-xl`}
                            onClick={handleVerify}
                            disabled = {otp.length < 5 || expiredCounter < 1}
                        >
                            {
                                loading ? <div className="mr-12"><Loading/></div> : null
                            }
                            <div>Verifikasi</div>
                        </button>
                    </div>
                    
                    {
                        expiredCounter > 0 ? 
                        <div className="text-center text-gray-400">
                            Verifikasi ulang dalam&nbsp;
                            <span className="font-bold">{expiredCounter}</span>
                            &nbsp;detik
                        </div>: 
                        <div className="text-center text-gray-400 px-8">
                            Kode expired, silahkan kirim ulang kode untuk verifikasi
                        </div>
                    }
                    <div className="px-8 flex justify-center">
                        <button className={`mt-5 w-full md:w-1/2 ${expiredCounter<1 ? "text-indigo-600 border-indigo-600" : "text-indigo-300 border-indigo-300"} bg-white font-bold p-4 border rounded-xl shadow-xl hover:bg-gray-100`}
                            onClick={handleLogin}
                            disabled = {expiredCounter > 0}
                        >
                            Kirim Ulang Kode
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}
