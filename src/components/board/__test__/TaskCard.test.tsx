import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../TaskCard';

describe('TaskCard', () => {
    it('renders the task title', () => {
        render(<TaskCard id="task-1" title="Tarea de prueba" />);
        expect(screen.getByText('Tarea de prueba')).toBeInTheDocument();
    });

    it('calls onClick when clicked brevemente', () => {
        const handleClick = jest.fn();
        render(<TaskCard id="task-1" title="Click me" onClick={handleClick} />);

        const card = screen.getByText('Click me');
        fireEvent.mouseDown(card);
        fireEvent.mouseUp(card);

        expect(handleClick).toHaveBeenCalled();
    });
});
