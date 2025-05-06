import reducer, {
    addTask,
    deleteTask,
    editTask,
    moveTask,
    toggleFavorite,
    setTaskOrder,
} from '../boardSlice';

const initialState = reducer(undefined, { type: '' });

describe('boardSlice', () => {
    it('should add a task', () => {
        const state = reducer(initialState, addTask({ columnId: 'pending', title: 'Test Task' }));
        const taskId = Object.keys(state.tasks).find(id => state.tasks[id].title === 'Test Task');
        expect(taskId).toBeDefined();
        expect(state.columns.pending.taskIds).toContain(taskId);
    });

    it('should edit a task title', () => {
        const stateWithTask = reducer(initialState, addTask({ columnId: 'pending', title: 'Old Title' }));
        const taskId = Object.keys(stateWithTask.tasks)[0];
        const updated = reducer(stateWithTask, editTask({ taskId, newTitle: 'New Title' }));
        expect(updated.tasks[taskId].title).toBe('New Title');
    });

    it('should delete a task', () => {
        const stateWithTask = reducer(initialState, addTask({ columnId: 'pending', title: 'To Delete' }));
        const taskId = Object.keys(stateWithTask.tasks)[0];
        const updated = reducer(stateWithTask, deleteTask({ taskId }));
        expect(updated.tasks[taskId]).toBeUndefined();
        expect(updated.columns.pending.taskIds).not.toContain(taskId);
    });

    it('should toggle favorite', () => {
        const state = reducer(initialState, addTask({ columnId: 'pending', title: 'Favorite' }));
        const taskId = Object.keys(state.tasks)[0];
        const toggled = reducer(state, toggleFavorite({ taskId }));
        expect(toggled.tasks[taskId].isFavorite).toBe(true);
    });

    it('should move a task between columns', () => {
        let state = reducer(initialState, addTask({ columnId: 'pending', title: 'Move Me' }));
        const taskId = Object.keys(state.tasks)[0];
        state = reducer(state, moveTask({ taskId, fromColumnId: 'pending', toColumnId: 'done' }));
        expect(state.columns.pending.taskIds).not.toContain(taskId);
        expect(state.columns.done.taskIds).toContain(taskId);
    });

    it('should set task order', () => {
        let state = reducer(initialState, addTask({ columnId: 'pending', title: 'Task1' }));
        state = reducer(state, addTask({ columnId: 'pending', title: 'Task2' }));
        const ids = [...state.columns.pending.taskIds].reverse();
        const updated = reducer(state, setTaskOrder({ columnId: 'pending', taskIds: ids }));
        expect(updated.columns.pending.taskIds).toEqual(ids);
    });
});
