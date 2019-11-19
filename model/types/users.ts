export interface IUser {
    name: string,
    dob: string,
    age: number,
    address: string,
    loc:string[],
    description: string,
    following: string[],
    followers: string[],
    salt: string,
    hash: string,
}