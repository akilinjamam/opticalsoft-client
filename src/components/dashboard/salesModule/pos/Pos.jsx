// import { useEffect } from 'react';
import { useEffect, useState } from 'react';
import pos from './Pos.module.scss';
import usePos from './usePos';
import { toast } from 'react-toastify';
import PosListTable from './posListTable/PosListTable';
import { useDispatch, useSelector } from 'react-redux';
import { addSalesList, openModal } from '../../../modal/imgmodal/imgModalSlice';
import { useMutation } from '@tanstack/react-query';
import { fetchPostSaleData } from '../../../../data/fetchedData/fetchSaleData';
import moment from 'moment';
import useSaleData from '../../../../data/saleData/useSaleData';
import { invoiceCalculation } from '../../../../invoiceCalculation/invoiceCalculation';
const Pos = () => {
    
    const {saleData} = useSaleData()
    
    const invoiceNumber = invoiceCalculation(saleData)

    const invoice = `${moment().format("YYYYMMDD")}${invoiceNumber}`
    const {mutate, isPending} = useMutation({
        mutationFn: async (data) => {
            return await fetchPostSaleData(data)
        },
        onSuccess: (data) => {  

            console.log(data)
            if(data?.data?.success){
                toast.success('product added to sale list')
                setListOfSalesItem([])
            }
        },
        onError: (data) => {
            toast.error('something went wrong')
            console.log('failed to add to sale list: ', data)
        }
    })



    const customerInfo = useSelector(state => state.imgModal.customerInfo)
    
    const lock = useSelector(state => state.imgModal.lock)
    const dispatch = useDispatch();
    const {allProducts, priceArray, setPriceArray, quantityArray, setQuantityArray} = usePos()

    
   
    const [barcodeId, setBarcodeId] = useState();
    const [isScanned, setIsScanned] = useState(false)
    const [price, setPrice] = useState(false)
    const [quantity, setQuantity] = useState(false)
    const finProduct = allProducts?.find(f => f?.barcode === barcodeId)

    // 1718116697332, 1718124380396, 1718116693575, 0380173306547
    // const finProduct = allProducts?.find(f => f?.barcode === '1718116693575')

    if(priceArray?.length > 0) {
        if(quantityArray?.length === 0) {
           if(!quantity){
                setQuantityArray([1])
           }
        }
    }
  
   
  useEffect(() => {
      let barcode = '';
      let interval;
      
    document.addEventListener('keydown', function(e){
        
        if(interval){
         clearInterval(interval)
     }
     if(e.code === 'Enter'){
         if(barcode){
             handleBarcode(barcode)
             barcode = '';
             return
         }    
     }
     if(e.key != 'Shift'){
        if(isScanned){
            barcode += e.key
            interval = setInterval(() => barcode = '', 20)
        }
     }
    })
 
     const handleBarcode = (scanned_barcode) => {
       
         setBarcodeId(scanned_barcode)
     }
  },[isScanned])
  

  const calculationValue = [1,2,3,4,5,6,7,8,9,'Delete',0,'Add Item']
  useEffect(() => {
    const handleKeyPress = (e) => {
       if(!lock){
        if(quantity){
            if(quantityArray.length === 13){
                setQuantityArray([])
            }
            let key = parseInt(e.key);
            const findKey = calculationValue.find(value => value === key);
    
            if (findKey !== undefined) {
              
                setQuantityArray(prevArray => [...prevArray, findKey]);
            }
    
            if(e.key === 'Delete'){
                let lastValue = [...quantityArray];
                lastValue.pop()
                setQuantityArray(lastValue)
            }
            if(e.key === 'a'){
                setQuantityArray([])
            }
           }
           if(price){
            if(priceArray.length === 13){
                setPriceArray([])
            }
            let key = parseInt(e.key);
            const findKey = calculationValue.find(value => value === key);
    
            if (findKey !== undefined) {
               
                setPriceArray(prevArray => [...prevArray, findKey]);
            }
    
            if(e.key === 'Delete'){
                let lastValue = [...priceArray];
                lastValue.pop()
                setPriceArray(lastValue)
            }
            if(e.key === 'a'){
                setPriceArray([])
            }
        }
       }
       
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
        document.removeEventListener('keydown', handleKeyPress);
    };
});

    useEffect(() => {
        const handleQuantityAndPrice = (e) => {
            if(!lock){
                if(e.key === 'Enter'){
                    setQuantity(false)
                    setPrice(false)
                    setIsScanned(true)
                }
                if(e.key === 'q'){
                    setQuantity(true)
                    setPrice(false)
                    setIsScanned(false)
                }
                if(e.key === 'p'){
                    setPrice(true)
                    setQuantity(false)
                    setIsScanned(false)
                }
                if(e.key === 's'){
                    setIsScanned(true)
                    setPrice(false)
                    setQuantity(false)
                    setPriceArray([])
                    setQuantityArray([])
                }
            }
        }

        document.addEventListener('keydown', handleQuantityAndPrice)

        return () => {
            document.removeEventListener('keydown', handleQuantityAndPrice)
        }

    },[setQuantityArray,setPriceArray, lock,])
    
    const salesItem = {
        id: finProduct?._id,
        productName: finProduct?.productName,
        actualSalesPrice: Number(priceArray?.join('')),
        purchasePrice: finProduct?.purchasePrice,
        category: finProduct?.category,
        quantity: Number(quantityArray?.join('')),
        remainingQuantity: Number(finProduct?.quantity) - Number(quantityArray?.join('')),
        material: finProduct?.material,
        frameType: finProduct?.frameType,
        size: finProduct?.size,
        shape: finProduct?.shape,
        recorderName:finProduct?.recorderName !== undefined ? finProduct?.recorderName : 'not-found',
        recorderEmail:finProduct?.recorderEmai !== undefined ? finProduct?.recorderEmail : 'notfound@gmail.com',
        barcode: finProduct?.barcode,
        inStock: Number(quantityArray.join('')) === Number(finProduct?.quantity) ? false : true
    }

    const [listOfSalesItem, setListOfSalesItem] = useState([])
   

    const isExistsId = listOfSalesItem?.find(f => f?.id === finProduct?._id);

    const handleNumber = (value) => {
        if(price){
            if((typeof value) === 'number' ){
                setPriceArray(prev => [...prev,value])
            } 
        }
        if(quantity){
            if((typeof value) === 'number' ){
                setQuantityArray(prev => [...prev,value])
            } 
        }
        if(value === 'Delete' && price){
            let lastValue = [...priceArray];
            lastValue.pop()
            setPriceArray(lastValue)
        }
        if(value === 'Delete' && quantity){
            let lastValue = [...quantityArray];
            lastValue.pop()
            setQuantityArray(lastValue)
        }
    
        if(value === 'Add Item'){
            if(barcodeId){
                if(!isExistsId?.id){
                     if(Number(priceArray?.join('')) > 0 && Number(quantityArray?.join('')) > 0 ){
                         if(Number(quantityArray?.join('')) <= Number(finProduct?.quantity)){
                             setListOfSalesItem((prevItem => [...prevItem, salesItem ]))
                             
                         }else{
                             toast.error('given quantity is out of stock')
                         }
                     }else{
                         toast.error('please add price and quantity')
                     }
                }else{
                 toast.error('this item already listed to sales item')
                }
             }else{
                 toast.error('please scan first')
             }
        }
    }

    useEffect(() => {
     document.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            setPriceArray([])
            setQuantityArray([])
        }
     })   
    },[setQuantityArray, setPriceArray])


    useEffect(() => {
        const salesItemForKeyDown = {
            id: finProduct?._id,
            productName: finProduct?.productName,
            actualSalesPrice: Number(priceArray?.join('')),
            purchasePrice: finProduct?.purchasePrice,
            category: finProduct?.category,
            quantity: Number(quantityArray?.join('')),
            remainingQuantity: Number(finProduct?.quantity) - Number(quantityArray?.join('')),
            material: finProduct?.material,
            frameType: finProduct?.frameType,
            size: finProduct?.size,
            shape: finProduct?.shape,
            barcode: finProduct?.barcode,
            inStock: Number(quantityArray.join('')) === Number(finProduct?.quantity) ? false : true
        }

        console.log(quantityArray);

        const handleKeyDowns = (e) => {

            if(!lock){
                if(e.key === 'l' || e.key === 'L'){
                    if(barcodeId){
                       if(!isExistsId?.id){
                            if(Number(priceArray?.join('')) > 0 && Number(quantityArray?.join('')) > 0 ){
                                if(Number(quantityArray?.join('')) <= Number(finProduct?.quantity)){
                                    setListOfSalesItem((prevItem => [...prevItem, salesItemForKeyDown ]))
                                    
                                }else{
                                    toast.error('given quantity is out of stock')
                                }
                            }else{
                                toast.error('please add price and quantity')
                            }
                       }else{
                        toast.error('this item already listed to sales item')
                       }
                    }else{
                        toast.error('please scan first')
                    }
                }
            }
        };
    
        // Add event listener
        document.addEventListener('keydown', handleKeyDowns);
    
        // Cleanup event listener when component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDowns);
        };
    }, [finProduct, priceArray, quantityArray, barcodeId, isExistsId, lock,listOfSalesItem, dispatch]);  // Add relevant dependencies here

    const handleDeleteSale = (deletedId) => {
        const restItems = listOfSalesItem?.filter(f => f?.id !== deletedId);
        setListOfSalesItem(restItems)
    }

    const handleSale = () => {
        if(customerInfo?.delivered && customerInfo?.deliveryDate && customerInfo?.recorderName && customerInfo?.paymentMethod){

            const saleData = {
                customerName:customerInfo?.customerName === undefined ? 'unknown' : customerInfo?.customerName,
                phoneNumber:customerInfo?.phoneNumber === undefined ? 'blank' : customerInfo?.phoneNumber,
                address:customerInfo?.address === undefined ? 'blank' : customerInfo?.address,
                products: listOfSalesItem,
                referredBy:customerInfo?.referredBy === undefined ? 'blank' : customerInfo?.referredBy,
                advance:customerInfo?.advance === undefined ? '0' : customerInfo?.advance,
                todayPaid:customerInfo?.todayPaid === undefined ? '0' : customerInfo?.todayPaid,
                paymentHistory:customerInfo?.paymentHistory === undefined ? '+0' : customerInfo?.paymentHistory,
                paymentDate:customerInfo?.paymentDate,
                lense: customerInfo?.lense === undefined ? 'blank' : customerInfo?.lense,
                glassType: customerInfo?.glassType === undefined ? 'blank' : customerInfo?.glassType,
                
                
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
                invoiceBarcode:invoice === undefined ? 'blank' : invoice      
            }
            if(listOfSalesItem?.length > 0){
                mutate(saleData)
                console.log(saleData)
    
            }else{
                toast.error('please add products to sale')
            }

        }else{
            toast.error('please select add customer info')
        }
        
    }

    useEffect(() => {
        const handleSalePress = (e) => {
            if(!lock){
                if(e.key === 'i' || e.key === 'I'){
                    if(customerInfo?.delivered && customerInfo?.deliveryDate && customerInfo?.recorderName && customerInfo?.paymentMethod){
                        const saleData = {
                            customerName:customerInfo?.customerName === undefined ? 'unknown' : customerInfo?.customerName,
                            phoneNumber:customerInfo?.phoneNumber === undefined ? 'blank' : customerInfo?.phoneNumber,
                            address:customerInfo?.address === undefined ? 'blank' : customerInfo?.address,
                            products: listOfSalesItem,
                            referredBy:customerInfo?.referredBy === undefined ? 'blank' : customerInfo?.referredBy,
                            advance:customerInfo?.advance === undefined ? '0' : customerInfo?.advance,
                            todayPaid:customerInfo?.todayPaid === undefined ? '0' : customerInfo?.todayPaid,
                            paymentHistory:customerInfo?.paymentHistory === undefined ? '+0' : customerInfo?.paymentHistory,
                            paymentDate:customerInfo?.paymentDate,
                            lense: customerInfo?.lense === undefined ? 'blank' : customerInfo?.lense,
                            glassType: customerInfo?.glassType === undefined ? 'blank' : customerInfo?.glassType,
                           
                           
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
                            invoiceBarcode:invoice === undefined ? 'blank' : invoice
                        }

                        if(listOfSalesItem?.length > 0){
                            console.log(saleData)
                            mutate(saleData)
                        }else{
                            toast.error('please add products to sale')
                        }
                    }else{
                        toast.error('please select add customer info')
                    }
                    
                }
            }
            
        }

        document.addEventListener('keydown', handleSalePress);

        // Cleanup event listener when component unmounts
        return () => {
            document.removeEventListener('keydown', handleSalePress);
        };
    },[customerInfo,listOfSalesItem, lock, mutate, invoice])


    useEffect(() => {
        dispatch(addSalesList(listOfSalesItem))
    },[listOfSalesItem, dispatch])


    return (
       <div onDoubleClick={() => {
        setQuantity(false)
        setPrice(false)
        setIsScanned(false)
       }} className={`${pos.main}`}>
         <div  className={`flex_around`}>
            <div className={`${pos.inputAreaOne} flex_center`}>
                <div className={`${pos.container} flex_between`}>
                    <div className={`${pos.product_info} flex_between`}>
                        <div>
                            <p>Product Name: </p>
                            <p>Quantity: </p>
                            <p>Purchase price: </p>
                            <p>Category: </p>
                            <p>Barcode NO: </p>
                            <p>Material: </p>
                            <p>Frame: </p>
                            <p>Size: </p>
                            <p>Shape: </p>
                        </div>
                        <div>
                            <p>{finProduct?.productName}</p>
                            <p>{finProduct?.quantity}</p>
                            <p>{finProduct?.purchasePrice}</p>
                            <p>{finProduct?.category}</p>
                            <p>{finProduct?.barcode}</p>
                            <p>{finProduct?.material }</p>
                            <p>{finProduct?.frameType}</p>
                            <p>{finProduct?.size}</p>
                            <p>{finProduct?.shape}</p>
                
                        </div>
                    </div>
                   { (price || quantity)
                        &&
                        <div  className={`${pos.showQuantityAndPrice}`}>
                            <div className={`${pos.showQuantityAndPriceContainer}`}>
                                    <div>
                                            <p>Sales Price: </p>
                                            <p>Quantity: </p>
                                    </div>
                                    <div>
                                            <p>{priceArray?.length === 0 ? 0 : priceArray.join('')}</p>
                                            <p>{quantityArray?.length === 0 ? 0 : quantityArray.join('')}</p>
                                    </div>
                            </div>
                            <hr />
                            <div className={`${pos.totalPriceQuantityValue} flex_between`}>
                                <p>Total :</p>
                                <p>{(priceArray?.length !== 0 && quantityArray?.length !== 0) ? (parseInt(quantityArray.join('')) * parseInt(priceArray.join(''))) : 0}</p> 
                            </div>
                        </div>
                   }
                    <div className={`${pos.calculationAndSubmit}`}>
                       <div className={`${pos.productCalculation} flex_between`}>
                            <div className={`${pos.priceQuantityCalculation}`}>
                                <div onClick={(e) => {
                                    e.stopPropagation()
                                    setQuantity(true)
                                    setPrice(false)
                                    setIsScanned(false)
                                }} style={{border: `${quantity ? '2px solid black' : 'none'}`, cursor:'pointer'}} className={`${pos.quantityBtn} flex_center`}>
                                    Quantity
                                </div>
                                <div onClick={(e) => {
                                    e.stopPropagation()
                                    setPrice(true)
                                    setQuantity(false)
                                    setIsScanned(false)
                                }} style={{border: `${price ? '2px solid black' : 'none'}`, cursor:'pointer'}} className={`${pos.priceBtn} flex_center`}>
                                    Price
                                </div>
                                <div onClick={(e) => {
                                    e.stopPropagation()
                                    setIsScanned(true)
                                    setPrice(false)
                                    setQuantity(false)
                                    setPriceArray([])
                                    setQuantityArray([])
                                }} style={{border: `${isScanned ? '2px solid black' : 'none'}`, cursor:'pointer'}} className={`${pos.scanBtn} flex_center`}>
                                    Scan
                                </div>
                            </div>
                            <div style={{backgroundColor: `${quantity ? 'orange': 'green'}`}} className={`${pos.numberCalculation}`}>
                                {
                                    calculationValue.map((item, index) => {
                                        return (
                                        <div onClick={() => handleNumber(item)} key={index+1}><p>{item}</p></div>
                                    )
                                    })
                                }
                            </div>
                       </div>
                       <div className={`${pos.submitSale} flex_between`}>
                            <button onClick={() => {
                                dispatch(openModal('customer'))
                            }} className={`${pos.submitSaleAddCustomer}`}>Add Customer Info</button>
                            <button onClick={() => {
                                dispatch(openModal('invoice'))
                            }} className={`${pos.submitInvoice}`}>Print Invoice</button>
                       </div>
                       <div className={`${pos.submitSale} flex_center`}>
    
                            <button onClick={handleSale} className={`${pos.submitSaleAddSale}`}>{isPending ? 'Loading...': 'Add to Sale'}</button>
                       </div>
                    </div>
                    
                </div>
            </div>
            <div className={`${pos.inputAreaTwo} flex_center`}>
                <div id='last-barcode' className={`${pos.container} flex_center`}>
                    {
                        finProduct?.img ? <img width={200} height={160} src={finProduct?.img} alt="" /> : barcodeId ? <p>Image not added !</p> : ''
                    }
                </div>
            </div>
        </div>
        <PosListTable listOfSalesItem={listOfSalesItem} handleDeleteSale={handleDeleteSale}/>
       </div>
    );
};

export default Pos;