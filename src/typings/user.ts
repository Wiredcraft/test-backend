export interface User {
   id: number;
   name: string;
   password: string;
   dateOfBirth: Date;
   address: string;
   description: string;
   deactivatedAt: Date;
   createdAt: Date;
   updatedAt: Date;
}

export const USER = 'user';