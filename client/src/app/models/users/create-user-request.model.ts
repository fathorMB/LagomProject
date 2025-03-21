import { APIRequest } from "../abstracts/api-request.model";
import { User } from "./user.model";

export interface CreateUserRequest extends APIRequest {
    user: User;
    password: string;
}