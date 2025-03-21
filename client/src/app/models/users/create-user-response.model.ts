import { APIResponse } from '../abstracts/api-response.model';
import { User } from './user.model';

export interface CreateUserResponse extends APIResponse {
  user: User;
}
