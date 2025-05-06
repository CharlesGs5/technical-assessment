import { render, screen, fireEvent } from '@testing-library/react';
import Column from '../Column';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const store = mockStore({
    board: {
        tasks: {
            'task-1': { id: 'task-1', title: 'Repetida', isFavorite: false },
        },
        columns: {},
        columnOrder: [],
    },
});

beforeEach(() => {
    window.alert = jest.fn(); // o jest.fn() si usas Jest
});


describe('Column - validación de duplicados', () => {
    it('no permite agregar una tarea con nombre duplicado', () => {
        const onAddTask = jest.fn();

        render(
            <Provider store={store}>
                <Column
                    column={{ id: 'pending', title: 'Pendiente', taskIds: ['task-1'] }}
                    filter="all"
                    onFilterChange={() => {}}
                    onAddTask={onAddTask}
                >
                    <div>Tarea existente</div>
                </Column>
            </Provider>
        );

        const input = screen.getByPlaceholderText(/nueva tarea/i);
        fireEvent.change(input, { target: { value: 'Repetida' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(onAddTask).not.toHaveBeenCalled();
        expect(screen.getByText(/ya existe una tarea con ese nombre/i)).toBeInTheDocument();
    });
});
