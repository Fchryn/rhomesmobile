import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CardMenu } from "../components/CardMenu";
import {routes} from "../constants/Urls.js";
import { IoChevronUp, IoChevronDown} from "react-icons/io5";
import { IconButton } from "../components/IconButton";
import { AppContext } from "../App";
import { useNavigate } from "react-router";
import { getLokasi} from "../apis/Lokasi";
import { getGraphKunjungan, getGraphTop10Penyakit, getGraphHitungTindakan, getGraphHitungGenderPasien, getGraphHitungPekerjaanPasien} from "../apis/Dashboard";
import { getManusiaByProps } from "../apis/Manusia";
import { getKlinikList } from "../apis/Layanan";
import { LoadingOverlay } from "../components/Loading";
import { ChartKunjungan, ChartTindakan, ChartGender, ChartPenyakit, ChartPekerjaan } from "../components/Chart";
import { MonthPicker } from "../components/MonthPicker";
import { wrapTextBySize } from "../helper/Formatter";
import { DateRangePicker,DATE_PATTERN_SQL } from "../components/DateRangePicker";
import { sub } from "date-fns";
import format from "date-fns/format";
import { DEFAULT_ITEM_COUNT } from "../constants/Entities";
export const Home = () => {
    const currentDate = new Date();
    const beginningDate = sub(currentDate, {months:1});
    const context = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [chartDataKunjungan, setChartDataKunjungan] = useState(null);
    const [chartOptionKunjungan, setChartOptionKunjungan] = useState(null);
    const [chartDataTindakan, setChartDataTindakan] = useState(null);
    const [chartOptionTindakan, setChartOptionTindakan] = useState(null);
    const [chartDataGender, setChartDataGender] = useState(null);
    const [chartOptionGender, setChartOptionGender] = useState(null);
    const [chartDataPenyakit, setChartDataPenyakit] = useState(null);
    const [chartOptionPenyakit, setChartOptionPenyakit] = useState(null);
    const [chartDataPekerjaan, setChartDataPekerjaan] = useState(null);
    const [chartOptionPekerjaan, setChartOptionPekerjaan] = useState(null);
    const [menuMinimized, setMenuMinimized] = useState(false);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [page, setPage] = useState(1);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(format(currentDate, DATE_PATTERN_SQL));
    const isRdRecliens = context.user.role === "rd_recliens";
    const index = context.user.pasienIndex === undefined? 0 : context.user.pasienIndex;
    useEffect(()=>{
        if(!context.user){
            return;
        }
        if(context.user.usr_type === "PENGUNJUNG"){
            if(!context.user.currentLocation){
                navigate(routes.lokasi);
                return;
            }
            if(context.pasienList.length< 1){
                setLoading(true);
                getManusiaByProps({
                    man_com_id: context.user.currentLocation.com_id,
                    man_usr_id: context.user.usr_id,
                    man_telpon: context.user.man_telpon,
                    onSuccess: (rows)=>{
                        setLoading(false);
                        if(rows.length > 0){
                            context.setPasienList(rows);
                            context.setPasienIndex(0);
                        }else{
                            navigate(routes.pasienTambah);
                        }
                    },
                    onError:()=>{
                        setLoading(false);
                    }
                });
            }
        }else{
            if(!context.user.currentLocation){
                getLokasi({
                    lok_id: context.user.lok_id,
                    onSuccess: (loc)=>{
                        context.setUserWithLocation(loc);
                    },
                    onError: (err)=>window.pushToast(err, "error")
                });
                return;
            }
        }
        getGraphKunjungan({
            onSuccess: (retval)=>{
                const kunLabel = retval.map((graph) => wrapTextBySize(graph.yan_nama, 8))
                setChartDataKunjungan({
                    labels: kunLabel,
                    datasets: [
                      {
                        label: "Total Pasien",
                        data: retval.map((graph) => graph.total),
                        backgroundColor: [
                          "#ffbb11",
                          "#a89091",
                          "#50AF95",
                          "#f3ba2f",
                          "#2a71d0",
                          "#ffbb11",
                          "#a89091",
                          "#50AF95"
                        ]
                      }
                    ]
                });
                setChartOptionKunjungan({
                    plugins: {
                        title: {
                          display: true,
                          text: "Total Pasien Berada Di Layanan Tertentu"
                        },
                        legend: {
                          display: true,
                          position: "bottom"
                       }
                    },
                    scales: {
                        xAxes: {
                            ticks: {
                              font: {
                                size: 10
                              }
                            }
                        }
                    },
                    maintainAspectRatio: false,
                    responsive: true
                });
            },
            datefrom:dateFrom,
            dateto:dateTo,
            lok_id:context.user.currentLocation.lok_id,
            lok_jenis: context.user.currentLocation.lok_jenis
        });
        getGraphHitungTindakan({
            datefrom:dateFrom,
            dateto:dateTo,
            lok_id:context.user.currentLocation.lok_id,
            lok_jenis: context.user.currentLocation.lok_jenis,
            
            onSuccess: (retval)=>{
                setChartDataTindakan({
                    labels: context.user.currentLocation.lok_jenis==1?retval.map((graph) => graph.dtin_nama):retval.map((graph) => graph.tin_nama),
                    datasets: [
                      {
                        label: "Total Pasien",
                        data: retval.map((graph) => graph.total),
                        backgroundColor: [
                          "#ffbb11",
                          "#a89091",
                          "#50AF95",
                          "#f3ba2f",
                        ]
                      }
                    ]
                });
                setChartOptionTindakan({
                    plugins: {
                        title: {
                          display: true,
                          text: "Total Pasien Memakai Tindakan"
                        },
                        legend: {
                          display: true,
                          position: "bottom"
                       }
                    },
                    scales: {
                        xAxes: {
                            ticks: {
                              font: {
                                size: 10
                              }
                            }
                        }
                    },
                    maintainAspectRatio: false,
                    responsive: true
                });
            },
            
        });
        getGraphTop10Penyakit({
            onSuccess: (retval)=>{
                setChartDataPenyakit({
                    labels: retval.map((graph) => graph.nama_penyakit),
                    datasets: [
                      {
                        label: "Jumlah Kunjungan",
                        data: retval.map((graph) => graph.jumlah_kunjungan),
                        backgroundColor: [
                          "#ffbb11",
                          "#a89091",
                          "#50AF95",
                          "#f3ba2f",
                          "#2a71d0",
                          "#ffbb11",
                          "#a89091",
                          "#50AF95"
                        ]
                      }
                    ]
                });
                setChartOptionPenyakit({
                    plugins: {
                        title: {
                          display: true,
                          text: "Top 4 Penyakit"
                        },
                        legend: {
                          display: true,
                          position: "bottom"
                       }
                    },
                    scales: {
                        xAxes: {
                            ticks: {
                              font: {
                                size: 10
                              }
                            }
                        }
                    },
                    maintainAspectRatio: false,
                    responsive: true
                });
            },
            datefrom:dateFrom,
            dateto:dateTo,
            lok_id:context.user.currentLocation.lok_id
        });
        getGraphHitungGenderPasien({
            datefrom:dateFrom,
            dateto:dateTo,
            com_id:context.user.currentLocation.com_id,
            lok_jenis: context.user.currentLocation.lok_jenis,
            onSuccess: (retval)=>{
                setChartDataGender({
                    labels: context.user.currentLocation.lok_jenis==1?retval.map((graph) => graph.man_kelamin):retval.map((graph) => graph.hwn_kelamin),
                    datasets: [
                      {
                        label: context.user.currentLocation.lok_jenis==1?"Total Pasien":"Total Pasien Hewan",
                        data: retval.map((graph) => graph.total),
                        backgroundColor: [
                          "#ffbb11",
                          "#a89091",
                          "#50AF95",
                          "#f3ba2f",
                          "#2a71d0",
                          "#ffbb11",
                          "#a89091",
                          "#50AF95"
                        ]
                      }
                    ]
                });
                setChartOptionGender({
                    plugins: {
                        title: {
                          display: true,
                          text: "Total Pasien Berdasarkan Gender"
                        },
                        legend: {
                          display: true,
                          position: "bottom"
                       }
                    },
                    maintainAspectRatio: false,
                    responsive: true
                });
            },
            
        });
        getGraphHitungPekerjaanPasien({
            datefrom:dateFrom,
            dateto:dateTo,
            com_id:context.user.currentLocation.com_id,
            onSuccess: (retval)=>{
                setChartDataPekerjaan({
                    labels: retval.map((graph) => graph.man_pekerjaan),
                    datasets: [
                      {
                        label: "Total Pasien Berdasarkan Pekerjaan",
                        data: retval.map((graph) => graph.total),
                        backgroundColor: [
                          "#ffbb11",
                          "#a89091",
                          "#50AF95",
                          "#f3ba2f",
                          "#2a71d0",
                          "#ffbb11",
                          "#a89091",
                          "#50AF95"
                        ]
                      }
                    ],
                    scales: {         
                        xAxes: [
                          {
                            ticks: {
                              callback: function(label) {
                                if (/\s/.test(label)) {
                                  return label.split(" ");
                                }else{
                                  return label;
                                }              
                              }
                            }
                          }
                        ]
                      }
                });
                setChartOptionPekerjaan({
                    plugins: {
                        title: {
                          display: true,
                          text: "Total Pasien Berdasarkan Pekerjaan"
                        },
                        legend: {
                          display: true,
                          position: "bottom"
                       }
                    },
                    scales: {
                        xAxes: {
                            ticks: {
                              font: {
                                size: 10
                              }
                            }
                        }
                    },
                    maintainAspectRatio: false,
                    responsive: true
                });
            },
            
        });
    },[JSON.stringify(context.user), dateFrom, dateTo]);

    useEffect(()=>{
        setDateFrom(context.minDate);
    },[context.minDate]);

    useEffect(()=>{
        if(context.pasienList.length>0)
        getKlinikList({
            page: 1,
            lok_id:context.user.currentLocation.lok_id,
            rows: DEFAULT_ITEM_COUNT,
            man_id: context.pasienList[index].man_id,
            onSuccess: (rows)=>{
                context.setVisitorKlinik(rows);
                console.log(rows)
            }
        })
    },[context.user]);

    const onDateChange=(dtFrom, dtTo)=>{
        setDateFrom(dtFrom);
        setDateTo(dtTo);
    }

    return( 
        <div className="h-screen bg-indigo-500">
            <div className="fixed z-10 shadow top-0 inset-x-0 bg-white px-3 py-2 flex items-center">
                <div className="flex-grow font-bold text-gray-500">
                {
                    context.user.currentLocation?
                    (
                        context.user.usr_type === "PENGUNJUNG" ? 
                        <div className="cursor-pointer flex items-center hover:text-indigo-500" onClick={()=>navigate(routes.lokasi)}>
                            <div className="text-sm mr-2">{context.user.currentLocation.com_nama}</div>
                            <IoChevronDown className="w-4"/>
                        </div>:
                        <div className="cursor-pointer flex items-center hover:text-indigo-500">
                            <div className="text-sm mr-2">{context.user.currentLocation.com_nama}</div>
                        </div>
                    ):
                    <div>
                        <div>RhoCS Mobile</div>
                    </div>
                }
                </div>
                <IconButton icon={"IoEllipsisVertical"} title="menu" color="text-indigo-500" bgHoverColor="hover:bg-gray-100"
                    onClick={()=>context.setSidebarOn(true)}
                />
            </div>
            <div className="pt-16 h-full">
                <div className="rounded-xl bg-white p-3 mx-3">
                    <div className="text-gray-500 mb-3 font-bold">Statistik per Range Tanggal</div>
                        <DateRangePicker dateFrom={dateFrom}
                            dateTo={dateTo}
                            onDateChange={onDateChange}
                            separator="s/d"
                        />
                </div>
                <div className="flex snap-x snap-mandatory overflow-scroll p-3 h-1/2">
                    <div className="snap-start px-3">
                        <div className="rounded-xl bg-gray-100 text-center p-4 w-96 h-full">
                        {chartDataKunjungan?<ChartKunjungan chartDataKunjungan={chartDataKunjungan} chartOptionKunjungan={chartOptionKunjungan} />:null }
                        </div>
                    </div>
                    <div className="snap-start px-3">
                        <div className="rounded-xl bg-gray-100 text-center p-4 w-56 h-full">
                            {chartDataGender?<ChartGender chartDataGender={chartDataGender} chartOptionGender={chartOptionGender} />:null }
                        </div>
                    </div>
                    <div className="snap-start px-3">
                        <div className="rounded-xl bg-gray-100 text-center p-4 w-96 h-full">
                            {chartDataPekerjaan?<ChartPekerjaan chartDataPekerjaan={chartDataPekerjaan} chartOptionPekerjaan={chartOptionPekerjaan} />:null }
                        </div>
                    </div>
                    <div className="snap-start px-3">
                        <div className="rounded-xl bg-gray-100 text-center p-4 w-96 h-full">
                            {chartDataPenyakit?<ChartPenyakit chartDataPenyakit={chartDataPenyakit} chartOptionPenyakit={chartOptionPenyakit} />:null }
                        </div>
                    </div>
                    <div className="snap-start px-3">
                        <div className="rounded-xl bg-gray-100 text-center p-4 w-96 h-full">
                            {chartDataTindakan?<ChartTindakan chartDataTindakan={chartDataTindakan} chartOptionTindakan={chartOptionTindakan} />:null }
                        </div>
                    </div>
                </div>
                <div className={`bg-gray-50 w-full rounded-t-3xl shadow-2xl fixed ${menuMinimized? "-bottom-64":"-bottom-0.5"} transition-all duration-300`}>
                    <div onClick={()=>setMenuMinimized(!menuMinimized)}>
                        <div className="flex justify-center items-center p-3">
                            <div className="text-gray-500 font-bold text-lg mr-3">
                                Menu
                            </div>
                            {
                                menuMinimized? <IoChevronUp className="h-5 w-5 text-gray-500"/> : <IoChevronDown className="h-5 w-5 text-gray-500"/> 
                            }
                        </div>
                    </div>
                    <div className="flex justify-center px-4 pb-4 h-64">
                    {
                        context.user.usr_type === "PENGUNJUNG" ?
                        <div className="grid grid-cols-3 gap-4">
                            <Link to={context.pasienList.length > 0? routes.pasienEdit : routes.pasienTambah} className=" m-auto">
                                <CardMenu icon="IoIdCardOutline" iconClassName="text-pink-600" title="Data Diri"/>
                            </Link>
                            <Link to={routes.antrian} className=" m-auto">
                                <CardMenu icon="IoPeopleOutline" iconClassName="text-indigo-600" title="Antrian"/>
                            </Link>
                            <Link to={routes.visitorBilling} className=" m-auto">
                                <CardMenu icon="IoCardOutline" iconClassName="text-green-600" title="Billing"/>
                            </Link>
                            <Link to={routes.visitorRiwayat} className=" m-auto">
                                <CardMenu icon="IoBagAddOutline" iconClassName="text-blue-600" title="Rekam Medis"/>
                            </Link>
                        </div>:
                        <div className="grid grid-cols-3 gap-4">
                            <Link to={routes.pasien} className=" m-auto">
                                <CardMenu icon="IoWomanOutline" iconClassName="text-pink-600" title="Pasien"/>
                            </Link>
                            {isRdRecliens ? <>
                                <CardMenu icon="IoEnterOutline" title="Loket" disabled/>
                                <CardMenu icon="IoMedkitOutline" title="Klinik" disabled/>
                                <CardMenu icon="IoCashOutline" title="Kasir" disabled/>
                                <CardMenu icon="IoFileTrayStackedOutline" title="Inventory" disabled/>
                                <CardMenu icon="IoNewspaperOutline" title="Laporan" disabled/>
                            </> : <>
                                <Link to={routes.loket} className=" m-auto">
                                    <CardMenu icon="IoEnterOutline" iconClassName="text-green-600" title="Loket"/>
                                </Link>
                                <Link to={routes.klinik} className=" m-auto">
                                    <CardMenu icon="IoMedkitOutline" iconClassName="text-blue-600" title="Klinik"/>
                                </Link>
                                <Link to={routes.kasir} className=" m-auto">
                                    <CardMenu icon="IoCashOutline" iconClassName="text-orange-600" title="Kasir"/>
                                </Link>
                                <Link to={routes.inventory} className=" m-auto">
                                    <CardMenu icon="IoFileTrayStackedOutline" iconClassName="text-purple-600" title="Inventory"/>
                                </Link>
                                <Link to={routes.laporan} className=" m-auto">
                                    <CardMenu icon="IoNewspaperOutline" iconClassName="text-cyan-600" title="Laporan"/>
                                </Link>
                            </>}
                        </div>
                    }
                    </div>
                </div>
            </div>
            {
                !loading? null : 
                <LoadingOverlay/>
            }
        </div>
    )
}