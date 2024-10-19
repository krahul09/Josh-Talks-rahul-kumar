Task Manager Application
A modern, responsive task management application built with Next.js, TypeScript, and shadcn/ui. Features include task creation, editing, deletion, priority management, search functionality, and persistent storage.

Features

✨ Create, edit, and delete tasks
🎯 Priority levels (High, Medium, Low)
🔍 Search functionality
✅ Task completion tracking
💾 Persistent storage using localStorage
📱 Responsive design
🎨 Modern UI with shadcn/ui components
🔄 Automatic sorting by priority and completion status

--> Tech Stack

Next.js 14
TypeScript
shadcn/ui
Tailwind CSS
Lucide Icons
Local Storage for data persistence

Getting Started
Prerequisites

Node.js 18.0 or later
npm or yarn package manager

Installation

--> Clone the repository:

git clone https://github.com/yourusername/task-manager.git
cd task-manager

--> Install dependencies:

npm install
# or
yarn install

--> Install required shadcn/ui components:

npx shadcn-ui@latest init
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
npx shadcn-ui@latest add textarea

--> Run the development server:

npm run dev
# or
yarn dev

Open http://localhost:3000 with your browser to see the result.

Project Structure
Copysrc/
├── app/
│   └── page.tsx          # Main page component
├── components/
│   └── TaskManager.tsx   # Core task manager component
├── lib/
│   └── utils.ts          # Utility functions and helpers
└── types/
    └── index.ts          # TypeScript type definitions

Task Priority Sorting Algorithm
The application implements a sophisticated sorting algorithm for tasks that considers both completion status and priority levels. Here's how it works:

Primary Sort: Tasks are first sorted by completion status

Incomplete tasks appear before completed tasks
This ensures active tasks are always visible at the top


Secondary Sort: Within each completion group, tasks are sorted by priority

Priority order: High → Medium → Low
Implementation uses a priority map: { high: 0, medium: 1, low: 2 }



--> Here's the sorting implementation:

export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // First, sort by completion status
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    // Then, for incomplete tasks, sort by priority
    if (!a.completed && !b.completed) {
      const priorityOrder = { high: 0, medium: 1, low: 2 } as const;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });
};


--> Local Storage Implementation
Tasks are automatically saved to localStorage whenever the task list is modified:
useEffect(() => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('taskManager', JSON.stringify(tasks));
  }
}, [tasks]);



--> Data is retrieved on initial load:

const [tasks, setTasks] = useState<Task[]>(() => {
  if (typeof window !== 'undefined') {
    const savedTasks = localStorage.getItem('taskManager');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  }
  return initialTasks;
});
