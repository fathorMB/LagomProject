import { APIResponse } from "./abstracts/api-response.model";
import { User } from "./user.model";

export interface AuthenticateResponse extends APIResponse {
    token: string;
    user: User;
  }