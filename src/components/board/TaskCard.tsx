// src/components/board/TaskCard.tsx
import { useDraggable } from '@dnd-kit/core';
import React from 'react';

type TaskCardProps = {
    id: string;
    title: string;
};

export default function TaskCard({ id, title }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

    const style: React.CSSProperties = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="bg-white dark:bg-gray-700 p-3 rounded shadow text-sm border border-gray-200 dark:border-gray-600 cursor-move"
        >
            {title}
        </div>
    );
}
