import { APIRequest } from "./abstracts/api-request.model";

export interface AuthenticateRequest extends APIRequest {
    username: string;
    password: string;
  }