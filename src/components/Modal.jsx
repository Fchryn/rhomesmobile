import React, {useState, useRef, useEffect} from "react";
import {routes} from '../constants/Urls';
import { IconButton } from './IconButton';

export const Modal = ({
    title,
    children, 
    unclosable,
    confirmButton, 
    cancelButton, 
    onCancel, 
    onConfirm
}) => {
    const [show, setShow] = useState(false);
    const modalRef = useRef();
    const closeModal = () => {
        setShow(false);
        setTimeout(()=>{
            onCancel();
        },300);
    }
    const confirmModal = () => {
        setShow(false);
        setTimeout(()=>{
            onConfirm();
        },300);
    }

    useEffect(()=>{
        let checkToCloseModal;
        setTimeout(()=>{
          setShow(true);
          checkToCloseModal = (event) => {
            if(modalRef.current && !modalRef.current.contains(event.target)){
              closeModal();
            }
          }
          document.addEventListener('click', checkToCloseModal);
        },30);
        if(unclosable){
           return; 
        }
        return ()=>{
            document.removeEventListener('click', checkToCloseModal);
        }
    },[]);
    return (
        <div className="fixed top-0 w-full h-screen z-20">
            <div className="absolute bg-black opacity-60 w-full h-screen"/>     
            <div className="absolute w-full h-screen flex flex-col justify-center">
                <div className={`flex justify-center transition-opacity duration-300`}>
                    <div className="relative w-10/12 md:w-1/2 bg-white rounded-2xl max-h-screen overflow-y-auto" ref={modalRef}>
                        {
                             unclosable?null:
                             <IconButton icon={"IoClose"} title="Tutup" color="text-gray-700" bgHoverColor="hover:bg-gray-100"
                                customClass="absolute top-2 right-2"
                                onClick={closeModal}
                            />
                        }
                        <div className="p-5 text-lg font-bold">
                            {title}
                        </div>
                        <div className="px-5">
                            {children}
                            <div className="py-5 flex justify-around">
                                {
                                    !cancelButton? null:
                                    <button className="bg-red-600 hover:bg-red-700 text-white rounded-full py-3 px-4"
                                        onClick={closeModal}
                                    >
                                        {cancelButton}
                                    </button>
                                }
                                {
                                    !confirmButton? null:
                                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-3 px-4"
                                        onClick={confirmModal}
                                    >
                                        {confirmButton}
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}