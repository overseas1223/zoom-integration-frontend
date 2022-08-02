import { Roles } from "./roles";

export interface User {
  uid: string
  email: string
  displayName: string
  photoUrl: string
  emailVerified: boolean,
  admin: boolean
}
