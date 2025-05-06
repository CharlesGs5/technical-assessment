import { render, screen } from '@testing-library/react';
import EditTaskModal from '../EditTaskModal';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('EditTaskModal', () => {
    const mockOnSave = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnClose = jest.fn();

    const store = mockStore({
        board: {
            tasks: {
                'task-1': { id: 'task-1', title: 'Tarea original', isFavorite: false },
                'task-2': { id: 'task-2', title: 'Otra tarea', isFavorite: false },
            },
            columns: {},
            columnOrder: [],
        },
    });

    const setup = () =>
        render(
            <Provider store={store}>
                <EditTaskModal
                    taskId="task-1"
                    initialTitle="Tarea original"
                    onSaveAction={mockOnSave}
                    onDeleteAction={mockOnDelete}
                    onCloseAction={mockOnClose}
                />
            </Provider>
        );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza con el título inicial', () => {
        setup();
        expect(screen.getByDisplayValue('Tarea original')).toBeInTheDocument();
    });
});
