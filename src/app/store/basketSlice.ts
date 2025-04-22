import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BasketDTO, BasketUpsertParam } from "../models/Basket";
import agent from "../api/agent";

interface BasketState {
    basket: BasketDTO | null | undefined,
    isLoadBasket: boolean,
}

const initialState : BasketState = {
    basket: null,
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

export const upsertBasket = createAsyncThunk<BasketDTO, BasketUpsertParam>(
    'basket/upsert-basket',
    async(basketUpsertDTO, thunkAPI) => {
        try {
            const basketDTO = await agent.Basket.upsert(basketUpsertDTO);   
            return basketDTO;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const toggleStatusItem = createAsyncThunk<string, string>(
    'basket/toggle-status-item',
    async(basketItemId, thunkAPI) => {
        try {
            const id = await agent.Basket.toggleStatusItem(basketItemId);
            return id;
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
            state.basket = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(getBasket.pending, (state, action) => {

        });

        builder.addCase(getBasket.fulfilled, (state, action) => {
            state.basket = action.payload;
        });

        builder.addCase(getBasket.rejected, (state, action) => {

        });

        ///////////////////////////////////////////////////////////////////////////////

        builder.addCase(upsertBasket.pending, (state, action) => {

        });

        builder.addCase(upsertBasket.fulfilled, (state, action) => {
            state.basket = action.payload;
        });       

        builder.addCase(upsertBasket.rejected, (state, action) => {

        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        builder.addCase(toggleStatusItem.pending, (state, action) => {

        });

        builder.addCase(toggleStatusItem.fulfilled, (state, action) => {

            if (!state.basket || !state.basket.items) return;
            const index = state.basket.items.findIndex(item => item.basketItemId === action.payload);

            if(index !== -1) {
                state.basket.items[index].status = !state.basket.items[index].status;
            }
        });

        builder.addCase(toggleStatusItem.rejected, (state, action) => {

        });
    }
})

export const {setBasket} = basketSlice.actions

