import { ChangeDetectorRef, Component, inject, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { User } from 'src/app/models/users/user.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'lagom-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf
  ]
})
export class ChangePasswordComponent {
  form = this.fb.group({
    newPassword: ['', Validators.required]
  });
  inputType = 'password';
  visible = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {}

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

  save() {
    const newPassword = this.form.value.newPassword;
    this.dialogRef.close(newPassword);
  }
}

