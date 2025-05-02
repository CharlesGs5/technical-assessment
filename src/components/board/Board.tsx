// src/components/board/Board.tsx
'use client';

import { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { addTask, deleteTask, editTask, moveTask, setTaskOrder } from '@/store/slices/boardSlice';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './Column';
import TaskCard from './TaskCard';
import EditTaskModal from '../modals/EditTaskModal';
import socket from '@/lib/socket';

export default function Board() {
    const board = useSelector((state: RootState) => state.board);
    const dispatch = useDispatch<AppDispatch>();
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

    useEffect(() => {
        socket.connect();

        socket.on('message', (msg) => {
            const { type, payload } = msg;
            switch (type) {
                case 'task:add': dispatch(addTask(payload)); break;
                case 'task:edit': dispatch(editTask(payload)); break;
                case 'task:delete': dispatch(deleteTask(payload)); break;
                case 'task:move': dispatch(moveTask(payload)); break;
                case 'task:order': dispatch(setTaskOrder(payload)); break;
                default: console.warn('Evento WebSocket desconocido:', type);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem('ticket-item', JSON.stringify(board));
    }, [board]);

    const handleAddTask = (columnId: string, taskTitle: string) => {
        dispatch(addTask({ columnId, title: taskTitle }));
        socket.emit('message', { type: 'task:add', payload: { columnId, title: taskTitle } });
    };

    const handleEditTask = (taskId: string, newTitle: string) => {
        dispatch(editTask({ taskId, newTitle }));
        socket.emit('message', { type: 'task:edit', payload: { taskId, newTitle } });
    };

    const handleDeleteTask = (taskId: string) => {
        dispatch(deleteTask({ taskId }));
        setEditingTaskId(null);
        socket.emit('message', { type: 'task:delete', payload: { taskId } });
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const fromColumnId = Object.keys(board.columns).find((colId) =>
            board.columns[colId].taskIds.includes(active.id)
        );

        const toColumnId = Object.keys(board.columns).find((colId) =>
            colId === over.id || board.columns[colId].taskIds.includes(over.id)
        );

        if (!fromColumnId || !toColumnId) return;

        if (fromColumnId === toColumnId) {
            const taskIds = [...board.columns[fromColumnId].taskIds];
            const oldIndex = taskIds.indexOf(active.id);
            const newIndex = taskIds.indexOf(over.id);

            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                const newTaskIds = arrayMove(taskIds, oldIndex, newIndex);
                dispatch(setTaskOrder({ columnId: fromColumnId, taskIds: newTaskIds }));
                socket.emit('message', {
                    type: 'task:order',
                    payload: { columnId: fromColumnId, taskIds: newTaskIds },
                });
            }
            return;
        }

        dispatch(moveTask({ taskId: active.id, fromColumnId, toColumnId }));
        socket.emit('message', { type: 'task:move', payload: { taskId: active.id, fromColumnId, toColumnId } });
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto p-4">
                {board.columnOrder.map((columnId) => {
                    const column = board.columns[columnId];
                    const tasks = column.taskIds.map((taskId) => board.tasks[taskId]);

                    return (
                        <Column column={column} onAddTask={handleAddTask} key={column.id}>
                            {tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    id={task.id}
                                    title={task.title}
                                    onClick={() => setEditingTaskId(task.id)}
                                />
                            ))}
                        </Column>

                    );
                })}
            </div>

            {editingTaskId && (
                <EditTaskModal
                    taskId={editingTaskId}
                    initialTitle={board.tasks[editingTaskId].title}
                    onSaveAction={handleEditTask}
                    onDeleteAction={handleDeleteTask}
                    onCloseAction={() => setEditingTaskId(null)}
                />
            )}
        </DndContext>
    );
}
