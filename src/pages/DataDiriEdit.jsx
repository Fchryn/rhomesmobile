import { IoChevronDown} from "react-icons/io5";
import { cloneDeep } from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { saveManusia } from "../apis/Manusia";
import { AppContext } from "../App";
import { IconButton } from "../components/IconButton";
import { Modal } from "../components/Modal";
import { RadioButton } from "../components/RadioButton";
import { routes } from "../constants/Urls";
import { PasienDetail } from "./PasienDetail";

export const DataDiriEdit = () => {
    const {user, pasienList, updatePasien, setPasienIndex} = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [pasienModal, setPasienModal] = useState(false);
    const index = user.pasienIndex === undefined? 0 : user.pasienIndex;

    useEffect(()=>{
        if(pasienList.length < 1){
            navigate("/");
        }
    },[])

    const handleSave = (data) => {
        setLoading(true);
        saveManusia({
            onSuccess: (savedData)=>{
                updatePasien(savedData);
                navigate("/");
            },
            onError: (err)=>{
                window.pushToast(err, "error");
                setLoading(false);
            },
            ...data
        })
    }
    return( 
        <div>
            <PasienDetail title={
                pasienList.length < 1? "Edit Data Diri" :
                <div className="flex items-center">
                    <div className="mr-3 cursor-pointer flex items-center hover:text-pink-100" onClick={()=>setPasienModal(true)}>
                        <div className="mr-2">{pasienList[index].man_nama}</div>
                        <IoChevronDown className="w-4"/>
                    </div>
                </div>
            }
                dataProp={pasienList ? cloneDeep(pasienList[index]) : null}
                onSave={handleSave}
                isLoading = {loading}
            />
            {
                !pasienModal? null:
                <Modal title="Pilih Pasien"
                    onCancel={()=>setPasienModal(false)}
                >
                {
                    pasienList.map((p,idx) => (
                        <div className="flex items-center flex-grow mb-3" key={idx}>
                            <RadioButton
                                checkedColor={"checked:bg-pink-500"}
                                borderColor={"border-pink-500"}
                                onClick={()=>setPasienIndex(idx)}
                                isChecked={idx === index}
                            />
                            <div>
                                {p.man_nama} ({p.man_kelamin})
                            </div>
                        </div>
                    ))
                }
                </Modal>
            }
            <div className="fixed z-10 right-4 bottom-24">
                <IconButton bigger icon={"IoAddOutline"} title="add" 
                    color="text-white" bgColor="bg-pink-500" bgHoverColor="hover:bg-pink-600"
                    onClick={()=>navigate(routes.pasienTambah)}
                />
            </div>
        </div>
    )
}