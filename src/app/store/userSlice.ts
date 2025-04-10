import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ChangePasswordDTO, ForgetPasswordDTO, ResetPasswordDTO, SignInRequest, SignUpRequest, UserDTO, UserProfileUpdate } from "../models/User";
import agent from "../api/agent";
import { router } from "../router/Routes";

interface UserState {
    user: UserDTO | null,
    loadingState: boolean,
    message?: string,
}

const initialState : UserState = {
    user: null,
    loadingState: false,
    message: ''
}

export const signUpAsync = createAsyncThunk<UserDTO, SignUpRequest>(
    'user/signUpAsync',
    async(data, thunkAPI) => {
        try {
            const user = await agent.User.signUp(data);
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const signInAsync = createAsyncThunk<UserDTO, SignInRequest>(
    'user/signInAsync',
    async (data, thunkAPI) => {
        try {
            const response = await agent.User.signIn(data);
            localStorage.setItem('user', JSON.stringify(response));
            return response;
        }
        catch(error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
);

export const fetchCurrentUser = createAsyncThunk<UserDTO>(
    'user/fetchCurrentUser',
    async (_, thunkAPI) => {
        try {
            const user = await agent.User.currentUser();
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    },
    {
        condition: () => {
            if(!localStorage.getItem('user')) return false;
        }
    }
)

export const logOutAsync = createAsyncThunk(
    'user/logOut',
    async (_, thunkAPI) => {
        try {
            const response = await agent.User.logOut();
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const handleForgetPassword = createAsyncThunk<void, ForgetPasswordDTO>(
    'user/forgetPassword',
    async (data, thunkAPI) => {
        try {
            const response = await agent.User.forgetPassword(data);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const handleResetPassword = createAsyncThunk<void, ResetPasswordDTO>(
    'account/resetPasssword',
    async (data, thunkAPI) => {
        try {
            const response = await agent.User.resetPassword(data);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const updateUserProfile = createAsyncThunk<UserDTO, UserProfileUpdate>(
    'account/update-user-profile',
    async (data, thunkAPI) => {
        try {
            const response = await agent.User.updateUserProfile(data);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)
 
export const changePassword = createAsyncThunk<void, ChangePasswordDTO>(
    'account/changePassword',
    async(data, thunkAPI) => {
        try {
            const response = await agent.User.changePassword(data);
            return response;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const userSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setUser : (state, action) => {        
                       
            const payloadBase64 = action.payload.token.split('.')[1]; 
            const decodedPayload = atob(payloadBase64);
            var role = JSON.parse(decodedPayload)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            state.user = {...action.payload, role};

            localStorage.setItem('user', JSON.stringify(action.payload));
            router.navigate('/');
        },

        ssignOut: (state, action) => {
            state.user = null;
            localStorage.removeItem('user');
            router.navigate('/');
        }
    },

    extraReducers: builder => {
        builder.addCase(signUpAsync.pending, (state, action) => {
            state.loadingState = true;
        });

        builder.addCase(signUpAsync.fulfilled, (state, action) => {
            state.loadingState = false;
            router.navigate('/login');
        });

        builder.addCase(signUpAsync.rejected, (state, action) => {
            state.loadingState = false;
            router.navigate('/signup');
        })

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        builder.addCase(signInAsync.pending, (state, action) => {
            state.loadingState = true;
        });

        builder.addCase(signInAsync.fulfilled, (state, action) => {
            const payloadBase64 = action.payload.token.split('.')[1]; 
            const decodedPayload = atob(payloadBase64);
            var role = JSON.parse(decodedPayload)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            state.user = {...action.payload, role};

            state.loadingState = false;
            router.navigate('/');
        });

        builder.addCase(signInAsync.rejected, (state, action) => {
            state.loadingState = false;
            router.navigate('/login');
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {      
            if(action.payload.token) {
                const payloadBase64 = action.payload.token.split('.')[1];
                const decodedPayload = atob(payloadBase64);
                var role = JSON.parse(decodedPayload)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                state.user = {...action.payload, role};
            }   
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////// 

        builder.addCase(logOutAsync.pending, (state, action) => {
            state.loadingState = true;
        });

        builder.addCase(logOutAsync.fulfilled, (state, action) => {
            state.user = null;
            localStorage.removeItem('user');

            state.loadingState = false;
            router.navigate('/');
        });

        builder.addCase(logOutAsync.rejected, (state, action) => {
            state.loadingState = false;
            console.log('Log-Out error !');
        });

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        builder.addCase(handleForgetPassword.pending, (state, action) => {
            state.loadingState = true;
        });

        builder.addCase(handleForgetPassword.fulfilled, (state, action) => {
            state.loadingState = false;
            state.message = 'success'
        });

        builder.addCase(handleForgetPassword.rejected, (state, action) => {
            state.loadingState = false;
            state.message = 'error'
        });

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        builder.addCase(handleResetPassword.pending, (state, action) => {
            state.loadingState = true;
        });

        builder.addCase(handleResetPassword.fulfilled, (state, action) => {
            state.loadingState = false;
            router.navigate('/login');
        });

        builder.addCase(handleResetPassword.rejected, (state, action) => {
            state.loadingState = false;
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        builder.addCase(updateUserProfile.pending, (state, action) => {
            state.loadingState = true;
        });

        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            state.loadingState = false;

            // set user -> updated user
            state.user = action.payload;
            console.log(action.payload);
            
        });

        builder.addCase(updateUserProfile.rejected, (state, action) => {
            state.loadingState = false;
        });

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        builder.addCase(changePassword.pending, (state, action) => {
            state.loadingState = true;
        });

        builder.addCase(changePassword.fulfilled, (state, action) => {
            state.loadingState = false;

        });

        builder.addCase(changePassword.rejected, (state, action) => {
            state.loadingState = false;
        });
    }
});


export const {ssignOut, setUser} = userSlice.actions;