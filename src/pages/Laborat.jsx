import React from "react";
import { AppBar } from "../components/AppBar.jsx";


export const Laborat = ()=> {
    const handleSearch = (searchKey) =>{
    }
    return (
        <div className="h-screen bg-gray-50 overflow-auto">
            <AppBar onSearch={handleSearch} bgColor="bg-yellow-500" bgHoverColor="hover:bg-yellow-500"  searchPlaceholder="Cari Laborat">
                Laborat
            </AppBar>
        </div>
    )
}