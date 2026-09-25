import { sub } from "date-fns";
import format from "date-fns/format";
import React, { useEffect, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { laporanInventory } from "../apis/Laporan";
import { DateRangePicker,DATE_PATTERN_SQL } from "../components/DateRangePicker";
import { LoadingOverlay } from "../components/Loading";
import { SelectSimple } from "../components/SelectSimple";
import { itemHolder, itemTransactions } from "../constants/Entities";
import { CLASS_FIELD_LABEL } from "../constants/Styles";
const currentDate = new Date();
const beginningDate = sub(currentDate, {months:1});

export const LaporanInventory = ()=> {
    const [dateFrom, setDateFrom] = useState(format(beginningDate, DATE_PATTERN_SQL));
    const [dateTo, setDateTo] = useState(format(currentDate, DATE_PATTERN_SQL));
    const [activity, setActivity] = useState(null);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [menuMinimized, setMenuMinimized] = useState(true);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);

    useEffect(()=>{
        if(dateFrom && dateTo){
            applyFilter();
        }
    },[dateFrom, dateTo]);

    const onDateChange=(dtFrom, dtTo)=>{
        setDateFrom(dtFrom);
        setDateTo(dtTo);
    }

    const applyFilter = () => {
        setLoading(true);
        laporanInventory({
            date_from: dateFrom,
            date_to: dateTo,
            asal: from,
            tujuan: to,
            ith_event: activity,
            onSuccess:(rows)=>{
                setLoading(false);
                setList(rows);
            },
            onError:(err)=>{
                setLoading(false);
                setList([]);
                window.pushToast(err, "error");
            }
        })
    }

    return (
        <div className="h-screen bg-slate-200 w-fit min-w-full">
            {
                !loading? null : 
                <LoadingOverlay/>
            }
            <div className="h-full pt-20 overflow-scroll px-4 pb-60">
            {
                list.length < 1 ? 
                <div className="text-center text-slate-600">
                    Tidak ada data
                </div>:
                <div className="text-slate-600 rounded-xl bg-bgdefault p-3">
                    <div className="flex font-bold pb-3 border-b-2">
                        <div className="w-28 p-1" >Tanggal</div>
                        <div className="w-40 p-1" >Kode Item</div>
                        <div className="w-44 p-1">Nama Item</div>
                        <div className="w-20 p-1">Qty</div>
                        <div className="w-24 p-1">Aktifitas</div>
                        <div className="w-32 p-1">Dari</div>
                        <div className="w-32 p-1">Ke</div>
                    </div>
                    <div>
                    {
                        list.map((li, idx)=>(
                            <div className={`flex py-2 ${idx===0? "" : "border-t" }`} key={idx}>
                                <div className="w-28 p-1" >{li.ith_date}</div>
                                <div className="w-40 p-1" >{li.obt_kode}</div>
                                <div className="w-44 p-1">{li.obt_nama}</div>
                                <div className="w-20 p-1">{li.ith_qty}</div>
                                <div className="w-24 p-1">{li.ith_event}</div>
                                <div className="w-32 p-1">{li.asal}</div>
                                <div className="w-32 p-1">{li.tujuan}</div>
                            </div>
                        ))
                    }
                    </div>
                </div>
            }
            </div>
            <div className={`border-2 px-4 bg-gray-50 w-full rounded-t-3xl shadow-2xl fixed ${menuMinimized? "-bottom-72":"-bottom-0.5"} transition-all duration-300`}>
                <div className="my-4">
                    <div className={CLASS_FIELD_LABEL}>
                        Tanggal
                    </div>
                    <DateRangePicker dateFrom={dateFrom}
                        dateTo={dateTo}
                        onDateChange={onDateChange}
                        separator="s/d"
                    />
                </div>
                <div onClick={()=>setMenuMinimized(!menuMinimized)}>
                    <div className="flex justify-center items-center px-3 pb-5">
                        <div className="text-gray-500 font-bold mr-3 text-sm">
                            {menuMinimized? "Tampilkan filter" : "Tutup filter"}
                        </div>
                        {
                            menuMinimized? <IoChevronUp className="h-5 w-5 text-gray-500"/> : <IoChevronDown className="h-5 w-5 text-gray-500"/> 
                        }
                    </div>
                </div>
                <div className="mb-5">
                    <div className={CLASS_FIELD_LABEL}>
                        Aktivitas
                    </div>
                    <SelectSimple
                        onChange={(obj)=>setActivity(obj.value)}
                        selected={itemTransactions.find(it=>it.value === activity)}
                        options={itemTransactions}
                        placeholder="Semua Aktifitas"
                    />
                </div>
                <div className="flex mb-5 space-x-3">
                    <div className="flex-grow">
                        <div className={CLASS_FIELD_LABEL}>
                            Dari
                        </div>
                        <SelectSimple
                            onChange={(obj)=>setFrom(obj.value)}
                            selected={itemHolder.find(ih=>ih.value === from)}
                            options={itemHolder}
                            placeholder="Semua"
                            menuPlacement="top"
                        />
                    </div>
                    <div className="flex-grow">
                        <div className={CLASS_FIELD_LABEL}>
                            Ke
                        </div>
                        <SelectSimple
                            onChange={(obj)=>setTo(obj.value)}
                            selected={itemHolder.find(ih=>ih.value === to)}
                            options={itemHolder}
                            placeholder="Semua"
                            menuPlacement="top"
                        />
                    </div>
                </div>
                <div className="flex justify-center px-8 pb-8">
                    <div className="flex items-center justify-center mt-5 w-full md:w-1/2 text-white bg-cyan-500 font-bold p-4 rounded-xl shadow-xl hover:bg-cyan-600"
                        onClick={applyFilter}
                    >
                        Terapkan
                    </div>
                </div>
            </div>
        </div>
    )
}