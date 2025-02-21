import { DrizzleError } from './DrizzleError';

export const handleDrizzleError = (error: unknown): never => {
  // Handle known Drizzle errors
  if (error instanceof Error) {
    // Database connection errors
    if (error.message.includes('Connection refused')) {
      throw new DrizzleError('Database connection failed', 503);
    }

    // Constraint violations
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new DrizzleError('Unique constraint violation', 409);
    }

    // Foreign key violations
    if (error.message.includes('FOREIGN KEY constraint failed')) {
      throw new DrizzleError('Foreign key constraint violation', 409);
    }
  }

  // Unknown errors
  throw new DrizzleError(
    'An unexpected database error occurred',
    500,
    { originalError: error instanceof Error ? error.message : 'Unknown error' }
  );
}
