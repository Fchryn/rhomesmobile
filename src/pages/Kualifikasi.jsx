import React from "react";
import { AppBar } from "../components/AppBar.jsx";


export const Kualifikasi = ()=> {
    const handleSearch = (searchKey) =>{
    }
    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar onSearch={handleSearch} bgColor="bg-blue-500" bgHoverColor="bg-blue-600" searchPlaceholder="Cari Kualifikasi">
                Kualifikasi
            </AppBar>
        </div>
    )
}