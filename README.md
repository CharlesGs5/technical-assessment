# Kanban Board App

A fully functional Kanban Board application built with **Next.js 15 (App Router)** as a technical frontend challenge.

---

## 🚀 Features

- 🔐 Simulated sign in and sign up (using [ReqRes](https://reqres.in))
- 🧩 Multiple columns: Pending, In Progress, Done
- ✏️ Create, edit, and delete tasks
- ⭐ Mark tasks as favorites (pinned at the top of the column)
- 📌 Drag and drop tasks between columns and reorder within the same column
- 🕸️ Real-time sync across tabs using WebSockets
- 💾 Persistent state with `localStorage`
- 🔍 Filter to show only favorite tasks
- 🧪 Unit tests with Jest + React Testing Library (50%+ test coverage)
- 💅 Fully styled with Styled Components

---

---

## 🧠 Technical Overview

### 📁 Project Structure

The application follows a modular structure under `src/`, separating logic by domain:

- `app/`: Next.js App Router entry points
- `components/`: UI components for the board, modals, and forms
- `store/`: Redux Toolkit slice for task state
- `lib/`: Contains WebSocket client, tab ID utility, and constants
- `types/`: Shared TypeScript definitions

---

### ⚙️ Key Design Decisions

- **App Router** from Next.js was used to structure routes with layouts and loading states.
- **Redux Toolkit** manages board state globally and immutably.
- **Styled Components** were chosen to enforce scoped styles and allow dynamic theming.
- **WebSockets** are integrated via `socket.io-client` for multi-tab synchronization.

---

### 💾 Data Persistence

- Tasks are persisted in `localStorage` under the key `"ticket-item"`.
- Every change to the board (add, move, delete, edit) triggers an update in `localStorage` using a `useEffect`.
- On app load, the board state is restored from `localStorage` if available.

---

### 🆔 ID Generation & Cache Strategy

- Task IDs are generated using [`nanoid`](https://github.com/ai/nanoid), ensuring unique, URL-safe, cryptographically strong strings.
- These IDs are used as:
    - React keys
    - WebSocket event targets
    - Redux task references
- Since the board state is normalized (`tasks` and `columns`), lookup is efficient and consistent.

---

### 🧱 Advanced Data Structures

To efficiently manage tasks, the board state uses a normalized structure:

```ts
{
  tasks: Record<string, Task>,
  columns: Record<string, { id: string; title: string; taskIds: string[] }>,
  columnOrder: string[]
}
```


## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [@dnd-kit](https://dndkit.com/) – Drag & Drop
- [Styled Components](https://styled-components.com/)
- [Socket.IO](https://socket.io/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/)

---

## ⚙️ Requirements

- Node.js v20.x or higher
- npm v9 or higher


## 📦 Installation

Make sure you are using Node.js v20 or higher:

```bash

node -v
# Expected: v20.x

git clone https://github.com/CharlesGs5/technical-assessment.git
cd technical-assessment
npm install
