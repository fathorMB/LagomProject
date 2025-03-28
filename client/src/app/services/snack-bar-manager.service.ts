import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarManagerService {
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly actionButtonText: string = 'Close';
  private readonly successClass: string = 'green-snackbar';
  private readonly warningClass: string = 'yellow-snackbar';
  private readonly errorClass: string = 'red-snackbar';

  showSuccess(message: string, seconds: number = 3): void {
    this.snackBar.open(message, this.actionButtonText, {
      duration: seconds * 1000,
      horizontalPosition: 'end',
      panelClass: [this.successClass]
    });
  }

  showWarning(message: string, seconds: number = 3): void {
    this.snackBar.open(message, this.actionButtonText, {
      duration: seconds * 1000,
      horizontalPosition: 'end',
      panelClass: [this.warningClass]
    });
  }

  showError(message: string, seconds: number = 3): void {
    this.snackBar.open(message, this.actionButtonText, {
      duration: seconds * 1000,
      horizontalPosition: 'end',
      panelClass: [this.errorClass]
    });
  }
}
