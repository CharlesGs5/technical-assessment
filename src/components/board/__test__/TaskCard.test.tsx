import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../TaskCard';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { RootState } from '@/store/store';

const mockStore = configureStore([]);

describe('TaskCard', () => {
    const initialState: RootState = {
        board: {
            tasks: {
                'task-1': { id: 'task-1', title: 'Tarea de prueba', isFavorite: false }
            },
            columns: {},
            columnOrder: []
        }
    };

    const store = mockStore(initialState);

    it('renderiza el título correctamente', () => {
        render(
            <Provider store={store}>
                <TaskCard id="task-1" title="Tarea de prueba" />
            </Provider>
        );

        expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
    });

    it('llama onClick si el click es rápido', () => {
        const onClickMock = jest.fn();

        render(
            <Provider store={store}>
                <TaskCard id="task-1" title="Tarea de prueba" onClick={onClickMock} />
            </Provider>
        );

        const card = screen.getByText('Tarea de prueba');
        fireEvent.mouseDown(card);
        fireEvent.mouseUp(card);

        expect(onClickMock).toHaveBeenCalled();
    });
});
