import React, { useContext, useState } from 'react';
import { CLASS_FIELD_LABEL, CLASS_TEXTFIELD_PL} from '../constants/Styles';
import hospital from '../assets/hospital.jpg';
import { IoKeyOutline,  IoPersonOutline} from "react-icons/io5";
import { AppContext } from '../App';
import { login } from '../apis/User';
import { IconButton } from '../components/IconButton';
import { Loading } from '../components/Loading';

export const Login = () => {
    const context = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [password,setPassword] =useState("");
    const [loading, setLoading] = useState(false);
    const handleLogin = () =>{
        setLoading(true);
        login({
            username, 
            password,
            onSuccess: (response)=>{
                context.setUserWithExpiryDate(response);
                setLoading(false);
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
        });
    }
    return (
        <div className="absolute h-screen w-full bg-bgdefault z-10">
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
                                Username
                            </div>
                            <div className="relative">
                                <input type="text" className={CLASS_TEXTFIELD_PL}
                                    onChange={(e)=>setUsername(e.target.value)}
                                    value={username}
                                />
                                <IoPersonOutline className="absolute top-4 left-2 w-5 h-5 text-gray-400"/>
                            </div>
                        </div>
                        <div className="mb-5">
                            <div className={CLASS_FIELD_LABEL}>
                                Password
                            </div>
                            <div className="relative">
                                <input type="password" className={CLASS_TEXTFIELD_PL}
                                    onChange={(e)=>setPassword(e.target.value)}
                                    value={password}
                                />
                                <IoKeyOutline className="absolute top-4 left-2 w-5 h-5 text-gray-400"/>
                            </div>
                        </div>
                    </div>
                    <div className="px-8 flex justify-center">
                        <button className="flex items-center justify-center w-full md:w-1/2 text-white bg-indigo-600 font-bold p-4 rounded-xl shadow-xl hover:bg-indigo-700"
                            onClick={handleLogin}
                        >
                            {
                                loading ? <div className="mr-12"><Loading/></div> : null
                            }
                            <div>Masuk</div>
                        </button>
                    </div>
                    <div className="text-center text-sm text-gray-400 py-4">
                        By <b>ReenDoo</b> {new Date().getFullYear()}
                    </div>
                </div>
            </div>
        </div>
    )
}
