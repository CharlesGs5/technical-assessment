import { useDraggable } from '@dnd-kit/core';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleFavorite } from '@/store/slices/boardSlice';
import styled from 'styled-components';

type TaskCardProps = {
    id: string;
    title: string;
    onClick?: () => void;
};

const Card = styled.div<{ isFavorite: boolean }>`
    background-color: ${({ isFavorite }) => (isFavorite ? '#fffbe6' : 'white')};
    color: black;
    padding: 0.75rem;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    font-size: 0.875rem;
    border: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    cursor: move;

    @media (prefers-color-scheme: dark) {
        background-color: ${({ isFavorite }) => (isFavorite ? '#4f4600' : '#374151')};
        border-color: #4b5563;
        color: white;
    }
`;

const FavoriteButton = styled.button`
    color: #facc15; /* Tailwind's yellow-500 */
    font-size: 0.875rem;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
    }
`;

export default function TaskCard({ id, title, onClick }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const dispatch = useDispatch();
    const task = useSelector((state: RootState) => state.board.tasks[id]);
    const downTime = useRef<number>(0);

    const style: React.CSSProperties = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    };

    return (
        <Card
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            isFavorite={!!task.isFavorite}
            onMouseDown={() => {
                downTime.current = Date.now();
            }}
            onMouseUp={(e) => {
                if ((e.target as HTMLElement).closest('button')) return;
                const elapsed = Date.now() - downTime.current;
                if (elapsed < 150) {
                    onClick?.();
                }
            }}
        >
            <span>{title}</span>
            <FavoriteButton
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => {
                    e.stopPropagation();
                    dispatch(toggleFavorite({ taskId: id }));
                }}
                title={task.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
            >
                {task.isFavorite ? '⭐' : '☆'}
            </FavoriteButton>
        </Card>
    );
}
