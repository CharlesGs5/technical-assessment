'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background: ${({ variant }) => {
        switch (variant) {
            case 'primary': return '#2563eb';
            case 'danger': return '#dc2626';
            default: return '#e5e7eb';
        }
    }};
    color: ${({ variant }) => (variant === 'primary' || variant === 'danger' ? 'white' : '#111827')};
`;

type EditTaskModalProps = {
    taskId: string;
    initialTitle: string;
    onSaveAction: (taskId: string, newTitle: string) => void;
    onCloseAction: () => void;
    onDeleteAction?: (taskId: string) => void;
};

export default function EditTaskModal({ taskId, initialTitle, onSaveAction, onCloseAction, onDeleteAction }: EditTaskModalProps) {
    const [title, setTitle] = useState(initialTitle);

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSaveAction(taskId, title.trim());
        onCloseAction();
    };

    const handleDelete = () => {
        if(confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            onDeleteAction?.(taskId);
            onCloseAction();
        }
    };

    return (
        <Overlay>
            <ModalContainer>
                <Title>Editar tarea</Title>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título de la tarea"
                />
                <ButtonGroup>
                    <Button onClick={onCloseAction}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
                    <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
                </ButtonGroup>
            </ModalContainer>
        </Overlay>
    );
}
