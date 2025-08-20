export interface LoginInputModel {
  username: string;
  password: string;
}

export interface LoginOutputModel {
  token: string;
}

export interface CreateTaskModel {
  name: string;
}

export interface UpdateTaskModel {
  id: number;
  name?: string;
  isCompleted?: boolean;
}

export interface TaskModel {
  id: number;
  name: string;
  isCompleted: boolean;
}
