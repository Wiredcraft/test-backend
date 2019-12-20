import { Document } from 'mongoose';

export interface User extends Document {
    name: string;
    password: string;
    dob: Date;
    address: string;
    description: string;
    age: number;
    coordinate: any;
    createdAt: Date;

    authenticateUser(password: string): Promise<boolean>;
}
