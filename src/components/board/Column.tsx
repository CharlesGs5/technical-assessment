// src/components/board/Column.tsx
import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

type ColumnProps = {
    column: {
        id: string;
        title: string;
    };
    children?: ReactNode;
};

export default function Column({ column, children }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id: column.id });

    return (
        <div
            ref={setNodeRef}
            className="w-72 min-w-[18rem] bg-gray-100 dark:bg-gray-800 p-4 rounded shadow flex flex-col"
        >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {column.title}
            </h2>
            <div className="flex flex-col gap-3">
                {children}
            </div>
        </div>
    );
}
