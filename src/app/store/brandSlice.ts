import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Brand } from "../models/Brand";
import agent from "../api/agent";
import { DropdownData } from "../../features/UI/Forms/Dropdown";

interface BrandState {
    brands: Brand[];
    status: boolean;
    brandsDropdown: DropdownData[];
}

const initialState: BrandState = {
    brands: [],
    status: false,
    brandsDropdown: [],
}

export const fetchBrandsAsync = createAsyncThunk<Brand[]>(
    'brand/fetchBrandsAsync'
    , async (_, thunkAPI) => {
        try {
            const response = await agent.Brands.list();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

export const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {
        setBrandsCreate: (state, action) => {
            state.brands = [...state.brands, action.payload].sort((a, b) => a.name - b.name);
        },

        setBrandsUpdate: (state, action) => {
            const index = state.brands.findIndex(p => p.id === action.payload.id);
            state.brands[index] = action.payload;
        },

        setBrandsDelete: (state, action) => {
            state.brands = state.brands.filter(p => p.id !== action.payload);
        },

        setBrandsDropdown: (state, action) => {
            if (state.brands.length > 0) {
                const defaultBrand: Brand = {
                    id: '',
                    name: '',
                    country: '',
                }
                let newBrands: Brand[] = [defaultBrand, ...state.brands];
                state.brandsDropdown = newBrands?.map((d: Brand) => {
                    return { title: d.name, value: d.id };
                });
            }
        }
    },

    extraReducers: builder => {
        builder.addCase(fetchBrandsAsync.pending, (state, action) => {
            state.status = false;
        });

        builder.addCase(fetchBrandsAsync.fulfilled, (state, action) => {
            state.brands = action.payload;
            state.status = true;
        });

        builder.addCase(fetchBrandsAsync.rejected, (state, action) => {
            state.status = true;
            console.log(action.payload);
        });
    }
});

export const { setBrandsCreate, setBrandsUpdate, setBrandsDelete, setBrandsDropdown } = brandSlice.actions;