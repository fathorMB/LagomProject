import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  // Set your API base URL here.
  private baseUrl: string = environment.apiEndpoint;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  // Helper method to create HTTP headers.
  private createHeaders(customHeaders?: { [header: string]: string }): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (customHeaders) {
      Object.keys(customHeaders).forEach(key => {
        headers = headers.set(key, customHeaders[key]);
      });
    }
    return headers;
  }

  // GET request method
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    if (!this.authService.isAuthenticated()) {      
      this.router.navigate(['/']);
      return throwError(() => new Error('User is not authenticated')); // Stop further processing
    }
    else {
      let authHeaders = { 'Authorization': 'Basic ' + this.authService.getToken() };    
      return this.http.get<T>(url, { headers: this.createHeaders(authHeaders), params })
        .pipe(catchError(this.handleError));
    }
  }

  // POST request method
  post<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    if (!this.authService.isAuthenticated()) {      
      this.router.navigate(['/']);
      return throwError(() => new Error('User is not authenticated')); // Stop further processing
    }
    else {
      let authHeaders = { 'Authorization': 'Basic ' + this.authService.getToken() };    
      return this.http.post<T>(url, body, { headers: this.createHeaders(authHeaders) })
        .pipe(catchError(this.handleError));
    }
  }

  // PUT request method
  put<T>(endpoint: string, body: any): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    if (!this.authService.isAuthenticated()) {      
      this.router.navigate(['/']);
      return throwError(() => new Error('User is not authenticated')); // Stop further processing
    }
    else {
      let authHeaders = { 'Authorization': 'Basic ' + this.authService.getToken() };    
      return this.http.put<T>(url, body, { headers: this.createHeaders(authHeaders) })
        .pipe(catchError(this.handleError));
    }
  }

  // DELETE request method
  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    if (!this.authService.isAuthenticated()) {      
      this.router.navigate(['/']);
      return throwError(() => new Error('User is not authenticated')); // Stop further processing
    }
    else {
      let authHeaders = { 'Authorization': 'Basic ' + this.authService.getToken() };    
      return this.http.delete<T>(url, { headers: this.createHeaders(authHeaders) })
      .pipe(catchError(this.handleError));
    }

  }

  // Error handling function
  private handleError(error: any) {
    // Log the error or display a notification
    console.error('NetworkService error:', error);
    return throwError(() => new Error('Network error, please try again later.'));
  }
}
