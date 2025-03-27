// auth.interceptor.ts
import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { APIResponse, BusinessServiceResponseStatus } from './models/abstracts/api-response.model';

/**
 * A function-based HttpInterceptor that uses the Angular inject() function
 * to retrieve dependencies.
 */
export const authInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  // 1. Inject dependencies **inside** the interceptor
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // 2. Clone the request to attach headers if authenticated
  let updatedRequest = req;
  if (authService.isAuthenticated()) {
    updatedRequest = req.clone({
      setHeaders: {
        Authorization: 'Basic ' + authService.getToken()
      }
    });
  }

  // 3. Forward the request and handle errors
  return next(updatedRequest).pipe(
    tap((event: HttpEvent<unknown>) => {
        // Only check actual HttpResponses (not in-progress events)
        if (event instanceof HttpResponse) {
          // Cast to your APIResponse type or just check relevant fields
          const body = event.body as APIResponse;
  
          // If it's one of your "successful" API responses and has a message
          if (body?.businessServiceMessages && body?.businessServiceStatus === BusinessServiceResponseStatus.Completed) {
            snackBar.open(body.businessServiceMessages[0], 'Close', { duration: 4000 });
          }
        }
    }),
    
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        router.navigate(['/']);
      }
      snackBar.open(
        error?.error?.message || 'Network error, please try again later.',
        'Close',
        { duration: 4000 }
      );
      return throwError(() => new Error(error.message));
    })
  );
};
