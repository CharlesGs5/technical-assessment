import {ReactNode, useRef, useState} from 'react';
import { useDroppable } from '@dnd-kit/core';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface ColumnProps {
    column: {
        id: string;
        title: string;
        taskIds: string[];
    };
    children: ReactNode;
    onAddTask?: (columnId: string, taskTitle: string) => void;
    filter?: 'all' | 'favorites';
    onFilterChange?: (filter: 'all' | 'favorites') => void;
}

const Container = styled.div`
  width: 18rem;
  min-width: 18rem;
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  @media (prefers-color-scheme: dark) {
    background-color: #1f2937;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;

  @media (prefers-color-scheme: dark) {
    color: white;
  }
`;

const FilterButton = styled.button<{ $active?: boolean; color?: string }>`
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  background-color: ${({ $active }) => ($active ? '#3b82f6' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : 'inherit')};

  @media (prefers-color-scheme: dark) {
    background-color: ${({ $active }) => ($active ? '#facc15' : '#374151')};
    border-color: #4b5563;
    color: ${({ $active }) => ($active ? 'white' : '#d1d5db')};
  }
`;

const TasksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Input = styled.input`
  flex: 1;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  color: white;
`;

const AddButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
`;

export default function Column({
                                   column,
                                   children,
                                   onAddTask,
                                   filter = 'all',
                                   onFilterChange,
                               }: ColumnProps) {
    const { setNodeRef } = useDroppable({ id: column.id });
    const inputRef = useRef<HTMLInputElement>(null);

    const handleAdd = () => {
        const value = inputRef.current?.value.trim();
        if (!value) return;


        onAddTask?.(column.id, value);
        inputRef.current!.value = '';
    };

    return (
        <Container ref={setNodeRef}>
            <Header>
                <Title>{column.title}</Title>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <FilterButton $active={filter === 'all'} onClick={() => onFilterChange?.('all')}>
                        Todas
                    </FilterButton>
                    <FilterButton
                        $active={filter === 'favorites'}
                        color="#facc15"
                        onClick={() => onFilterChange?.('favorites')}
                    >
                        ⭐
                    </FilterButton>
                </div>
            </Header>

            <TasksWrapper>{children}</TasksWrapper>

            <InputRow>
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Nueva tarea"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAdd();
                    }}
                />
                <AddButton onClick={handleAdd}>+</AddButton>
            </InputRow>
        </Container>
    );
}
