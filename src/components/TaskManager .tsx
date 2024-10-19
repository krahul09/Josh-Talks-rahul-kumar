"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  Search,
  Pencil,
  Trash2,
  Check,
  X,
  Calendar,
  ListTodo,
} from "lucide-react";
import { getPriorityColor, sortTasks } from "@/lib/utils";
import { Task, NewTask, Priority } from "@/types";

interface TaskManagerProps {
  initialTasks?: Task[];
}

const LOCAL_STORAGE_KEY = "taskManager";

const TaskManager: React.FC<TaskManagerProps> = ({ initialTasks = [] }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedTasks ? JSON.parse(savedTasks) : initialTasks;
    }
    return initialTasks;
  });

  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    priority: "medium",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: Date.now(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
    setNewTask({ title: "", description: "", priority: "medium" });
  };

  const updateTask = (id: number) => {
    if (!editingTask) return;
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? editingTask : task))
    );
    setEditingTask(null);
  };

  const toggleComplete = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleNewTaskChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const sortedAndFilteredTasks = sortTasks(
    tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="mx-auto max-w-4xl">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 border-b bg-white px-6 py-4">
            <div className="flex items-center space-x-2">
              <ListTodo className="h-6 w-6 text-blue-500" />
              <CardTitle className="text-xl font-semibold text-gray-900">
                Task Manager
              </CardTitle>
            </div>
            <p className="text-sm text-gray-500">
              Organize and track your tasks efficiently
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-4 rounded-lg bg-gray-50 p-4">
              <Input
                type="text"
                name="title"
                placeholder="Task title"
                value={newTask.title}
                onChange={handleNewTaskChange}
                className="border-gray-200"
              />
              <Textarea
                name="description"
                placeholder="Task description"
                value={newTask.description}
                onChange={handleNewTaskChange}
                className="border-gray-200"
              />
              <div className="flex gap-4">
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleNewTaskChange}
                  className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                <Button
                  onClick={addTask}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {sortedAndFilteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md ${getPriorityColor(
                    task.priority
                  )} ${task.completed ? "opacity-75" : ""}`}
                >
                  {editingTask?.id === task.id ? (
                    <div className="space-y-4">
                      <Input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            title: e.target.value,
                          })
                        }
                      />
                      <Textarea
                        value={editingTask.description}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            description: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-4">
                        <select
                          value={editingTask.priority}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              priority: e.target.value as Priority,
                            })
                          }
                          className="w-full rounded-md border border-gray-200 p-2 text-sm"
                        >
                          <option value="high">High Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="low">Low Priority</option>
                        </select>
                        <Button
                          onClick={() => updateTask(task.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => setEditingTask(null)}
                          variant="outline"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-lg font-medium ${
                              task.completed
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => toggleComplete(task.id)}
                            size="sm"
                            variant={task.completed ? "outline" : "default"}
                            className={
                              task.completed
                                ? "border-gray-200"
                                : "bg-green-500 hover:bg-green-600"
                            }
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => setEditingTask(task)}
                            size="sm"
                            variant="outline"
                            className="border-gray-200"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteTask(task.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p
                        className={`text-sm ${
                          task.completed ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {task.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        Added {new Date(task.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskManager;
