import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lagom-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatDividerModule, MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  private readonly dialogRef: MatDialogRef<ConfirmationDialogComponent> = inject(MatDialogRef<ConfirmationDialogComponent>);  
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) {}  
  
  onConfirm(): void { this.dialogRef.close(true); }
  onCancel(): void { this.dialogRef.close(false); }
}
