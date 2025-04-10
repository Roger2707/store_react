import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BasketDTO, BasketItemDTO, BasketUpsertParam } from "../models/Basket";
import agent from "../api/agent";

interface BasketState {
    basket: BasketDTO | null,
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

export const upsertBasket = createAsyncThunk<BasketItemDTO, BasketUpsertParam>(
    'basket/upsert-basket',
    async(basketUpsertDTO, thunkAPI) => {
        try {
            const basketItem = await agent.Basket.upsert(basketUpsertDTO);     
            return basketItem;
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
            state.isLoadBasket = true;
        });

        builder.addCase(getBasket.rejected, (state, action) => {
            state.isLoadBasket = true;
        });

        ///////////////////////////////////////////////////////////////////////////////

        builder.addCase(upsertBasket.pending, (state, action) => {

        });

        builder.addCase(upsertBasket.fulfilled, (state, action) => {         
            const currentBasket : BasketDTO = JSON.parse(JSON.stringify(state.basket));
            if (!currentBasket) {
                state.basket = {
                    id: '',
                    items: [action.payload],
                    userId: 0,
                    grandTotal: 0
                };
                return;
            }

            // Now use currentBasket instead of state.basket for checking
            const existedItem = currentBasket.items?.find(i => i.productDetailId === action.payload.productDetailId);
            
            if(existedItem) {
                // Update the existing item's quantity
                const updatedItems = currentBasket?.items?.map(item => 
                    item.productDetailId === action.payload.productDetailId 
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                );
                state.basket = { ...currentBasket, items: updatedItems };
            } else {
                // Add new item
                const existedItems = currentBasket.items || [];
                state.basket = { ...currentBasket, items: [...existedItems, action.payload] };
            }
        });

        builder.addCase(upsertBasket.rejected, (state, action) => {

        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        builder.addCase(toggleStatusItem.pending, (state, action) => {

        });

        builder.addCase(toggleStatusItem.fulfilled, (state, action) => {

            if (!state.basket || !state.basket.items) return;
            const index = state.basket?.items.findIndex(item => item.basketItemId === action.payload);

            if(index !== undefined && index !== -1) {
                state.basket.items[index].status = !state.basket?.items[index].status;
            }
        });

        builder.addCase(toggleStatusItem.rejected, (state, action) => {

        });
    }
})

export const {setBasket} = basketSlice.actions

