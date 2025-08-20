import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth, useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import type { TaskModel } from '@/types/auth'

export const Route = createFileRoute('/private')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [newTaskName, setNewTaskName] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskName, setEditingTaskName] = useState('');
  
  const { data: tasks, isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  const handleCreateTask = () => {
    if (!newTaskName.trim()) {
      toast.error('El nombre de la tarea es requerido');
      return;
    }

    createTaskMutation.mutate({ name: newTaskName }, {
      onSuccess: () => {
        setNewTaskName('');
        toast.success('Tarea creada exitosamente');
      },
      onError: () => {
        toast.error('Error al crear la tarea');
      },
    });
  };

  const handleToggleTask = (task: TaskModel) => {
    updateTaskMutation.mutate({
      id: task.id,
      isCompleted: !task.isCompleted
    }, {
      onSuccess: () => {
        toast.success('Tarea actualizada');
      },
      onError: () => {
        toast.error('Error al actualizar la tarea');
      },
    });
  };

  const handleDeleteTask = (id: number) => {
    deleteTaskMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Tarea eliminada');
      },
      onError: () => {
        toast.error('Error al eliminar la tarea');
      },
    });
  };

  const handleStartEdit = (task: TaskModel) => {
    setEditingTaskId(task.id);
    setEditingTaskName(task.name);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskName('');
  };

  const handleSaveEdit = () => {
    if (!editingTaskName.trim()) {
      toast.error('El nombre de la tarea es requerido');
      return;
    }

    if (editingTaskId) {
      updateTaskMutation.mutate({
        id: editingTaskId,
        name: editingTaskName.trim()
      }, {
        onSuccess: () => {
          setEditingTaskId(null);
          setEditingTaskName('');
          toast.success('Tarea actualizada');
        },
        onError: () => {
          toast.error('Error al actualizar la tarea');
        },
      });
    }
  };

  if (!isAuthenticated) {
    return null; // o un spinner mientras redirige
  }

  return (
    <div className="p-5 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header con input y botón */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mis Tareas</h1>
          <Button onClick={logout} variant="outline">
            Cerrar Sesión
          </Button>
        </div>
        
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Nueva tarea..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateTask()}
            className="flex-1"
          />
          <Button 
            onClick={handleCreateTask}
            disabled={createTaskMutation.isPending}
          >
            {createTaskMutation.isPending ? 'Creando...' : 'Agregar'}
          </Button>
        </div>

        {/* Lista de tareas */}
        {isLoading && <p>Cargando tareas...</p>}
        {error && <p className="text-red-500">Error al cargar las tareas</p>}
        
        <div className="space-y-2">
          {tasks?.map((task) => (
            <Card key={task.id} className='py-4'>
              <CardContent className="px-5 py-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleToggleTask(task)}
                      className="h-4 w-4"
                    />
                    {editingTaskId === task.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={editingTaskName}
                          onChange={(e) => setEditingTaskName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          className="flex-1"
                          autoFocus
                        />
                        <Button size="sm" onClick={handleSaveEdit}>
                          Guardar
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className={`cursor-pointer flex-1 ${task.isCompleted ? 'line-through text-gray-500' : ''}`}
                        onDoubleClick={() => handleStartEdit(task)}
                        title="Doble clic para editar"
                      >
                        {task.name}
                      </span>
                    )}
                  </div>
                  {editingTaskId !== task.id && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleStartEdit(task)}
                        variant="outline"
                        size="sm"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteTask(task.id)}
                        variant="destructive"
                        size="sm"
                        disabled={deleteTaskMutation.isPending}
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {tasks?.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No tienes tareas aún. ¡Agrega tu primera tarea!
          </div>
        )}
      </div>
    </div>
  )
}
