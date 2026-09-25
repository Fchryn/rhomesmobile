import React,{useContext, useState} from "react";
import { useNavigate } from "react-router";
import { IconButton } from "./IconButton";
import { IoSearchOutline} from "react-icons/io5";
import { AppContext } from "../App";

export const AppBar = ({
    onSearch,
    onSave, 
    bgColor,
    bgHoverColor,
    children, 
    searchPlaceholder,
    backIcon,
    onBackClick,
    disableMenu,
    tabs,
    tabActive,
    tabActiveColor,
    onTabSelect,
    tabSmall
}) => {
    const [searching, setSearching] = useState(false);
    const [searchKey, setSearchKey] = useState("");
    const navigate = useNavigate();
    const context = useContext(AppContext);
    return (
        <div className="fixed top-0 w-full z-10 overflow-hidden">
            <div className={`px-3 ${bgColor} h-12 flex flex-col justify-center shadow`}>
                {
                    searching?
                    <div className="flex items-center">
                        <IconButton icon={"IoChevronBack"} title="back" color="text-white" bgHoverColor={bgHoverColor}
                            onClick={()=>setSearching(false)}
                        />
                        <div className="relative ml-2 flex-grow">
                            <input type="search" className="pl-8 w-full rounded-lg border py-1 focus:outline-none focus:ring"
                                placeholder={searchPlaceholder}
                                onChange={(e)=>setSearchKey(e.target.value)}
                                value={searchKey}
                                onBlur={()=>onSearch(searchKey)}
                                onKeyPress={(e)=>{
                                    if(e.key === "Enter"){
                                        onSearch(searchKey);
                                    }
                                }}
                            />
                                <IoSearchOutline className="absolute w-5 h-5 top-1.5 left-2"/>
                        </div>
                    </div>:
                    <div className="flex items-center my-auto">
                        <IconButton icon={backIcon?backIcon : "IoHomeOutline"} title="back" color="text-white" bgHoverColor={bgHoverColor}
                            onClick={onBackClick ? onBackClick : ()=>navigate("/")}
                        />
                        <div className="flex-grow font-bold text-white ml-3">
                            <div>{children}</div>
                        </div>
                        {
                            !onSearch? null:
                            <IconButton icon={"IoSearchOutline"} title="search" color="text-white" bgHoverColor={bgHoverColor}
                                customClass="mr-2"
                                onClick={()=>setSearching(true)}
                            />
                        }
                        {
                            !onSave? null:
                                <IconButton icon={"IoSaveOutline"} title="save" color="text-white" bgHoverColor={bgHoverColor}
                                    customClass="mr-2"
                                    onClick={onSave}
                                />
                        }
                        {
                            disableMenu? null :
                            <IconButton icon={"IoEllipsisVertical"} title="menu" color="text-white" bgHoverColor={bgHoverColor}
                                onClick={()=>context.setSidebarOn(true)}
                            />
                        }
                    </div>
                }
            </div>
            {
                !tabs || tabs.length < 1? null:
                <div className={`${bgColor} flex snap-x snap-mandatory overflow-scroll`}>
                    {
                        tabs.map((t, index)=>(
                            <div key={index} className="snap-start px-5" onClick={()=>onTabSelect(index)}>
                                <div className="relative cursor-pointer overflow-hidden h-full">
                                    <div className={`${tabSmall?"text-xs":""} py-2 text-white text-center w-fit h-full flex flex-col justify-center`}>
                                        {t}
                                    </div>
                                    <div className={`absolute -bottom-1 inset-x-0 h-2 rounded-t ${index === tabActive ? tabActiveColor:""}`}/>
                                </div>
                                
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}