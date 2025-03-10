import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BasketDTO } from "../models/Basket";
import agent from "../api/agent";

interface BasketState {
    basket: BasketDTO | null,
    loadingState: boolean,
    isLoadBasket: boolean,
}

const initialState : BasketState = {
    basket: null,
    loadingState: false,
    isLoadBasket: false
}

export const getBasket = createAsyncThunk<BasketDTO>(
    'basket/get-basket',
    async(_, thunkAPI) => {
        try {
            const basket = await agent.Basket.get();
            return basket;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const upsertBasket = createAsyncThunk<BasketDTO, {productId: number, mode: number}>(
    'basket/upsert-basket',
    async({productId, mode}, thunkAPI) => {
        try {
            const basket = await agent.Basket.upsert(productId, mode);
            return basket.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const toggleStatusItem = createAsyncThunk<BasketDTO, number>(
    'basket/toggle-status-item',
    async(basketItemId, thunkAPI) => {
        try {
            const status = await agent.Basket.toggleStatusItem(basketItemId);
            return status.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket : (state, action) => {

        }
    },
    extraReducers: builder => {
        builder.addCase(getBasket.pending, (state, action) => {
            state.loadingState = true;
        });

        builder.addCase(getBasket.fulfilled, (state, action) => {
            state.loadingState = false;
            state.basket = action.payload;
        });

        builder.addCase(getBasket.rejected, (state, action) => {
            state.loadingState = false;
        });

        ///////////////////////////////////////////////////////////////////////////////

        builder.addCase(upsertBasket.pending, (state, action) => {
            state.loadingState = true;
            console.log('Executing Upsert Basket');
        });

        builder.addCase(upsertBasket.fulfilled, (state, action) => {
            state.loadingState = false;
            state.basket = action.payload ? {...action.payload, items: action.payload.items ? [...action.payload.items] : []} : null;      
        });

        builder.addCase(upsertBasket.rejected, (state, action) => {
            state.loadingState = false;
            console.log('Executed Failed !');
        });

        ///////////////////////////////////////////////////////////////////////////////

        builder.addCase(toggleStatusItem.pending, (state, action) => {
            state.isLoadBasket = false;
            console.log('Executing Toggle Basket Item');
        });

        builder.addCase(toggleStatusItem.fulfilled, (state, action) => {
            state.isLoadBasket = true;  
        });

        builder.addCase(toggleStatusItem.rejected, (state, action) => {
            state.isLoadBasket = true;
            console.log('Executed Failed !');
        });
    }
})

export const {setBasket} = basketSlice.actions

