import { APIRequest } from "../abstracts/api-request.model";
import { User } from "./user.model";

export interface UpdateUserRequest extends APIRequest {
    user: User;
}