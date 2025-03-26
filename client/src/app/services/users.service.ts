import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/users/user.model';
import { NetworkService } from './network.service';
import { BusinessServiceResponse } from '../models/common/business-service-response.model';
import { QueryStringBuilder } from '../helpers/query-string-builder';
import { CreateUserResponse } from '../models/users/create-user-response.model';
import { CreateUserRequest } from '../models/users/create-user-request.model';
import { ChangePasswordRequest } from '../models/users/change-password-request.model';
import { Claim } from '../models/users/claim.model';
import { BusinessServiceResponseStatus } from '../models/abstracts/api-response.model';

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

  updateUser(user: User) : Observable<BusinessServiceResponse> {
    //TODO: Implement this method with the related http request to the backend
    return new Observable<BusinessServiceResponse>(observer => {
      observer.next({  
        requestId: '',
        responseId: '',
        businessServiceStatus: BusinessServiceResponseStatus.Completed,
        businessServiceMessages: []
      });
      observer.complete();
    });
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

  getClaims(): Claim[] {
    //TODO: Implement this method with the related http request to the backend
    return [
      {
        id: '1',
        name: 'admin',
        description: 'Full control'
      },
      {
        id: '2',
        name: 'example',
        description: 'Can run example controller routes'
      },
      {
        id: '3',
        name: 'data-operator',
        description: 'Can run CRUD and service operations on data'
      }
    ];
  }
}
