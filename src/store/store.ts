import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './slices/boardSlice';
import {BoardState} from "@/types/board";

const loadState = (): { board: BoardState } | undefined => {
    try {
        const serializedState = localStorage.getItem('ticket-item');
        if (!serializedState) return undefined;
        return { board: JSON.parse(serializedState) };
    } catch (err) {
        console.error('Failed to load state from localStorage:', err);
        return undefined;
    }
};

export const store = configureStore({
    reducer: {
        board: boardReducer,
    },
    preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
