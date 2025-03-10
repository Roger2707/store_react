import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Promotion } from "../models/Promotion";
import agent from "../api/agent";

interface PromotionState {
    promotions: Promotion[],
    status: boolean,
}

const initialState : PromotionState = {
    promotions: [],
    status: false,
}

export const fetchPromotionsAsync = createAsyncThunk<Promotion[], {start: string, end: string}>(
    'promotions/fetchPromotionsAsync',
    async ({start, end}, thunkAPI) => {
        try {
            const response = await agent.Promotions.getAll(start, end);      
            return response;
        }
        catch(error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const promotionSlice = createSlice({
    name: 'promotion',
    initialState,
    reducers: {
        setPromotions : (state, action) => {
            state.status = false;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchPromotionsAsync.pending, (state, action) => {
            state.status = false
        });

        builder.addCase(fetchPromotionsAsync.fulfilled, (state, action) => {            
            state.promotions = action.payload;
            state.status = true;
        });

        builder.addCase(fetchPromotionsAsync.rejected, (state, action) => {
            state.status = true;
            console.log(action.payload);
        });
    }
});

export const {setPromotions} = promotionSlice.actions;