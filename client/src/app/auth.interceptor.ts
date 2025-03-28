// auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { APIResponse,  BusinessServiceResponseStatus } from './models/abstracts/api-response.model';
import { SnackBarManagerService } from './services/snack-bar-manager.service';

/**
 * A function-based HttpInterceptor that uses the Angular inject() function
 * to retrieve dependencies.
 */
export const authInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  // 1. Inject dependencies **inside** the interceptor
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBarManager = inject(SnackBarManagerService);

  // 2. Clone the request to attach headers if authenticated
  let updatedRequest = req;
  if (authService.isAuthenticated()) {
    updatedRequest = req.clone({
      setHeaders: { Authorization: 'Basic ' + authService.getToken() }
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
          snackBarManager.showSuccess(body.businessServiceMessages[0]);
        }

        // If it's one of your "completed with error" API responses and has a message
        if (body?.businessServiceMessages && body?.businessServiceStatus === BusinessServiceResponseStatus.CompletedWithErrors) {
          snackBarManager.showWarning(body.businessServiceMessages[0]);
        }

        // If it's one of your "error" API responses and has a message
        if (body?.businessServiceMessages && body?.businessServiceStatus === BusinessServiceResponseStatus.Error) {
          snackBarManager.showError(body.businessServiceMessages[0]);
        }
      }
    }),

    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        router.navigate(['/']);
      }
      snackBarManager.showError(error?.error?.message || 'Network error, please try again later.');
      return throwError(() => new Error(error.message));
    })
  );
};
