export type Priority = "high" | "medium" | "low";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

export interface NewTask {
  title: string;
  description: string;
  priority: Priority;
}
