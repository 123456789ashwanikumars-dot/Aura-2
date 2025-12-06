import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../utils/AxiosClient";

// Register
export const RegisterStore = createAsyncThunk(
    "auth/register",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/auth/register", data);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);



// login

export const LoginAssign = createAsyncThunk(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/auth/login", data);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);

        }
    });





// Check
export const checkAuth = createAsyncThunk(
    "auth/check",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/auth/check");
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Logout
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await axiosClient.post("/auth/logout");
            return null;
        } catch (error) {

            return rejectWithValue(error);
        }



    }

)



const authSlice = createSlice({
    name: "auth",
    initialState: { user: null, loading: false, error: null, isAuthenticated: false },
    reducers: {},

    // Jha Hum API Request marna wala hun
    extraReducers: (builder) => {
        builder

            // Register
            .addCase(RegisterStore.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(RegisterStore.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;
            })
            .addCase(RegisterStore.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something wants Wrong";
                state.isAuthenticated = false;
            })

            // Login 
            .addCase(LoginAssign.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(LoginAssign.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;

            })
            .addCase(LoginAssign.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something wants Wrong";
                state.isAuthenticated = false;

            })



            //  CHECK AUTH  (MISSING)
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = !!action.payload;

            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something wants Wrong";
                state.isAuthenticated = false;
                state.user = null;

            })

                 // Logout
                  .addCase(logoutUser.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                  })
                  .addCase(logoutUser.fulfilled, (state) => {
                    state.loading = false;
                    state.user = null;
                    state.isAuthenticated = false;
                    state.error = null;
                  })
                  .addCase(logoutUser.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload?.message || "Something went wrong";
                    state.user = null;
                    state.isAuthenticated = false;
                  })
            
    },




});











export default authSlice.reducer;
