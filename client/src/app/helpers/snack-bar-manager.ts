import { MatSnackBar } from "@angular/material/snack-bar";
import { Action } from "rxjs/internal/scheduler/Action";

export class SnackBarManager {
    private static actionButtonText: string = 'Close';

    static showSuccess(message: string, seconds: number, snackBar: MatSnackBar): void {
        snackBar.open(message, this.actionButtonText, {
            duration: seconds * 1000,
            horizontalPosition: 'end',
            panelClass: ['green-snackbar']
        });
    }

    static showWarning(message: string, seconds: number, snackBar: MatSnackBar): void {
        snackBar.open(message, this.actionButtonText, {
            duration: seconds * 1000,
            horizontalPosition: 'end',
            panelClass: ['yellow-snackbar']
        });
    }

    static showError(message: string, seconds: number, snackBar: MatSnackBar): void {
        snackBar.open(message, this.actionButtonText, {
            duration: seconds * 1000,
            horizontalPosition: 'end',
            panelClass: ['red-snackbar']
        });
    }
}