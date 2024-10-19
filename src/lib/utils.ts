// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Priority, Task } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getPriorityColor = (priority: Priority) => {
  const colors = {
    high: "border-l-4 border-l-red-500 bg-red-50",
    medium: "border-l-4 border-l-yellow-500 bg-yellow-50",
    low: "border-l-4 border-l-green-500 bg-green-50",
  } as const;
  return colors[priority];
};

export const initialNewTask: Task = {
  title: "",
  description: "",
  priority: "medium",
  completed: false,
  id: 0,
  createdAt: new Date().toISOString(),
};

export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (!a.completed && !b.completed) {
      const priorityOrder = { high: 0, medium: 1, low: 2 } as const;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });
};
