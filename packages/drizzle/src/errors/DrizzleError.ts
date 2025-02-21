export class DrizzleError extends Error {
  public statusCode: number;
  public data?: Record<string, unknown>;

  constructor(message: string, statusCode: number = 500, data?: Record<string, unknown>) {
    super(message);
    this.name = 'DrizzleError';
    this.statusCode = statusCode;
    this.data = data;
  }
}
