import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Board from '../Board';
import { BoardState } from '@/types/board';

const mockStore = configureStore([]);

const mockBoardState: BoardState = {
    tasks: {
        'task-1': { id: 'task-1', title: 'Tarea de prueba', isFavorite: false }
    },
    columns: {
        pending: {
            id: 'pending',
            title: 'Pendiente',
            taskIds: ['task-1']
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

describe('Board component', () => {
    it('renders columns and tasks correctly', () => {
        const store = mockStore({ board: mockBoardState });

        render(
            <Provider store={store}>
                <Board />
            </Provider>
        );

        expect(screen.getByText('Pendiente')).toBeInTheDocument();
        expect(screen.getByText('En progreso')).toBeInTheDocument();
        expect(screen.getByText('Completado')).toBeInTheDocument();
        expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
    });

});
