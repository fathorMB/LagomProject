// auth.service.ts
import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';
import { AuthenticateRequest } from '../models/authenticate-request.model';
import { Observable } from 'rxjs';
import { AuthenticateResponse } from '../models/authenticate-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private networkService: NetworkService) {}

  isAuthenticated(): boolean {
    // For example, check if a token exists in localStorage.
    return !!localStorage.getItem('authToken');
  }

  authenticate(authenticateRequest: AuthenticateRequest) : Observable<AuthenticateResponse> {
    return this.networkService.post<AuthenticateResponse>('users/authenticate', authenticateRequest);
  }
}
