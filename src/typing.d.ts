declare module '@env' {
    export const SALT_KEY: string
    export const BACKEND_URL: string
}
declare module '*.png' {
    const value: any
    export = value
}

declare namespace NodeJS {
    interface env {
        //types of envs
        NODE_ENV: 'development' | 'production' | 'test'
        PUBLIC_URL: string
    }
}
