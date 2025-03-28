import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarManagerService {
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);  
  private readonly actionButtonText: string = 'Close';
  private readonly successClass: string = 'green-snackbar';
  private readonly warningClass: string = 'yellow-snackbar';
  private readonly errorClass: string = 'red-snackbar';
  
  show(message: string, durationInSeconds: number = 3): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, this.actionButtonText, {
      duration: durationInSeconds * 1000,
      horizontalPosition: 'end'      
    });
  }

  showSuccess(message: string, durationInSeconds: number = 3): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, this.actionButtonText, {
      duration: durationInSeconds * 1000,
      horizontalPosition: 'end',
      panelClass: [this.successClass]
    });
  }

  showWarning(message: string, durationInSeconds: number = 3): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, this.actionButtonText, {
      duration: durationInSeconds * 1000,
      horizontalPosition: 'end',
      panelClass: [this.warningClass]
    });
  }

  showError(message: string, durationInSeconds: number = 3): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackBar.open(message, this.actionButtonText, {
      duration: durationInSeconds * 1000,
      horizontalPosition: 'end',
      panelClass: [this.errorClass]
    });
  }
}
