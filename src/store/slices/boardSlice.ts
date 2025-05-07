import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardState } from '@/types/board';
import { nanoid } from 'nanoid/non-secure';

const initialState: BoardState = {
    tasks: {},
    columns: {
        pending: {
            id: 'pending',
            title: 'Pendiente',
            taskIds: []
        },
        'in-progress': {
            id: 'in-progress',
            title: 'En progreso',
            taskIds: []
        },
        done: {
            id: 'done',
            title: 'Completado',
            taskIds: []
        }
    },
    columnOrder: ['pending', 'in-progress', 'done']
};

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<{ columnId: string; title: string; id?: string }>) => {
            const id = action.payload.id ?? nanoid();
            state.tasks[id] = { id, title: action.payload.title, isFavorite: false };
            state.columns[action.payload.columnId].taskIds.push(id);
        },
        editTask: (state, action: PayloadAction<{ taskId: string; newTitle: string }>) => {
            if (state.tasks[action.payload.taskId]) {
                state.tasks[action.payload.taskId].title = action.payload.newTitle;
            }
        },
        deleteTask: (state, action: PayloadAction<{ taskId: string }>) => {
            const { taskId } = action.payload;
            delete state.tasks[taskId];
            for (const col of Object.values(state.columns)) {
                col.taskIds = col.taskIds.filter((id) => id !== taskId);
            }
        },
        moveTask: (state, action: PayloadAction<{ taskId: string; fromColumnId: string; toColumnId: string }>) => {
            const { taskId, fromColumnId, toColumnId } = action.payload;
            const fromTaskIds = state.columns[fromColumnId].taskIds;
            state.columns[fromColumnId].taskIds = fromTaskIds.filter((id) => id !== taskId);
            state.columns[toColumnId].taskIds.push(taskId);
        },
        setTaskOrder: (state, action: PayloadAction<{ columnId: string; taskIds: string[] }>) => {
            const { columnId, taskIds } = action.payload;
            state.columns[columnId].taskIds = taskIds;
        },
        toggleFavorite: (state, action: PayloadAction<{ taskId: string }>) => {
            const task = state.tasks[action.payload.taskId];
            if (task) {
                task.isFavorite = !task.isFavorite;
            }
        },
        setBoard: (state, action: PayloadAction<BoardState>) => {
            return action.payload;
        },
    },
});

export const { addTask, editTask, deleteTask, moveTask, setTaskOrder, toggleFavorite, setBoard } = boardSlice.actions;
export default boardSlice.reducer;
