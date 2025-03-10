import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserAddressDTO } from "../models/User";
import agent from "../api/agent";

interface UserAddressState {
    userAddresses: UserAddressDTO[] | [];
    loadingState: boolean;
    loadingUser: boolean;
}

const initialState : UserAddressState = {
    userAddresses: [],
    loadingState: false,
    loadingUser: true,
}

export const fetchUserAddressAsync = createAsyncThunk<UserAddressDTO[]>(
    'userAddress/fetchUserAddressAsync',
    async(_, thunkAPI) => {
        try {
            const response = await agent.Account.getUserAddress();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const userAddressSlice = createSlice({
    name : 'userAddressSlice',
    initialState: initialState,
    reducers : {
        addEmptyUserAddresses : (state, action) => {
            const length = state.userAddresses.length;
            if(length === 3) return;

            const newUserAddress : UserAddressDTO = {
                city: '',
                district: '',
                ward: '',
                postalCode: '',
                country: '',
                streetAddress: '',
                id: 0
            };

            state.userAddresses = [...state.userAddresses, newUserAddress];
        },

        setUserAddresses : (state, action) => {
            state.userAddresses = [];
            state.loadingUser = true;
        },

        removeEmptyUserAddress: (state, action) => {
            state.userAddresses = state.userAddresses.filter(u => u.id !== 0);
        }
    },
    extraReducers: builder => {

        builder.addCase(fetchUserAddressAsync.pending, (state, action) => {
            
        });

        builder.addCase(fetchUserAddressAsync.fulfilled, (state, action) => {
            state.userAddresses = action.payload;
            // set loading -> false
            state.loadingUser = false;           
        })

        builder.addCase(fetchUserAddressAsync.rejected, (state, action) => {
            console.error('Fetch user address Failed !');
            state.loadingUser = false;
        })
    }
});

export const {addEmptyUserAddresses, setUserAddresses, removeEmptyUserAddress} = userAddressSlice.actions;