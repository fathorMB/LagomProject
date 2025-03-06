// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // In a real app, this might be replaced by a BehaviorSubject or an API call.
  isAuthenticated(): boolean {
    // For example, check if a token exists in localStorage.
    return !!localStorage.getItem('authToken');
  }
}
