import todaySales from './TodaySales.module.scss';
import { useDispatch } from "react-redux";
import { addSalesData, openModal } from "../../../modal/imgmodal/imgModalSlice";
import { useState } from "react";
import Pagination from "../../pagination/Pagination";
import { useEffect } from "react";
import { calculateTotalPrice } from "../../../calculation/calculateSum";

import useGetLastSalesAndAccountsData from "../../../../data/accountsData/useGetLastSalesAccountsData";
import TodaySalesTable from "./TodaySalesTable";

const TodaySales = () => {

    const dispatch = useDispatch();
   
    const [date, setDate] = useState('');
    

    const {lastSaleAndAccountsData, isLoading, refetch} = useGetLastSalesAndAccountsData(date);
    const [paginatedDataContainer, setPaginatedDataContainer] = useState([]);
    const [modifiedProductDataWithIndexId,setModifiedProductDataWithIndexId] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [paginatedIndex,setPaginatedIndex] = useState()
    

    const total = lastSaleAndAccountsData?.result?.allSalesDetail?.map(sale => calculateTotalPrice(sale?.products?.map(item => (item?.quantity * item?.actualSalesPrice))))
    const totalPaid = calculateTotalPrice(lastSaleAndAccountsData?.result?.allSalesDetail?.map(sale => Number(sale?.advance)))
    const totalDiscount = calculateTotalPrice(lastSaleAndAccountsData?.result?.allSalesDetail?.map(sale => Number(sale?.discount)))

    const totalTodayPaid = calculateTotalPrice(lastSaleAndAccountsData?.result?.allSalesDetail?.map(sale => Number(sale?.todayPaid)))
  
    const totalSalesValue = calculateTotalPrice(total)
    const totalSalesItem = lastSaleAndAccountsData?.result?.allSalesDetail?.length;
    
    
    useEffect(() => {
        const modified = lastSaleAndAccountsData?.result?.allSalesDetail?.slice()?.reverse()?.map((item, index) => ({...item, indexId: index+1}))
        setModifiedProductDataWithIndexId(modified)
    }, [lastSaleAndAccountsData?.result])

    useEffect(() => {
        refetch()
    },[refetch, date])

    return (
        <div className={todaySales.main}>
            <div className={`${todaySales.title} flex_left`}>
                <i onClick={() => {
                    dispatch(openModal('sales'))
                    dispatch(addSalesData({modifiedData:modifiedProductDataWithIndexId, totalSalesValue, totalSalesItem}))
                }} title="print" className="uil uil-print"></i>
                <span>Total : {lastSaleAndAccountsData?.result?.allSalesDetail?.length}</span>
                
                
                <input value={date}  type="date" name="" id=""  onChange={(e) => setDate(e.target.value)}/>
                <i onClick={() => {
                    setDate('')
                    setModifiedProductDataWithIndexId([])
                    }} className="uil uil-times"></i>
            </div>
            <div style={{overflowX:'hidden', overflowY:'scroll', scrollbarWidth:'none', minHeight:'auto', maxHeight:'70vh'}}>
                <TodaySalesTable paginatedDataContainer={paginatedDataContainer} isLoading={isLoading} totalSalesValue={totalSalesValue} totalSalesItem={ totalSalesItem} totalPaid={totalPaid} totalDiscount={totalDiscount} totalTodayPaid={totalTodayPaid} />
            </div>
            {
                ((modifiedProductDataWithIndexId) )
                &&
                <Pagination showData={modifiedProductDataWithIndexId} setPaginatedDataContainer={setPaginatedDataContainer} setPaginatedIndex={setPaginatedIndex} limit={20}/>
            }
        </div>
    );
};

export default TodaySales;