'use client';

import { deleteStudents, getStudents } from './actions';

// Client-side wrappers for server actions
export const clientActions = {
  getStudents,
  deleteStudents,
} as const;
