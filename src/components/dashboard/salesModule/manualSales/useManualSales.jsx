/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import useSaleData from "../../../../data/saleData/useSaleData";
import { invoiceCalculation } from "../../../../invoiceCalculation/invoiceCalculation";
import moment from "moment";
import { addSalesList } from "../../../modal/imgmodal/imgModalSlice";
import { fetchPostSaleData } from "../../../../data/fetchedData/fetchSaleData";
import { useMutation } from "@tanstack/react-query";

const useManualSales = () => {

    const {saleData} = useSaleData()

    const dispatch = useDispatch();
    
    const invoiceNumber = invoiceCalculation(saleData)

    const invoice = `${moment().format("YYYYMMDD")}${invoiceNumber}`

    const customerInfo = useSelector(state => state.imgModal.customerInfo);

    console.log(invoiceNumber);
    
    let [showData, setShowData] = useState([]);
    const [paginatedDataContainer, setPaginatedDataContainer] = useState([]);
    const [paginatedIndex, setPaginatedIndex] = useState();
    const [edit, setEdit] = useState();

    const [uploading, setUploading] = useState(false);

    
    const [category, setCategory] = useState('')
    
    const initialEmployeeData = {
        productName: '',
        actualSalesPrice: '',
        purchasePrice: '',
        quantity: '',
        power: '',
        sph: '',
        cyl: '',
        axis: '',
       
    }
    const [employeeData, setEmployeeData] = useState(initialEmployeeData);
    const [customerInfoData, setCustomerInfoData] = useState({});

    useEffect(() => {
        dispatch(addSalesList(showData))
    },[showData, dispatch])


   useEffect(() => {
    const customerData = {
        customerName:customerInfo?.customerName === undefined ? 'unknown' : customerInfo?.customerName,
        phoneNumber:customerInfo?.phoneNumber === undefined ? 'blank' : customerInfo?.phoneNumber,
        address:customerInfo?.address === undefined ? 'blank' : customerInfo?.address,
        referredBy:customerInfo?.referredBy === undefined ? 'blank' : customerInfo?.referredBy,
        advance:customerInfo?.advance === undefined ? '0' : customerInfo?.advance,
        todayPaid:customerInfo?.todayPaid === undefined ? '0' : customerInfo?.todayPaid,
        paymentHistory:customerInfo?.paymentHistory === undefined ? '+0' : customerInfo?.paymentHistory,
        paymentDate:customerInfo?.paymentDate,
        
        discount:customerInfo?.discount === undefined ? '0' : customerInfo?.discount,
        leftAxis:customerInfo?.leftAxis === undefined ? 'blank' : customerInfo?.leftAxis,
        leftCyl:customerInfo?.leftCyl === undefined ? 'blank' : customerInfo?.leftCyl,
        leftSph:customerInfo?.leftSph === undefined ? 'blank' : customerInfo?.leftSph,
        leftNear:customerInfo?.lefNear === undefined ? 'blank' : customerInfo?.leftNear,
        rightAxis:customerInfo?.rightAxis === undefined ? 'blank' : customerInfo?.rightAxis,
        rightCyl:customerInfo?.rightCyl === undefined ? 'blank' : customerInfo?.rightCyl,
        rightSph:customerInfo?.rightSph === undefined ? 'blank' : customerInfo?.rightSph,
        rightNear:customerInfo?.rightNear === undefined ? 'blank' : customerInfo?.rightNear,        
        deliveryDate:customerInfo?.deliveryDate === undefined ? 'blank' : customerInfo?.deliveryDate,      
        delivered:customerInfo?.delivered === undefined ? 'blank' : customerInfo?.delivered,      
        comment:customerInfo?.comment === undefined ? 'blank' : customerInfo?.comment,      
        recorderName:customerInfo?.recorderName === undefined ? 'blank' : customerInfo?.recorderName,      
        paymentMethod:customerInfo?.paymentMethod === undefined ? 'blank' : customerInfo?.paymentMethod,      
        invoiceBarcode:invoice === undefined ? 'blank' : invoice,
        products: showData,
        lense: customerInfo?.lense === undefined ? 'blank' : customerInfo?.lense,
        glassType: customerInfo?.glassType === undefined ? 'blank' : customerInfo?.glassType,
    }

    setCustomerInfoData(customerData)
    
   },[customerInfo])

    
    const findEmployee = showData.find((f, i) => (i + 1) === edit);
    useEffect(() => {
        if (findEmployee) {
            setEmployeeData(findEmployee)
        }
    }, [setEmployeeData, findEmployee])


    const editProduct = (e) => {

        let modifiedData = { ...employeeData }
        console.log(modifiedData)
        e.preventDefault();
        setEdit(false)
        setShowData(showData.map((product, index) => {
            return (index + 1) === edit ? modifiedData : product
        }))
        setEmployeeData(initialEmployeeData)
        
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!employeeData?.productName){
            toast.error('Please Provide Product Name')
            return
        }
        if(!employeeData?.actualSalesPrice){
            toast.error('Please Provide Sales Price')
            return
        }
        if(!employeeData?.purchasePrice){
            toast.error('Please Provide parchase Price')
            return
        }
        if(!employeeData?.quantity){
            toast.error('Please Provide Quantity')
            return
        }
        if(!category){
            toast.error('pleaes provide Category')
            return 
        }

        
        const allData = {
            ...employeeData,
            power: employeeData?.power ? employeeData?.power : 'blank',
            sph: employeeData?.sph ? employeeData?.sph : 'blank',
            cyl: employeeData?.cyl ? employeeData?.cyl : 'blank',
            axis: employeeData?.axis ? employeeData?.axis : 'blank',
            category,
        }
        setShowData((prevData) => [...prevData, allData]);
        
    }

    const {mutate, isPending, isSuccess, isError} = useMutation({
        mutationFn: async (data) => {
            return await fetchPostSaleData(data)
        },
        onSuccess: (data) => {  

            console.log(data)
            if(data?.data?.success){
                toast.success('product added to sale list')
                setShowData([])
            }
        },
        onError: (data) => {
            toast.error('something went wrong')
            console.log('failed to add to sale list: ', data)
        }
    })

    const handlePost = async () => {
        
        if (showData.length >= 1) {

            if(customerInfoData?.deliveryDate === 'blank' || customerInfoData?.delivered === 'blank' || customerInfoData?.recorderName === 'blank'  || customerInfoData?.paymentMethod === 'blank'){
                toast.error('please fill up all marked input fields from Customer Info')
                return
            }
            
            console.log(customerInfoData);
            mutate(customerInfoData)

        }else{
            toast.error('please add to sales list first')
        }
    }

    useEffect(() => {
        if(isSuccess){
            setEmployeeData(initialEmployeeData)
        }
    
        if(isError){
            toast.error(`something went wrong`)
        }
    },[isSuccess,isError])

    return { employeeData, setEmployeeData, showData, setShowData, paginatedDataContainer, setPaginatedDataContainer, paginatedIndex, setPaginatedIndex, edit, setEdit, editProduct,  handleSubmit, initialEmployeeData, findEmployee, uploading, setUploading, handlePost , category, setCategory, isPending }
};


export default useManualSales;