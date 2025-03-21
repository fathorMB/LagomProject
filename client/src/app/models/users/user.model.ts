import { Claim } from "./claim.model";

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    claims?: Claim[];
  }