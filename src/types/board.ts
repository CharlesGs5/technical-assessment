export type Task = {
    isFavorite: never;
    id: string;
    title: string;
};

export type Column = {
    id: string;
    title: string;
    taskIds: string[];
};

export type BoardState = {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    columnOrder: string[];
};
