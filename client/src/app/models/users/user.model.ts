import { Claim } from "./claim.model";

export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    claims?: Claim[];
  }