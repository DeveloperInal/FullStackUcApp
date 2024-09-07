import { configureStore } from '@reduxjs/toolkit';
import MenuReducer from './MenuSlice.ts'

export const store = configureStore({
    reducer: {
        menu: MenuReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;