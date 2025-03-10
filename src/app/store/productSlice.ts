import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../models/Product";
import { RootState } from "./configureStore";
import agent from "../api/agent";
import { PaginationData } from "../models/PaginationData";

interface ProductState {
    productsLoaded: boolean;
    status: string;
    productParams : ProductParams;
    totalPage: number;

    productsPageLoaded: PaginationData<Product>[];
}

const productsAdapter = createEntityAdapter<Product>();

const getProductParams = (productParams: ProductParams) => {
    const params = new URLSearchParams();

    if(productParams.orderBy) params.append('OrderBy', productParams.orderBy);
    if(productParams.searchBy) params.append('SearchBy', productParams.searchBy);
    if(productParams.filterByCategory) params.append('FilterByCategory', productParams.filterByCategory);
    if(productParams.filterByBrand) params.append('FilterByBrand', productParams.filterByBrand);

    params.append('CurrentPage', productParams.currentPage+'');

    return params;
}

export const fetchProductsAsync = createAsyncThunk<PaginationData<Product>, void, {state: RootState}>(
    'products/fetProductsAsync',
    async(_, thunkAPI) => {
        const params = getProductParams(thunkAPI.getState().product.productParams);
        const pageFetch = params.get('CurrentPage');
        
        if(pageFetch && thunkAPI.getState().product.productsPageLoaded.find(o => o.currentPage === +pageFetch) !== undefined) {      
            return { dataInCurrentPage: [], currentPage: pageFetch, totalPage: thunkAPI.getState().product.totalPage };
        }
        
        try {           
            const response = await agent.Product.list(params);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
)

export const defaultParams = () => {
    return {
        orderBy: '',
        searchBy: '',
        filterByCategory: '',
        filterByBrand: '',
        currentPage: 1,
        productsPageLoaded: [],
    }
}

export const productSlice = createSlice({
    name: 'products',
    initialState: productsAdapter.getInitialState<ProductState>({
        productsLoaded: false,
        status: 'idle',
        productParams : {
            orderBy: '',
            searchBy: '',
            filterByCategory: '',
            filterByBrand: '',
            currentPage: 1,
        },
        totalPage: 0,
        productsPageLoaded: [],
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;

            const key = Object.keys(action.payload); 
            const value = Object.values(action.payload);

            if(key[0] === 'currentPage') {
                //console.log('no search');
                
                state.productParams = {
                    ...state.productParams
                    , currentPage : Number(value[0])
                }
            }
            else if(key[0] !== 'currentPage')
            {
                //console.log('search');                       
                state.productParams = {
                    ...state.productParams
                    , [key[0]] : value[0]

                    // If has the search condition => set current page equal to 1
                    , currentPage: 1
                }

                state.productsPageLoaded = [];
            }   
        },

        setDefaultParams: (state, action) => {
            state.productParams = action.payload;
        },

        setProductsAfterPost: (state, action) => {
            productsAdapter.removeAll(state);

            state.productsLoaded = false;
            state.productParams.currentPage = 1;
            state.productsPageLoaded = [];
        },

        setProductsAfterPut: (state, action) => {

            // Update Pagination Data state
            let index = state.productsPageLoaded.find(p => p.currentPage === state.productParams.currentPage)?.dataInCurrentPage.findIndex(p => p.id === action.payload.id);
            if(index !== undefined)
                state.productsPageLoaded.find(p => p.currentPage === state.productParams.currentPage)?.dataInCurrentPage.splice(index, 1, action.payload);

            // Update Products In Adapter
            productsAdapter.upsertOne(state, action.payload);
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
            state.productsLoaded = false;
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {             
            productsAdapter.addMany(state, action.payload.dataInCurrentPage);
            
            if(state.productsPageLoaded.find(o => o.currentPage === action.payload.currentPage) === undefined) {         
                state.productsPageLoaded = [...state.productsPageLoaded, action.payload];
            }
            state.status = 'idle';
            state.totalPage = action.payload.totalPage;
            state.productsLoaded = true;      
        });
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            state.totalPage = 0;
            state.status = 'idle';
            state.productsLoaded = true;
        });
    }
})

export const { setProductParams, setDefaultParams, setProductsAfterPost, setProductsAfterPut } = productSlice.actions;

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.product);