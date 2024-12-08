import { createSlice } from "@reduxjs/toolkit"

export const imgModalSlice = createSlice({
    name: "imgModal",
    initialState: {
        open: false,
        lock: false,
        type: '',
        img: '',
        barcode: [],
        singleBarcodes: {},
        customerInfo: {},
        customerInfoForSalesInvoice: {},
        stockData: [],
        salesData: [],
        salesList: [],
        salesListForSalesInvoice: [],
        totalSalesValue: 0,
        totalSalesItem: 0,
        employeeData: [],
        supplierData: [],
        payrollData: [],
        vendorData: [],
        expenseListData: [],
        profitExpenseData: [],
        options: {},
        profitCalegoryAnalysisData: {}
    },
    reducers: {
        openModal: (state, action) => {
            state.open = true;
            state.lock = true
            state.type = action.payload;
        },
        closeModal: (state) => {
            state.open = false
            state.lock = false
        },
        openImg: (state, action) => {
            state.img = action.payload
        },
        openBarcode: (state, action) => {
            state.barcode = action.payload
        },
        openSingleBarcode: (state, action) => {
            state.singleBarcodes = action.payload;

        },
        customerInfo: (state, action) => {
            state.customerInfo = action.payload
        },
        customerInfoForSalesInvoice: (state, action) => {
            state.customerInfoForSalesInvoice = action.payload
        },
        addStockData: (state, action) => {
            state.stockData = action.payload
        },
        addSalesData: (state, action) => {
            state.salesData = action.payload.modifiedData;
            state.totalSalesValue = action.payload.totalSalesValue;
            state.totalSalesItem = action.payload.totalSalesItem;
            state.totalPaid = action.payload.totalPaid;
            state.totalDiscount = action.payload.totalDiscount;
        },
        customerList: (state, action) => {
            state.salesData = action.payload;
        },
        addSalesList: (state, action) => {
            state.salesList = action.payload
        },
        addSalesListForSalesInvoice: (state, action) => {
            state.salesListForSalesInvoice = action.payload
        },
        addEmployeeList: (state, action) => {
            state.employeeData = action.payload
        },
        addSupplierList: (state, action) => {
            state.supplierData = action.payload
        },
        addPayrollList: (state, action) => {
            state.payrollData = action.payload
        },
        addVendorList: (state, action) => {
            state.vendorData = action.payload
        },
        addExpenseListData: (state, action) => {
            state.expenseListData = action.payload
        },
        addProfitExpenseData: (state, action) => {
            state.profitExpenseData = action.payload
        },
        addAnalysis: (state, action) => {
            state.profitCalegoryAnalysisData = action.payload.data
        },
    }
})

export const { openModal, closeModal, openImg, openBarcode, customerInfo, addStockData, addSalesData, customerList, addSalesList, addEmployeeList, customerInfoForSalesInvoice, addSalesListForSalesInvoice, addSupplierList, openSingleBarcode, addPayrollList, addVendorList, addExpenseListData, addProfitExpenseData, addAnalysis } = imgModalSlice.actions


export default imgModalSlice.reducer