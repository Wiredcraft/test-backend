// customize error

export interface CustomErrorJSON {
  readonly name: string;
  readonly message: string;
  readonly code: number;
  readonly className: string;
  readonly data?: any;
  readonly errors: any;
}

export class CustomError extends Error {
  readonly code: number | undefined;
  readonly message: string;
  readonly className: string | Error;
  readonly data?: unknown;
  readonly errors: any;
  constructor(name: string | Error, code: number, message: string, msg?: string | Error, data?: unknown) {
    super();
    this.code = code;
    this.message = typeof name === 'string' && !name.includes('_') ? name : message;
    this.className = name;
    data && (this.data = data);
    msg && (this.errors = msg);
  }
}