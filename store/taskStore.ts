import { create } from 'zustand';

interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  repeat: 'Никогда' | 'Ежедневно' | 'Еженедельно' | 'Ежемесячно' | 'Ежегодно';
  reminder: 'Нет' | 'За 1 час' | 'За 1 день' | 'За 1 неделю';
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  deleteTask: (taskId) => set((state) => ({ 
    tasks: state.tasks.filter(task => task.id !== taskId) 
  })),
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    )
  }))
})); 