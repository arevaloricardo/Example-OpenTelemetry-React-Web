import { environment } from '../../environment';
import type { LoginInputModel, LoginOutputModel } from '../types/auth';

export async function loginUser(credentials: LoginInputModel): Promise<LoginOutputModel> {
  const response = await fetch(`${environment.API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Error al iniciar sesión');
  }

  return response.json();
}
