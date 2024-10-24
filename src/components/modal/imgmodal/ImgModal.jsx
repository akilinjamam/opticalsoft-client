
import { useDispatch, useSelector } from 'react-redux';
import '../../../global_style/global_style.css';
import { closeModal, customerInfo } from './imgModalSlice';

import ImgContainer from './ImgContainer';
import BarcodeContainer from './BarcodeContainer';
import CustomerContainer from './CustomerContainer';
import StockModal from './StockModal';
import SalesModal from './SalesModal';
import CustomerListModal from './CustimerListModal';
import InvoiceModal from './InvoiceModal';

const ImgModal = () => {

        const stockData = useSelector(state => state.imgModal.stockData);

        const open = useSelector((state) => state.imgModal.open );
        const img = useSelector((state) => state.imgModal.img );
        const type = useSelector((state) => state.imgModal.type );
        const barcode = useSelector((state) => state.imgModal.barcode );
        const dispatch = useDispatch();
        
    return (
        <div>
            <ImgContainer open={open} type={type} dispatch={dispatch} closeModal={closeModal} img={img}/>
            <BarcodeContainer open={open} type={type} barcode={barcode} closeModal={closeModal}  dispatch={dispatch} />
            <CustomerContainer closeModal={closeModal} dispatch={dispatch} open={open} customerInfo={customerInfo} type={type}/>
            <StockModal closeModal={closeModal} dispatch={dispatch} open={open} stockData={stockData} type={type} />
            <SalesModal closeModal={closeModal} dispatch={dispatch} open={open} type={type}/>
            <CustomerListModal closeModal={closeModal} dispatch={dispatch} open={open} type={type}/>
            <InvoiceModal closeModal={closeModal} dispatch={dispatch} open={open} type={type}/>
            
        </div>
    );
};

export default ImgModal;