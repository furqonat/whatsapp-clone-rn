interface IUser {
    uid: string
    email?: string | null
    displayName?: string | null
    photoURL?: string | null
    phoneNumber?: string | null
    isIDCardVerified?: boolean | null
    emailVerified?: boolean | null
    status: 'online' | 'typing' | string
}
export { IUser }
