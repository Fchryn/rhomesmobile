import React, { useState } from 'react';
import { IconButton } from './IconButton';
import { IoSearchOutline} from "react-icons/io5";

import { CLASS_ICON_TEXTFIELD_L, CLASS_TEXTFIELD_B0_PL } from '../constants/Styles';

export const Navbar = ({
  onMenuClick,
  onSearchClick,
  onSearchCancel,
  onSearchStart,
  isSearching,
  searchPlaceholder
}) => {
  const [searchText, setSearchText] = useState("");

  const onSearchChange = (evt) => {
    setSearchText(evt.target.value);
  }

  const onSearchBlur = () => {
    if(searchText){
      onSearchStart(searchText);
    }
  }


  return (
    <div className="fixed top-0 right-0 left-0 bg-green-600 p-2 z-10">
      <div className="flex items-center">
        {
          isSearching ?
          <React.Fragment>
            <IconButton icon="chevron-back-outline"
              onClick={onSearchCancel}
              title="Kembali"
            />
            <div className="relative flex-1 ml-3">
              <input type="search" className={CLASS_TEXTFIELD_B0_PL}
                placeholder={`Cari ${searchPlaceholder}`} 
                onChange={onSearchChange}
                value={searchText}
                onBlur={onSearchBlur}
              />
              <IoSearchOutline className={CLASS_ICON_TEXTFIELD_L}/>
            </div>
          </React.Fragment> :
          <React.Fragment>
            <div className="flex-1 px-3 font-bold text-xl text-white">
              SayurGO
            </div>
            <IconButton icon="search-outline"
              onClick={onSearchClick}
              title="Cari"
              customClass="mr-3"
            />
            <IconButton icon="ellipsis-vertical-outline"
              onClick={onMenuClick}
              title="Menu Lainnya"
            />
          </React.Fragment>
        }
      </div>
    </div>
  );
};
