//DATA DISPLAY COUNT
export const DEFAULT_LIMIT = 20;

//TOAST
export const TIMEOUT_TOAST_APPEAR = 300;
export const TIMEOUT_TOAST_DISAPPEAR = 2500;
export const TIMEOUT_TOAST_REMOVE = 2800;

//IMAGES
export const DEFAULT_IMAGE_WIDTH = 900;

export const DEFAULT_ITEM_COUNT = 25;

export const months = [
    {label:"Januari", value:'01'},
    {label:"Februari", value:'02'},
    {label:"Maret", value:'03'},
    {label:"April", value:'04'},
    {label:"Mei", value:'05'},
    {label:"Juni", value:'06'},
    {label:"Juli", value:'07'},
    {label:"Agustus", value:'08'},
    {label:"September", value:'09'},
    {label:"Oktober", value:'10'},
    {label:"November", value:'11'},
    {label:"Desember", value:'12'},
];

export const reports = [
    {value:"INVENTORY", label: "Pergerakan Inventori"},
    {value:"NERACA", label:"Pemasukan & Pengeluaran"}    
];

export const itemTransactions = [
    {value:"SELL", label:"Penjualan"},
    {value:"RECEIVE", label:"Penerimaan"},
    {value:"RETURN", label:"Pengembalian"},
    {value:"MUTATE", label:"Mutasi"},
];


export const itemHolder = [
    {value:"SUPPLIER", label:"Supplier"},
    {value:"GUDANG", label:"Gudang"},
    {value:"APOTIK", label:"Apotik"},
    {value:"FARMASI", label:"Farmasi"},
    {value:"PASIEN", label:"Pasien"},
];

export const jenisBiaya = [
    {value: "D", label: "Dokter", icon: "IoPersonOutline"},
    {value: "P", label: "Perawat", icon: "IoPeopleOutline"},
    {value: "T", label: "Tindakan", icon: "IoBandageOutline"},
    {value: "O", label: "Obat", icon: "IoFlaskOutline"},
    {value: "I", label: "Injeksi", icon: "IoEyedropOutline"},
    {value: "L", label: "Laboraturium", icon: "IoPulseOutline"},
    {value: "R", label: "Radiologi", icon: "IoRadioOutline"},
    {value: "K", label: "Kamar", icon: "IoBedOutline"},
];

export const jenisAntrian = [
    {value:"2", label: "Klinik Bedah", icon: "IoCutOutline"},
    {value:"3", label: "Klinik P. Dalam", icon: "IoFitnessOutline"},
    {value:"4", label: "Klinik Anak", icon: "IoManOutline"},
    {value:"5", label: "Klinik Umum", icon: "IoMedkitOutline"},
    {value:"6", label: "Klinik Gigi", icon: "IoHappyOutline"},
    {value:"7", label: "Klinik TB", icon: "IoHeartHalfOutline"},
    {value:"8", label: "Klinik Kandungan", icon: "IoWomanOutline"}
]

export const yearList = (startYear) => {
    let currentYear = new Date().getFullYear(), years = [];
    startYear = startYear || 1980;  
    while ( startYear <= currentYear ) {
        years.push({label: startYear, value:startYear});
        startYear++;
    }   
    return years.reverse();
}