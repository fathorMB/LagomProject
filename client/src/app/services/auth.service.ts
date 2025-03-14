// auth.service.ts
import { Injectable } from '@angular/core';
import { AuthenticateRequest } from '../models/authenticate-request.model';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticateResponse } from '../models/authenticate-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    // For example, check if a token exists in localStorage.
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  authenticate(authenticateRequest: AuthenticateRequest) : Observable<AuthenticateResponse> {
    return this.http.post<AuthenticateResponse>(environment.apiEndpoint + '/users/authenticate', authenticateRequest)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // Log the error or display a notification
    console.error('Auth error:', error);
    return throwError(() => new Error('Auth error, please try again later.'));
  }
}
