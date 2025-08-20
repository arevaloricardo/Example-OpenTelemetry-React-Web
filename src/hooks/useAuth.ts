import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../services/auth';
import { getTasks, createTask, updateTask, deleteTask } from '../services/tasks';

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Guardar el token en localStorage
      localStorage.setItem('DemoToken', data.token);
    },
    onError: (error) => {
      console.error('Error en login:', error);
    },
  });
}

export function useAuth() {
  const token = localStorage.getItem('DemoToken');
  return {
    isAuthenticated: !!token,
    token,
    logout: () => {
      localStorage.removeItem('DemoToken');
      window.location.href = '/';
    }
  };
}

// Hooks para tareas
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
