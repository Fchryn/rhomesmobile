import React, { useEffect, useState } from 'react';
import { IoChevronForward, IoChevronBack} from "react-icons/io5";

const MAX_PAGES_IN_LIST = 6;

export const Pagination = ({
    current, total, onNext, onPrev, onGoTo
}) => {
    const [pages, setPages] = useState([1]);

    useEffect(()=>{
        setPages(getPageList(current, total))
    },[current, total])

    const getPageList = (currentPage, totalPage) => {
        let pageList = [];
        if(totalPage <= MAX_PAGES_IN_LIST){
            //1,2,3,4
            for(let i = 1 ; i<=totalPage ; i++){
                pageList = [...pageList, i];
            }
            return pageList;
        }
        pageList = new Array(MAX_PAGES_IN_LIST);
        pageList[0] = 1;
        pageList[MAX_PAGES_IN_LIST-1] = totalPage;
        if(currentPage < MAX_PAGES_IN_LIST-2){
            pageList[MAX_PAGES_IN_LIST-2] = '...';
            for(let i = 1; i < MAX_PAGES_IN_LIST-2 ; i++){
                pageList[i] = i+1;
            }
        }else if(totalPage - currentPage < MAX_PAGES_IN_LIST - 3){
            pageList[1] = '...';
            let counter = totalPage - 1;
            for(let i = MAX_PAGES_IN_LIST-2 ; i>1 ; i--){
                pageList[i] = counter--;
            }
        }else{
            pageList[1] = '...';
            pageList[MAX_PAGES_IN_LIST-2] = '...';
            let counter = currentPage - 1;
            for(let i = 2; i< MAX_PAGES_IN_LIST-2 ; i++){
                pageList[i] = counter++;
            }
        }
        return pageList;
    }

    const handleClickPage = (id, page) => {
        if(page !== '...'){
            onGoTo(page);
            return;
        }
        if(id === 1){
            onGoTo(pages[id+1]-1);
        }else{
            onGoTo(pages[id-1]+1);
        }
    }

    const handleClickPrev = () => {
        if(current === 1){
            return;
        }
        onPrev();
    }

    const handleClickNext = () => {
        if(current === total){
            return;
        }
        onNext();
    }
    if(total < 2){
        return <div/>
    }
    return(
        <nav className='m-4' >
            <ul className="flex justify-center items-center space-x-3">
                <li>
                    <div onClick = {handleClickPrev} className="cursor-pointer w-8 h-8 rounded-full hover:bg-gray-200 flex flex-col justify-center">
                        <IoChevronBack className="m-auto h-4 text-gray-600"/>
                    </div>
                </li>
                {
                    pages.map((page, id) =>(
                        <li className={`${ page === current ? ' text-gray-700 font-bold':'text-gray-400'}`} key={id}>
                            <div className="hover:font-bold text-gray-500 cursor-pointer"
                                onClick={() => handleClickPage(id, page)}
                            >
                                {page}
                            </div>
                        </li>
                    ))
                }
                <li>
                    <div onClick = {handleClickNext} className="cursor-pointer w-8 h-8 rounded-full hover:bg-gray-200 flex flex-col justify-center">
                        <IoChevronForward className="m-auto h-4 text-gray-600"/>
                    </div>
                </li>
            </ul>
        </nav>
    )
}