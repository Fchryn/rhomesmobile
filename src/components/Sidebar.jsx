import React, { useContext, useEffect, useRef, useState } from 'react';
import {routes} from '../constants/Urls';
import DynamicIcon from './DynamicIcon';
import { IconButton } from './IconButton';
import { AppContext } from '../App';

export const Sidebar = () => {
  const context = useContext(AppContext);
  const [show, setShow] = useState(false);
  const [menus, setMenus] = useState(
    context.user && context.user.role === 'rd_recliens'?[]:
    context.userType === null?[
      {
        text: "Lokasi",
        url: routes.lokasi,
        icon: "IoLocationOutline"
      },
      {
        text: "Agama",
        url: routes.agama,
        icon: "IoSparklesOutline"
      }, 
       {
        text: "Pegawai",
        url: routes.pegawai,
        icon: "IoPeopleCircleOutline"
      },
      {
        text: "Kamar",
        url: routes.kamar,
        icon: "IoBedOutline"
      },
      {
        text: "Layanan",
        url: routes.layanan,
        icon: "IoGiftOutline"
      },
      {
        text: "Penyakit",
        url: routes.penyakit,
        icon: "IoSkullOutline"
      },
      {
        text: "Tindakan",
        url: routes.tindakan,
        icon: "IoBandageOutline"
      },
      {
        text: "Supplier",
        url: routes.supplier,
        icon: "IoStorefrontOutline"
      }
    ]:
    context.userType === 'PEGAWAI'?[
    {
      text: "Lokasi",
      url: routes.lokasi,
      icon: "IoLocationOutline"
    },
    {
      text: "Agama",
      url: routes.agama,
      icon: "IoSparklesOutline"
    }, 
     {
      text: "Pegawai",
      url: routes.pegawai,
      icon: "IoPeopleCircleOutline"
    },
    {
      text: "Kamar",
      url: routes.kamar,
      icon: "IoBedOutline"
    },
    {
      text: "Layanan",
      url: routes.layanan,
      icon: "IoGiftOutline"
    },
    {
      text: "Penyakit",
      url: routes.penyakit,
      icon: "IoSkullOutline"
    },
    {
      text: "Tindakan",
      url: routes.tindakan,
      icon: "IoBandageOutline"
    },
    {
      text: "Supplier",
      url: routes.supplier,
      icon: "IoStorefrontOutline"
    }
  ]:
  [{
    text: "Lokasi",
    url: routes.lokasi,
    icon: "IoLocationOutline"
  }])
  const siedbarRef = useRef();
  const closeSidebar = () => {
    setShow(false);
    setTimeout(()=>{
      context.setSidebarOn(false);
    },300);
  }

  useEffect(()=>{
    console.log(context)
    setTimeout(()=>{
      setShow(true);
    },30);
    const checkToCloseSidebar = (event) => {
      if(siedbarRef.current && !siedbarRef.current.contains(event.target)){
        closeSidebar();
      }
    }
    document.addEventListener('click', checkToCloseSidebar);
    return ()=>{
        document.removeEventListener('click', checkToCloseSidebar);
    }
  },[]);

  return (
    <div className="fixed top-0 w-full h-screen z-20">
      <div className="absolute bg-black opacity-60 w-full h-screen"/>     
      <div className={`absolute bottom-0 top-14 w-72 bg-white shadow rounded-tr-3xl p-5 transition-all duration-300 ${show ? "left-0":"-left-72"}`}
        ref={siedbarRef}
      >
        <IconButton bigger title="Tutup Sidebar"
          color="text-gray-700"
          onClick={closeSidebar}
          bgHoverColor="hover:bg-gray-100"
          customClass="absolute top-2 right-2"
          icon="IoCloseOutline"
        />
        <div className="flex flex-col h-full">
          <div className="font-bold text-lg mb-4">
            Pengaturan
          </div>
          {
            menus.map((m, index)=>(
              
              <div key={m.url} className={`${index == 0 ? "" : "border-t"} py-2 flex text-gray-600 items-center cursor-pointer`}>
                <DynamicIcon name={m.icon} className="w-5 h-5"/>
                <div className="flex-1 ml-3">
                <div key={index} onClick={()=>{window.location.href = m.url}}>{m.text}</div>
        
                </div>
              </div>
            ))
          }
          <div className="flex-grow"/>
            <button className="mt-5 w-full md:w-1/2 text-white bg-indigo-600 font-bold p-4 rounded-xl shadow-xl hover:bg-indigo-700"
                onClick={context.logOut}
            >
                Log Out
            </button>
        </div>
      </div>
    </div>
  );
};
