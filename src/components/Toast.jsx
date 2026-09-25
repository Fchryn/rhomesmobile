import React, {useEffect, useState} from "react";
import { TIMEOUT_TOAST_APPEAR, TIMEOUT_TOAST_DISAPPEAR, TIMEOUT_TOAST_REMOVE } from "../constants/Entities.js";

export const Toast = () =>{
    const [toasts, setToasts] = useState([]);
  
    const pushToast = (msg = '', status = 'success') => {
      const index = toasts.length;
      const _toasts = [...toasts];
      _toasts.push({
              msg,
        status,
        appear: false
          });
      setToasts([..._toasts]);
      setTimeout(() => {
              _toasts[index].appear = true;
        setToasts([..._toasts]);
          }, TIMEOUT_TOAST_APPEAR);
      setTimeout(() => {
              _toasts[index].appear = false;
        setToasts([..._toasts]);
          }, TIMEOUT_TOAST_DISAPPEAR);
      };
  
    useEffect(()=>{
      window.pushToast = pushToast;
      if(toasts.length > 0){
        setTimeout(() => {
          setToasts(toasts.filter((a, i) => i > 0));
        }, TIMEOUT_TOAST_REMOVE);
      }
    },[toasts.length]);
  
    return(
      <div className="block fixed top-4 inset-x-4 z-30">
        {
          toasts.map((toast, index)=>(
            <div key={index} className={`px-4 py-2 mb-2 rounded-md text-white
              ${toast.status == 'success' ? 'bg-green-500' : 
                toast.status == 'info' ? 'bg-blue-500' : 'bg-red-500'}
              ${toast.appear? 'opacity-100': 'opacity-0'} transition-opacity duration-200`}
            >
              {toast.msg}
            </div>
          ))
        }
      </div>
    )
  }