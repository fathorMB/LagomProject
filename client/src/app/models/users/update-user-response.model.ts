import { APIResponse } from "../abstracts/api-response.model";
import { User } from "./user.model";

export interface UpdateUserResponse extends APIResponse {
    user: User;
}