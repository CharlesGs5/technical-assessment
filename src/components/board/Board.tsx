'use client';

import { useEffect, useState } from 'react';
import {DndContext, closestCenter, DragEndEvent} from '@dnd-kit/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { addTask, deleteTask, editTask, moveTask, setTaskOrder } from '@/store/slices/boardSlice';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './Column';
import TaskCard from './TaskCard';
import EditTaskModal from '../modals/EditTaskModal';
import socket from '@/lib/socket';
import styled from 'styled-components';
import TAB_ID from "@/lib/tabId";

type SocketMessage =
    | {
    type: 'task:add';
    payload: { columnId: string; title: string };
    meta?: { tabId: string };
}
    | {
    type: 'task:edit';
    payload: { taskId: string; newTitle: string };
    meta?: { tabId: string };
}
    | {
    type: 'task:delete';
    payload: { taskId: string };
    meta?: { tabId: string };
}
    | {
    type: 'task:move';
    payload: { taskId: string; fromColumnId: string; toColumnId: string };
    meta?: { tabId: string };
}
    | {
    type: 'task:order';
    payload: { columnId: string; taskIds: string[] };
    meta?: { tabId: string };
};


const BoardWrapper = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem;
`;

export default function Board() {
    const board = useSelector((state: RootState) => state.board);
    const dispatch = useDispatch<AppDispatch>();
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, 'all' | 'favorites'>>({});

    useEffect(() => {
        socket.connect();

        const handleMessage = (msg: SocketMessage) => {
            const { type, payload, meta } = msg;
            if (meta?.tabId === TAB_ID) return;

            console.log('Mensaje recibido:', msg, 'Mi tabId:', TAB_ID);

            switch (type) {
                case 'task:add': dispatch(addTask(payload)); break;
                case 'task:edit': dispatch(editTask(payload)); break;
                case 'task:delete': dispatch(deleteTask(payload)); break;
                case 'task:move': dispatch(moveTask(payload)); break;
                case 'task:order': dispatch(setTaskOrder(payload)); break;
                default: console.warn('Evento WebSocket desconocido:', type);
            }
        };

        socket.on('message', handleMessage);

        return () => {
            socket.off('message', handleMessage);
            socket.disconnect();
        };
    }, [dispatch]);


    useEffect(() => {
        localStorage.setItem('ticket-item', JSON.stringify(board));
    }, [board]);

    const handleAddTask = (columnId: string, taskTitle: string) => {
        const normalizedNew = taskTitle.trim().toLowerCase();

        const existingTitles = board.columns[columnId].taskIds.map(id =>
            board.tasks[id]?.title.trim().toLowerCase()
        );

        if (existingTitles.includes(normalizedNew)) {
            alert("Ya existe una tarea con ese nombre en esta columna.");
            return;
        }

        dispatch(addTask({ columnId, title: taskTitle }));
        socket.emit('message', {
            type: 'task:add',
            payload: { columnId, title: taskTitle },
            meta: { tabId: TAB_ID }
        });
    };

    const handleEditTask = (taskId: string, newTitle: string) => {
        const columnId = Object.keys(board.columns).find((colId) =>
            board.columns[colId].taskIds.includes(taskId)
        );

        if (!columnId) return;

        const duplicate = board.columns[columnId].taskIds
            .filter(id => id !== taskId)
            .map(id => board.tasks[id].title.trim().toLowerCase())
            .includes(newTitle.trim().toLowerCase());

        if (duplicate) {
            alert('Ya existe una tarea con ese nombre en esta columna.');
            return;
        }

        dispatch(editTask({ taskId, newTitle }));
        socket.emit('message', {
            type: 'task:edit',
            payload: { taskId, newTitle },
            meta: { tabId: TAB_ID }
        });
    };

    const handleDeleteTask = (taskId: string) => {
        const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta tarea?');
        if (!confirmed) return;

        dispatch(deleteTask({ taskId }));
        setEditingTaskId(null);
        socket.emit('message', {
            type: 'task:delete',
            payload: { taskId },
            meta: { tabId: TAB_ID }
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        const activeId = active?.id as string;
        const overId = over?.id as string;

        if (!overId || activeId === overId) return;

        const fromColumnId = Object.keys(board.columns).find((colId) =>
            board.columns[colId].taskIds.includes(activeId)
        );

        const toColumnId = Object.keys(board.columns).find((colId) =>
            colId === overId || board.columns[colId].taskIds.includes(overId)
        );

        if (!fromColumnId || !toColumnId) return;

        if (fromColumnId === toColumnId) {
            const taskIds = [...board.columns[fromColumnId].taskIds];
            const oldIndex = taskIds.indexOf(activeId);
            const newIndex = taskIds.indexOf(overId);

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

        dispatch(moveTask({ taskId: activeId, fromColumnId, toColumnId }));
        socket.emit('message', {
            type: 'task:move',
            payload: { taskId: active.id, fromColumnId, toColumnId },
            meta: { tabId: TAB_ID },
        });
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <BoardWrapper>
                {board.columnOrder.map((columnId) => {
                    const column = board.columns[columnId];
                    const filter = filters[columnId] || 'all';
                    const taskIds = column.taskIds;

                    let tasks = taskIds.map((id) => board.tasks[id]);
                    if (filter === 'favorites') {
                        tasks = tasks.filter((task) => task?.isFavorite);
                    } else {
                        const favorites = tasks.filter((task) => task?.isFavorite);
                        const regulars = tasks.filter((task) => !task?.isFavorite);
                        tasks = [...favorites, ...regulars];
                    }

                    return (
                        <Column
                            column={column}
                            onAddTask={handleAddTask}
                            key={column.id}
                            filter={filter}
                            onFilterChange={(newFilter) =>
                                setFilters((prev) => ({ ...prev, [column.id]: newFilter }))
                            }
                        >
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
            </BoardWrapper>

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
