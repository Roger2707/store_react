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

export const fetchPromotionsAsync = createAsyncThunk<Promotion[]>(
    'promotions/fetchPromotionsAsync',
    async (_, thunkAPI) => {
        try {
            const response = await agent.Promotions.getAll();  
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
        setPromotionsCreate : (state, action) => {
            state.promotions = [...state.promotions, action.payload].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        },

        setPromotionUpdate : (state, action) => {
            const index = state.promotions.findIndex(p => p.id === action.payload.id);
            state.promotions[index] = action.payload;
        },

        setPromotionDelete : (state, action) => {
            state.promotions = state.promotions.filter(p => p.id !== action.payload);
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
        });
    }
});

export const {setPromotionsCreate, setPromotionUpdate, setPromotionDelete} = promotionSlice.actions;