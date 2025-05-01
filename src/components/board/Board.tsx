// src/components/board/Board.tsx
'use client';

import { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';
import TaskCard from './TaskCard';

const initialColumns = [
    {
        id: 'pending',
        title: 'Pendiente',
        tasks: [
            { id: 'task-1', title: 'Tarea 1' },
            { id: 'task-2', title: 'Tarea 2' }
        ]
    },
    {
        id: 'in-progress',
        title: 'En progreso',
        tasks: [
            { id: 'task-3', title: 'Tarea 3' }
        ]
    },
    {
        id: 'done',
        title: 'Completado',
        tasks: []
    }
];

export default function Board() {
    const [columns, setColumns] = useState(initialColumns);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const fromColumnIndex = columns.findIndex((col) =>
            col.tasks.some((task) => task.id === active.id)
        );

        const toColumnIndex = columns.findIndex((col) =>
            col.id === over.id || col.tasks.some((task) => task.id === over.id)
        );

        // 🚫 Si misma columna y sin movimiento real → no hacer nada
        if (fromColumnIndex === toColumnIndex) return;

        const fromTasks = [...columns[fromColumnIndex].tasks];
        const toTasks = [...columns[toColumnIndex].tasks];
        const taskIndex = fromTasks.findIndex((task) => task.id === active.id);
        const [movedTask] = fromTasks.splice(taskIndex, 1);
        const updatedToTasks = [...toTasks, movedTask];

        const updatedColumns = [...columns];
        updatedColumns[fromColumnIndex] = {
            ...columns[fromColumnIndex],
            tasks: fromTasks,
        };
        updatedColumns[toColumnIndex] = {
            ...columns[toColumnIndex],
            tasks: updatedToTasks,
        };

        setColumns(updatedColumns);
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto p-4">
                {columns.map((column) => (
                    <SortableContext key={column.id} items={column.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                        <Column column={column}>
                            {column.tasks.map((task) => (
                                <TaskCard key={task.id} id={task.id} title={task.title} />
                            ))}
                        </Column>
                    </SortableContext>
                ))}
            </div>
        </DndContext>
    );
}
