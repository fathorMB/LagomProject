import { APIRequest } from "../abstracts/api-request.model";

export interface ChangePasswordRequest extends APIRequest {
    userId: number;
    newPassword: string;
}