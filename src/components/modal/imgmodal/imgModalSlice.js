import { createSlice } from "@reduxjs/toolkit"

export const imgModalSlice = createSlice({
    name: "imgModal",
    initialState: {
        open: false,
        lock: false,
        type: '',
        img: '',
        barcode: [],
        customerInfo: {},
        stockData: [],
        salesData: [],
        totalSalesValue: 0,
        totalSalesItem: 0
    },
    reducers: {
        openModal: (state, action) => {
            state.open = true;
            state.lock = true
            console.log(action.payload)
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
        customerInfo: (state, action) => {
            state.customerInfo = action.payload
        },
        addStockData: (state, action) => {
            state.stockData = action.payload
        },
        addSalesData: (state, action) => {
            state.salesData = action.payload.modifiedData;
            state.totalSalesValue = action.payload.totalSalesValue;
            state.totalSalesItem = action.payload.totalSalesItem;
        },
        customerList: (state, action) => {
            state.salesData = action.payload;
        },
    }
})

export const { openModal, closeModal, openImg, openBarcode, customerInfo, addStockData, addSalesData, customerList } = imgModalSlice.actions


export default imgModalSlice.reducer