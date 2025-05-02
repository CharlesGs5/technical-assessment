// src/components/board/TaskCard.tsx
import { useDraggable } from '@dnd-kit/core';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleFavorite } from '@/store/slices/boardSlice';

type TaskCardProps = {
    id: string;
    title: string;
    onClick?: () => void;
};

export default function TaskCard({ id, title, onClick }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const dispatch = useDispatch();
    const task = useSelector((state: RootState) => state.board.tasks[id]);
    const downTime = useRef<number>(0);

    const style: React.CSSProperties = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            onMouseDown={() => {
                downTime.current = Date.now();
            }}
            onMouseUp={() => {
                const elapsed = Date.now() - downTime.current;
                if (elapsed < 150) {
                    onClick?.();
                }
            }}
            className="bg-white dark:bg-gray-700 p-3 rounded shadow text-sm border border-gray-200 dark:border-gray-600 cursor-move flex justify-between items-start"
        >
            <span>{title}</span>
            <button
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => {
                    e.stopPropagation();
                    dispatch(toggleFavorite({ taskId: id }));
                }}
                title={task.isFavorite ? 'Quitar de favoritos' : 'Marcar como favorito'}
                className="text-yellow-500 text-sm"
            >
                {task.isFavorite ? '⭐' : '☆'}
            </button>
        </div>
    );
}
