import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { User } from 'src/app/models/users/user.model';

@Component({
  selector: 'lagom-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class UserCreateComponent implements OnInit {
  form = this.fb.group({
    id: this.defaults?.id,
    username: this.defaults?.username || '',
    firstName: this.defaults?.firstName || '',
    lastName: this.defaults?.lastName || '',    
    isActive: this.defaults?.isActive,
    claims: this.defaults?.claims || null
    });

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: User | undefined,
    private dialogRef: MatDialogRef<UserCreateComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if(!this.defaults) { this.defaults = {} as User; }
    this.form.patchValue({...this.defaults, claims: this.defaults?.claims ? this.defaults.claims : null });
  }

  createUser() {
    const user = this.form.value;
    user.id = 0;
    this.dialogRef.close({user: user, password: '' });
  }  

  save() {}
}

