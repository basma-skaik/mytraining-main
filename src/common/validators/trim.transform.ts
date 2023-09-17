import { TransformFnParams } from 'class-transformer';

export const trimmer = ({ value }: TransformFnParams) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;