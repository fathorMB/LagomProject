import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/users/user.model';
import { NetworkService } from './network.service';
import { BusinessServiceResponse } from '../models/common/business-service-response.model';
import { CreateUserResponse } from '../models/users/create-user-response.model';
import { CreateUserRequest } from '../models/users/create-user-request.model';
import { ChangePasswordRequest } from '../models/users/change-password-request.model';
import { Claim } from '../models/users/claim.model';
import { UpdateUserResponse } from '../models/users/update-user-response.model';
import { UpdateUserRequest } from '../models/users/update-user-request.model';
import { UserToggleEnableResponse } from '../models/users/user-toggle-enable-response.model';
import { buildQueryString } from '../helpers/query-string-builder';

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
    const createUserRequest: CreateUserRequest = {
      user: user,
      password: password,
      requestId: ''
    };
    return this.networkService.post<CreateUserResponse>(this.route, createUserRequest);
  }

  updateUser(user: User) : Observable<UpdateUserResponse> {
    const updateUserRequest: UpdateUserRequest = {
      user: user,
      requestId: ''
    };
    return this.networkService.put<UpdateUserResponse>(this.route, updateUserRequest);
  }

  deleteUser(id: number): Observable<BusinessServiceResponse> {
    const queryString = buildQueryString(new URLSearchParams({ id: id.toString() }));
    return this.networkService.delete<BusinessServiceResponse>(this.route + queryString);
  }

  changePassword(userId: number, newPassword: string): Observable<BusinessServiceResponse> {
    const changePasswordRequest: ChangePasswordRequest = {
        userId: userId,
        newPassword: newPassword,
        requestId: ''
    }
    return this.networkService.post<BusinessServiceResponse>(this.route + '/change-password', changePasswordRequest);
  }

  getClaims(): Observable<Claim[]> {
    return this.networkService.get<Claim[]>(this.route + '/claims');
  }

  enableUser(id: number): Observable<UserToggleEnableResponse> {
    const queryString = buildQueryString(new URLSearchParams({ id: id.toString() }));
    return this.networkService.get<UserToggleEnableResponse>(this.route + '/enable' + queryString);
  }

  disableUser(id: number): Observable<UserToggleEnableResponse> {
    const queryString = buildQueryString(new URLSearchParams({ id: id.toString() }));
    return this.networkService.get<UserToggleEnableResponse>(this.route + '/disable' + queryString);
  }
}
