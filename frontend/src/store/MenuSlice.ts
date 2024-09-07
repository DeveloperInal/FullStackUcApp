import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Menu, menuState } from "../types/menu";

const baseURL = 'http://127.0.0.1:8000';

const initialState: menuState = {
    list: [],
    loading: false,
    error: null,
};

export const getUserData = createAsyncThunk<
    Menu,
    { id: string },  // Ensure this matches the type expected
    { rejectValue: string }
>(
    'menu/getUserData',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${baseURL}/get_user/${id}`);
            if (response.status !== 200) {
                return rejectWithValue('Failed to fetch data');
            }
            return response.data;
        } catch (error: any) {
            return rejectWithValue(`An error occurred while fetching the data: ${error.message}`);
        }
    }
);

export const updateBalanceData = createAsyncThunk<
    Menu,
    { id: string, randomAmount: number },
    { rejectValue: string }
>(
    'menu/updateBalanceData',
    async ({ id, randomAmount }, { dispatch, rejectWithValue }) => {
        try {
            const userResponse = await dispatch(getUserData({ id })).unwrap();
            if (!userResponse) {
                return rejectWithValue('User data not found');
            }

            const newBalance = userResponse.balance + randomAmount;
            const newCountBoxes = userResponse.count_boxes - 1;

            const updateData = {
                id: userResponse.id,
                username: userResponse.username,
                tg_id: userResponse.tg_id,
                balance: newBalance,
                count_boxes: newCountBoxes
            };

            const updateResponse = await axios.put(`${baseURL}/update_user/${id}`, updateData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (updateResponse.status !== 200) {
                return rejectWithValue('Failed to update data');
            }

            return updateResponse.data;
        } catch (error: any) {
            return rejectWithValue(`An error occurred while updating the data: ${error.message}`);
        }
    }
);

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.loading = false;
                state.list = [action.payload];
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to load data';
            })
            .addCase(updateBalanceData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBalanceData.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload;
                state.list = state.list.map(user =>
                    user.id === updatedUser.id ? updatedUser : user
                );
            })
            .addCase(updateBalanceData.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Failed to update data';
            });
    }
});

export default menuSlice.reducer;
