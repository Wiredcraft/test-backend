import { Document } from 'mongoose'

export interface IUserDocument extends Document {
  id: string,
  name: string,
  description: string,
  dob: string,
  createdAt: string,
  updatedAt: string,
}
