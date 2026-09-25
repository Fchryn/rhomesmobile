import React, { useContext } from 'react';
import hospital from '../assets/hospital.jpg';
import { AppContext } from '../App';
import { IoPeopleOutline, IoBriefcaseOutline} from "react-icons/io5";

export const LoginAs = () => {
    const context = useContext(AppContext);

    return (
        <div className="absolute h-screen w-full bg-bglogin z-10">
            <div className="flex flex-col md:flex-row justify-end h-full">
                <img src={hospital} alt="welcome" className="w-full md:w-1/2 md:h-full object-cover"/>
                <div className="flex flex-col justify-center md:w-1/2">
                    <div className="mt-8 text-white text-center text-3xl font-bold mb-8 px-8">
                        RhoCS Mobile 
                    </div>
                    <div className="text-center font-bold text-white px-8">
                        Login Sebagai
                    </div>
                    <div className="md:w-1/2 mb-8 md:mx-auto px-8">
                        <div className="px-8 text-center">
                            <div className="mt-5 w-full text-white bg-indigo-600 font-bold p-4 rounded-xl shadow-xl hover:bg-indigo-700 flex items-center cursor-pointer"
                                onClick={()=>context.setUserType("PENGUNJUNG")}
                            >
                                <IoPeopleOutline className="w-5 h-5 text-white mr-4"/>
                                <div className="flex-grow text-left">Pengunjung</div>
                            </div>
                        </div>
                        <div className="px-8 pb-8 flex justify-center">
                            <div className="mt-5 w-full text-white bg-indigo-600 font-bold p-4 rounded-xl shadow-xl hover:bg-indigo-700 flex items-center cursor-pointer"
                                onClick={()=>context.setUserType("PEGAWAI")}
                            >
                                <IoBriefcaseOutline className="w-5 h-5 text-white mr-4"/>
                                <div className="flex-grow text-left">Pegawai</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
