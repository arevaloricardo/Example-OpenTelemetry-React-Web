import { environment } from '../../environment';
import type { CreateTaskModel, UpdateTaskModel, TaskModel } from '../types/auth';

const getAuthHeaders = () => {
  const token = localStorage.getItem('DemoToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export async function getTasks(): Promise<TaskModel[]> {
  const response = await fetch(`${environment.API_URL}/api/tasks`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al obtener las tareas');
  }

  return response.json();
}

export async function createTask(task: CreateTaskModel): Promise<void> {
  const response = await fetch(`${environment.API_URL}/api/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Error al crear la tarea');
  }
}

export async function updateTask(task: UpdateTaskModel): Promise<void> {
  const response = await fetch(`${environment.API_URL}/api/tasks`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar la tarea');
  }
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${environment.API_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error al eliminar la tarea');
  }
}
