import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { Sidebar } from './components/Sidebar.jsx';
import { routes } from './constants/Urls';
import { Toast } from './components/Toast.jsx';
import { Login } from './pages/Login.jsx';
import { LoginVisitor } from './pages/LoginVisitor.jsx';
import { LoginAs } from './pages/LoginAs.jsx';
import { Home } from './pages/Home.jsx';
import { Pasien } from './pages/Pasien.jsx';
import { Klinik } from './pages/Klinik.jsx';
import { addDays, addMinutes } from 'date-fns';
import { getConfig } from './apis/User.js';
import { getMinDate } from './apis/Dashboard.js';
import { Lokasi } from './pages/Lokasi.jsx';
import { PasienDetail } from './pages/PasienDetail.jsx';
import { Kualifikasi } from './pages/Kualifikasi.jsx';
import { Supplier } from './pages/Supplier.jsx';
import { Penyakit } from './pages/Penyakit.jsx';
import { PenyakitDetail } from './pages/PenyakitDetail.jsx';
import { Laborat } from './pages/Laborat.jsx';
import { Pegawai } from './pages/Pegawai.jsx';
import { PegawaiDetail } from './pages/PegawaiDetail.jsx';
import { Tindakan } from './pages/Tindakan.jsx';
import { TindakanDetail } from './pages/TindakanDetail.jsx';
import { DksTindakanDetail } from './pages/DksTindakanDetail.jsx';
import { Agama } from './pages/Agama.jsx';
import { Kamar } from './pages/Kamar.jsx';
import { KamarDetail } from './pages/KamarDetail.jsx';
import { Kunperiksa } from './pages/Kunperiksa.jsx';
import { Kunbiaya } from './pages/Kunbiaya.jsx';
import { Layanan } from './pages/Layanan.jsx';
import { LayananDetail } from './pages/LayananDetail.jsx';
import { setDb } from './apis/Global.js';
import { DataDiriEdit } from './pages/DataDiriEdit.jsx';
import { DataDiriTambah } from './pages/DataDiriTambah.jsx';
import { cloneDeep } from 'lodash';

//CSS Libraries
import "flatpickr/dist/themes/light.css";
import "cleave.js/dist/addons/cleave-phone.id";
import { Loket} from './pages/Loket.jsx';
import { LoketEdit } from './pages/LoketEdit.jsx';
import { LoketTambah } from './pages/LoketTambah.jsx';
import { Kasir } from './pages/Kasir.jsx';
import { KasirDetail } from './pages/KasirDetail.jsx';
import { Inventory } from './pages/Inventory.jsx';
import { InventoryItem } from './pages/InventoryItem.jsx';
import { InventoryRcv } from './pages/InventoryRcv.jsx';
import { Laporan } from './pages/Laporan.jsx';
import { PasienTambah } from './pages/PasienTambah.jsx';
import { PasienEdit } from './pages/PasienEdit.jsx';
import { Antrian } from './pages/Antrian.jsx';
import { Billing } from './pages/Billing.jsx';
import { Riwayat } from './pages/Riwayat.jsx';

export const AppContext = React.createContext();

export const App = () => {
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState(null);
  const [pasienList, setPasienList] = useState([]);
  const [pasienKlinik, setPasienKlinik] = useState(null);
  const [master, setMaster] = useState(null);
  const [pasienEdit, setPasienEdit] = useState(null);
  const [kunId, setKunId] = useState(null);
  const [config, setConfig] = useState(null);
  const [sidebarOn, setSidebarOn] = useState(false);
  const [minDate, setMinDate] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [po, setPo] = useState(null);
  const [rcv, setRcv] = useState(null);
  const [visitorKlinik, setVisitorKlinik] = useState([]);
  const isRdRecliens = user && user.role === 'rd_recliens';
  useEffect(()=>{
    if(!user){
      try {
        // Get from local storage by key
        const _user = window.localStorage.getItem("rhomesUser");
        if(!_user){
          setUser(null);
          return;
        }
        const _userJson = JSON.parse(_user);
        if(!_userJson || !_userJson.expired){
          setUser(null);
          return;
        }
        const currentDate = new Date();
        const expiryDate = new Date(_userJson.expired);
        if(expiryDate < currentDate){
          setUser(null);
          return;
        }
        setUserWithExpiryDate(_userJson); //set expiration login state
      } catch (error) {
        console.log(error);
        setUser(null);
      }
    }else{
      try {
        // Save to local storage
        window.localStorage.setItem("rhomesUser", JSON.stringify(user));
      } catch (error) {
        console.log(error);
      }
    }
  },[JSON.stringify(user)]);

  useEffect(()=>{
    if(!user || !user.currentLocation){
      return;
    }
    getConfig({
      lok_id: user.currentLocation.lok_id,
      onSuccess: setConfig,
      onError: (err)=>window.pushToast(err, "error")
    });
  },[JSON.stringify(user)]);

  useEffect(()=>{
    if(user && user.db){
      setDb(user.db);
    }
  }, [JSON.stringify(user)])

  const logOut = () => {
    window.localStorage.setItem("rhomesUser", null);
    setSidebarOn(false);
    setUser(null);
  }

  const setUserWithExpiryDate = (_user) => {
    const currentDate = new Date();
    setUser({
      ..._user,
      expired : addDays(currentDate, 1) //set expiration login state
    });
  }

  const setUserWithLocation = (location) => {
    setPasienList([]);
    setUser({
      ...user,
      currentLocation : location
    });
  }

  const setPasienIndex = (index) => {
    setUser({
      ...user,
      pasienIndex : index
    });
  }

  const addPasien = (data) => {
    const list = cloneDeep(pasienList);
    list.push(data);
    setPasienList(list);
    setPasienIndex(list.length - 1);
  }

  const updatePasien = (data) => {
    const list = cloneDeep(pasienList);
    const index = user.pasienIndex === undefined ? 0 : user.pasienIndex;
    list[index] = data;
    setPasienList(list);
  }

  useEffect(()=>{
    if(!user || !user.currentLocation){
      return;
    }
    getMinDate({
      com_id: user.currentLocation.com_id,
      onSuccess: setMinDate,
      onError: (err)=>window.pushToast(err, "error")
    });
  },[JSON.stringify(user)]);
  return(
    <AppContext.Provider value={{
        user,
        setUser,
        setUserWithExpiryDate,
        setUserWithLocation,
        pasienList,
        setPasienList,
        addPasien,
        updatePasien,
        setPasienIndex,
        pasienEdit,
        setPasienEdit,
        sidebarOn,
        setSidebarOn,
        logOut,
        config,
        setConfig,
        userType,
        setUserType,
        pasienKlinik,
        setPasienKlinik,
        master,
        setMaster,
        kunId,
        setKunId,
        minDate,
        setMinDate,
        canEdit,
        setCanEdit,
        po,
        setPo,
        rcv,
        setRcv,
        visitorKlinik,
        setVisitorKlinik
      }}
    >
      {
        !user? (
          !userType ? <LoginAs/> : (
            userType === 'PENGUNJUNG' ? <LoginVisitor/> : <Login/> 
          )
        )
        :  
        <BrowserRouter>
          {
            user.usr_type === 'PENGUNJUNG' ?
            <Routes>
              <Route exact path={"/"} element={<Home />} />
              <Route exact path={routes.dashboard} element={<Home />} />
              <Route exact path={routes.pasien} element={<Pasien />} />
              <Route exact path={routes.agama} element={<Agama />} />
              <Route exact path={routes.kamar} element={<Kamar/>} />
              <Route exact path={routes.layanan} element={<Layanan />} />
              <Route exact path={routes.kualifikasi} element={<Kualifikasi />} />
              <Route exact path={routes.pegawai} element={<Pegawai />} />
              <Route exact path={routes.laborat} element={<Laborat />} />
              <Route exact path={routes.penyakit} element={<Penyakit />} />
              <Route exact path={routes.supplier} element={<Supplier />} />
              <Route exact path={routes.lokasi} element={<Lokasi />} />
              <Route exact path={routes.pasienEdit} element={<DataDiriEdit/>} />
              <Route exact path={routes.pasienTambah} element={<DataDiriTambah/>} />
              <Route exact path={routes.loket} element={<Loket/>} />
              <Route exact path={routes.klinik} element={<Klinik/>} />
              <Route exact path={routes.kasir} element={<Kasir/>} />
              <Route exact path={routes.inventory} element={<Inventory/>} />
              <Route exact path={routes.antrian} element={<Antrian/>}/>
              <Route exact path={routes.visitorBilling} element={<Billing/>}/>
              <Route exact path={routes.visitorRiwayat} element={<Riwayat/>}/>
            </Routes>:
            <Routes>
              <Route exact path={"/"} element={<Home />} />
              <Route exact path={routes.dashboard} element={<Home />} />
              <Route exact path={routes.lokasi} element={<Lokasi />} />
              <Route exact path={routes.pasienEdit} element={<PasienEdit/>} />
              <Route exact path={routes.agama} element={<Agama />} />
              <Route exact path={routes.kamar} element={<Kamar/>} />
              <Route exact path={routes.kamarDetail} element={<KamarDetail/>} />
              <Route exact path={routes.layanan} element={<Layanan />} />
              <Route exact path={routes.layananDetail} element={<LayananDetail />} />
              <Route exact path={routes.kualifikasi} element={<Kualifikasi />} />
              <Route exact path={routes.kunperiksa} element={<Kunperiksa />} />
              <Route exact path={routes.kunbiaya} element={<Kunbiaya />} />
              <Route exact path={routes.pegawai} element={<Pegawai />} />
              <Route exact path={routes.pegawaiDetail} element={<PegawaiDetail />} />
              <Route exact path={routes.laborat} element={<Laborat />} />
              <Route exact path={routes.penyakit} element={<Penyakit />} />
              <Route exact path={routes.penyakitDetail} element={<PenyakitDetail />} />
              <Route exact path={routes.tindakan} element={<Tindakan />} />
              <Route exact path={routes.tindakanDetail} element={<TindakanDetail />} />
              <Route exact path={routes.dkstindakanDetail} element={<DksTindakanDetail />} />
              <Route exact path={routes.supplier} element={<Supplier />} />
              <Route exact path={routes.pasien} element={<Pasien />} />
              {!isRdRecliens && <>
                <Route exact path={routes.loket} element={<Loket/>} />
                <Route exact path={routes.loketEdit} element={<LoketEdit/>} />
                <Route exact path={routes.loketTambah} element={<LoketTambah/>} />
                <Route exact path={routes.klinik} element={<Klinik/>} />
                <Route exact path={routes.kasir} element={<Kasir/>} />
                <Route exact path={routes.kasirDetail} element={<KasirDetail/>} />
                <Route exact path={routes.inventory} element={<Inventory/>} />
                <Route exact path={routes.inventoryItem} element={<InventoryItem/>} />
                <Route exact path={routes.inventoryRcv} element={<InventoryRcv/>} />
                <Route exact path={routes.laporan} element={<Laporan/>} />
              </>}
              <Route exact path={routes.pasienTambah} element={<PasienTambah/>} />
            </Routes>
          }
        </BrowserRouter>
      }
      <Toast/>   
      {
          !sidebarOn ? null : 
          <Sidebar/>
      }
    </AppContext.Provider>
  );
};