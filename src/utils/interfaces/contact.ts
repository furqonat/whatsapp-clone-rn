import { IUser } from "./user";

type IContact = Pick<IUser, | 'displayName' | 'phoneNumber' | 'uid' | 'email'> 

export { IContact }