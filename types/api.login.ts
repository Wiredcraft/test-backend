export interface ILoginParams {
    name: string
    password: string
}

export interface ITokenRes {
    accessToken: string
    refreshToken: string
}
export interface IDecryptToken {
    hash: string
    userId: string
}

