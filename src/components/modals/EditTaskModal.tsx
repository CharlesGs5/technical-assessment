'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 400px;

  @media (prefers-color-scheme: dark) {
    background-color: #1f2937;
    color: white;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button<{ variant?: 'danger' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  background-color: ${({ variant }) =>
    variant === 'danger' ? '#dc2626' : variant === 'secondary' ? '#6b7280' : '#2563eb'};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

interface Props {
    taskId: string;
    initialTitle: string;
    onSaveAction: (taskId: string, newTitle: string) => void;
    onDeleteAction: (taskId: string) => void;
    onCloseAction: () => void;
}

export default function EditTaskModal({
                                          taskId,
                                          initialTitle,
                                          onSaveAction,
                                          onDeleteAction,
                                          onCloseAction,
                                      }: Props) {
    const [title, setTitle] = useState(initialTitle);
    const board = useSelector((state: RootState) => state.board);

    const handleSave = () => {
        let columnId: string | undefined;

        for (const [colId, colData] of Object.entries(board.columns)) {
            if (colData.taskIds.includes(taskId)) {
                columnId = colId;
                break;
            }
        }

        if (!columnId) {
            alert('No se pudo encontrar la columna de la tarea.');
            return;
        }

        const existingTitles = board.columns[columnId].taskIds
            .filter((id) => id !== taskId)
            .map((id) => board.tasks[id]?.title.trim().toLowerCase());

        const trimmed = title.trim().toLowerCase();

        if (!trimmed) {
            alert('El título no puede estar vacío.');
            return;
        }

        if (existingTitles.includes(trimmed)) {
            alert('Ya existe otra tarea con ese nombre en esta columna.');
            return;
        }

        onSaveAction(taskId, title.trim());
        onCloseAction();
    };

    return (
        <Backdrop onClick={onCloseAction}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Editar Tarea</h2>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nuevo título"
                />
                <ButtonGroup>
                    <Button variant="danger" onClick={() => onDeleteAction(taskId)}>Eliminar</Button>
                    <Button variant="secondary" onClick={onCloseAction}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar</Button>
                </ButtonGroup>
            </ModalBox>
        </Backdrop>
    );
}
