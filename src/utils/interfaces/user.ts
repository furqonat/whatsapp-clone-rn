interface IUser {
    uid: string | null,
    email?: string | null,
    displayName?: string | null,
    photoURL?: string | null,
    phoneNumber?: string | null,
    isIDCardVerified?: boolean | null,
    emailVerified?: boolean | null,
}
export { IUser }