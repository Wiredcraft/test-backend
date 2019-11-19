import { IUser } from "../model/types/users";

export interface ICreateUserParams {
    name: string,
    dob?: string,
    age?: number,
    address?: string,
    description?: string
    password: string
}
export interface ISaveUserParams {
    name: string,
    dob?: string,
    age?: number,
    address?: string,
    description?: string
    salt: string
    hash: string
}

export interface ICreateUserResponse {
    _id: string
    name?: string,
    dob?: string,
    age?: number,
    address?: string,
    description?: string
}

export interface IRemoveUserParams {
    _id: string
}

export interface IUpdateUserParams {
    _id: string
    name?: string,
    dob?: string,
    age?: number,
    address?: string,
    description?: string,
    password?: string
}

export interface IFlowUserParams {
    targetId: string
}