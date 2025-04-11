import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../api/agent";
import { Warehouse } from "../models/Warehouse";

interface WarehouseState {
    warehouses: Warehouse[];
    warehouse: Warehouse | null,
    status: boolean;
}

const initialState : WarehouseState = {
    warehouses : [],
    warehouse: null,
    status: false
}

export const fetchWarehousesAsync = createAsyncThunk<Warehouse[]>(
    'warehouse/fetchWarehousesAsync'
    , async(_, thunkAPI) => {
        try {
            const response = await agent.Warehouses.list();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const fetchWarehouseDetailAsync = createAsyncThunk<Warehouse, string>(
    'warehouse/fetchWarehouseDetailAsync'
    , async(warehouseId, thunkAPI) => {
        try {
            const response = await agent.Warehouses.detail(warehouseId);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const warehouseslice = createSlice({
    name: 'warehouse',
    initialState,
    reducers: {
        setWarehousesCreate : (state, action) => {
            state.warehouses = [...state.warehouses, action.payload].sort((a, b) => a.name - b.name);
        },

        setWarehousesUpdate : (state, action) => {
            const index = state.warehouses.findIndex(p => p.id === action.payload.id);
            state.warehouses[index] = action.payload;
        },

        setWarehousesDelete : (state, action) => {
            state.warehouses = state.warehouses.filter(p => p.id !== action.payload);
        }
    },
    
    extraReducers: builder => {
        builder.addCase(fetchWarehousesAsync.pending, (state, action) => {
            state.status = false;
        });

        builder.addCase(fetchWarehousesAsync.fulfilled, (state, action) => {
            state.warehouses = action.payload;
            state.status = true;
        });

        builder.addCase(fetchWarehousesAsync.rejected, (state, action) => {
            state.status = true;
            console.log(action.payload);
        });

        ////////////////////////////////////////////////////////////////////////////////////////
        builder.addCase(fetchWarehouseDetailAsync.pending, (state, action) => {

        });

        builder.addCase(fetchWarehouseDetailAsync.fulfilled, (state, action) => {
            state.warehouse = action.payload;
 
        });

        builder.addCase(fetchWarehouseDetailAsync.rejected, (state, action) => {

        });
    }
});

export const {setWarehousesCreate, setWarehousesUpdate, setWarehousesDelete} = warehouseslice.actions;