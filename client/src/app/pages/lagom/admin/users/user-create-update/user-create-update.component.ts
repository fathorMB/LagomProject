import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Claim } from 'src/app/models/users/claim.model';
import { User } from 'src/app/models/users/user.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'lagom-contact-create-update',
  templateUrl: './user-create-update.component.html',
  styleUrls: ['./user-create-update.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule
  ]
})
export class UserCreateUpdateComponent implements OnInit {
  mode: 'create' | 'update' = 'create';
  form = this.fb.group({
    id: [this.defaults?.id],
    username: [this.defaults?.username || ''],
    firstName: [this.defaults?.firstName || ''],
    lastName: [this.defaults?.lastName || ''],
    isActive: [this.defaults?.isActive],
    claims: [this.defaults?.claims || []],
    ...(this.mode === 'create' ? { password: ['', Validators.required] } : {})
  });

  allClaims: Claim[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: User | undefined,
    private dialogRef: MatDialogRef<UserCreateUpdateComponent>,
    private fb: FormBuilder,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.allClaims = this.usersService.getClaims();

    if (this.defaults) { 
      this.mode = 'update'; 

      this.form.patchValue({
        ...this.defaults,
        claims: this.defaults.claims?.map(claim =>
          this.allClaims.find(c => c.id === claim.id)
        ).filter((claim): claim is Claim => claim !== undefined)
      });
    } 
    else { this.defaults = {} as User; }

    this.form.patchValue(this.defaults);
  }  

  isCreateMode() { return this.mode === 'create'; }
  isUpdateMode() { return this.mode === 'update'; }

  /* To string is required because one id value is number and the other is string, both are declared stings by the interface Claim, 
     maybe with the http call instead of the fakeo one to allclaims the problem will be fixed */
  compareClaims(c1: Claim, c2: Claim): boolean { return c1.id.toString() === c2.id.toString(); }

  createUser() {
    const user = this.form.value;    
    user.id = 0;    
    this.dialogRef.close({ user: user, password: user.password || '' });
  }

  updateUser() {
    if (!this.defaults) { throw new Error('User ID does not exist, this user cannot be updated');}

    const user = this.form.value;
    user.id = this.defaults.id;    
    this.dialogRef.close(user);
  }    

  save() {
    if (this.mode === 'create') { this.createUser(); } 
    else if (this.mode === 'update') { this.updateUser(); }
  }
}
