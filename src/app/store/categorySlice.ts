import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Category } from "../models/Category";
import agent from "../api/agent";

interface CategoryState {
    categories : Category[];
    status: boolean;
}

const initialState : CategoryState = {
    categories: [],
    status: false
}

export const fetchCategoryAsync = createAsyncThunk<Category[]>(
    'category/fetchCategoryAsync'
    , async(_, thunkAPI) => {
        try {
            const response = await agent.Categories.list();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.status = false;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchCategoryAsync.pending, (state, action) => {
            state.status = false;
        });

        builder.addCase(fetchCategoryAsync.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.status = true;
            //console.log(state.categories);          
        });

        builder.addCase(fetchCategoryAsync.rejected, (state, action) => {
            state.status = true;
            console.log(action.payload);
            
        })
    }
});

export const { setCategories } = categorySlice.actions;