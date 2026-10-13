import { z } from 'zod';

export const idSchema = z.uuid('O id deve ser um UUID válido');
