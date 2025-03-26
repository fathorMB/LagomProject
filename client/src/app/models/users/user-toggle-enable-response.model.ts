import { APIResponse } from "../abstracts/api-response.model";
import { User } from "./user.model";

export interface UserToggleEnableResponse extends APIResponse {
  user: User;
}