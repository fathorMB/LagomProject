import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/users/user.model';
import { NetworkService } from './network.service';
import { BusinessServiceResponse } from '../models/common/business-service-response.model';
import { QueryStringBuilder } from '../helpers/query-string-builder';
import { CreateUserResponse } from '../models/users/create-user-response.model';
import { CreateUserRequest } from '../models/users/create-user-request.model';
import { ChangePasswordRequest } from '../models/users/change-password-request.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly networkService = inject(NetworkService);
  private readonly route = 'users';

  getUsers(): Observable<User[]> {
    return this.networkService.get<User[]>(this.route + '/all');
  }

  addUser(user: User, password: string): Observable<CreateUserResponse> {
    var createUserRequest: CreateUserRequest = {
      user: user,
      password: password,
      requestId: ''
    };
    return this.networkService.post<CreateUserResponse>(this.route, createUserRequest);
  }

  deleteUser(id: number): Observable<BusinessServiceResponse> {
    var queryString = QueryStringBuilder.build(new URLSearchParams({ id: id.toString() }));
    return this.networkService.delete<BusinessServiceResponse>(this.route + queryString);
  }

  changePassword(userId: number, newPassword: string): Observable<BusinessServiceResponse> {
    var changePasswordRequest: ChangePasswordRequest = {
        userId: userId,
        newPassword: newPassword,
        requestId: ''
    }
    return this.networkService.post<BusinessServiceResponse>(this.route + '/change-password', changePasswordRequest);
  }
}
