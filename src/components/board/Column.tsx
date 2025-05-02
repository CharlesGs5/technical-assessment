// src/components/board/Column.tsx
import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface ColumnProps {
    column: {
        id: string;
        title: string;
        taskIds: string[];
    };
    children: ReactNode;
    onAddTask?: (columnId: string, taskTitle: string) => void;
}

export default function Column({ column, children, onAddTask }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id: column.id });

    // Dividir children en favoritos y no favoritos (espera que cada uno tenga prop id y taskId disponible)
    const taskElements = Array.isArray(children) ? children : [children];

    const favoriteTasks = taskElements.filter((child: any) => child?.props?.task?.isFavorite);
    const regularTasks = taskElements.filter((child: any) => !child?.props?.task?.isFavorite);

    const ordered = [...favoriteTasks, ...regularTasks];
    const orderedIds = ordered.map((c: any) => c?.props?.id);

    return (
        <div
            ref={setNodeRef}
            className="w-72 min-w-[18rem] bg-gray-100 dark:bg-gray-800 p-4 rounded shadow flex flex-col"
        >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {column.title}
            </h2>

            <SortableContext items={orderedIds} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                    {children}
                </div>
            </SortableContext>

            <div className="flex gap-2 mt-4">
                <input
                    type="text"
                    placeholder="Nueva tarea"
                    className="flex-1 text-sm px-2 py-1 rounded border border-gray-300"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            const value = input.value.trim();
                            if (value) {
                                onAddTask?.(column.id, value);
                                input.value = '';
                            }
                        }
                    }}
                />
                <button
                    onClick={() => {
                        const input = document.querySelector<HTMLInputElement>(`input[placeholder='Nueva tarea']`);
                        const value = input?.value.trim();
                        if (value) {
                            onAddTask?.(column.id, value);
                            if (input) input.value = '';
                        }
                    }}
                    className="bg-blue-600 text-white px-2 rounded text-sm"
                >
                    +
                </button>
            </div>
        </div>
    );
}
