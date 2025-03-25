import { CommonModule, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
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
  form = this.fb.group({
    id: [this.defaults?.id],
    username: [this.defaults?.username || ''],
    firstName: [this.defaults?.firstName || ''],
    lastName: [this.defaults?.lastName || ''],
    isActive: [this.defaults?.isActive],
    claims: new FormControl<string[]>([])  // Store ids in the form control
  });
  mode: 'create' | 'update' = 'create';

  allClaims: Claim[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: User | undefined,
    private dialogRef: MatDialogRef<UserCreateUpdateComponent>,
    private fb: FormBuilder,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.usersService
      .getClaims()
      .subscribe(claims => { 
        this.allClaims = claims;

        // Pre-select claims by setting the value of the 'claims' form control to an array of claim IDs
        if (this.defaults?.claims) {
          const preselectedClaimIds = this.defaults.claims.map(claim => claim.id);
        this.form.controls.claims.setValue(preselectedClaimIds);
        }
      });

    if (this.defaults) { 
      this.mode = 'update'; 
    } 
    else { this.defaults = {} as User; }

    // Apply defaults to form, but handle claims separately (set value already done)
    this.form.patchValue({
      id: this.defaults?.id,
      username: this.defaults?.username || '',
      firstName: this.defaults?.firstName || '',
      lastName: this.defaults?.lastName || '',
      isActive: this.defaults?.isActive,
    });     
  }

  save() {
    if (this.mode === 'create') { this.createUser(); } 
    else if (this.mode === 'update') { this.updateUser(); }
  }

  isCreateMode() { return this.mode === 'create'; }
  isUpdateMode() { return this.mode === 'update'; }

  createUser() {
    const user = {} as User;
    user.id = 0;
    user.username = this.form.value.username || '';
    user.firstName = this.form.value.firstName || '';
    user.lastName = this.form.value.lastName || ''; 
    user.isActive = this.form.value.isActive || false;
    user.claims = this.allClaims.filter(claim => {
      if(this.form.value.claims) return this.form.value.claims.includes(claim.id); 
      else return false;
    });  
    
    this.dialogRef.close({ user: user, password: '' });
  }

  updateUser() {
    if (!this.defaults) { throw new Error('User ID does not exist, this user cannot be updated');}
    
    const user = {} as User;
    user.id = this.defaults.id;
    user.username = this.form.value.username || '';
    user.firstName = this.form.value.firstName || '';
    user.lastName = this.form.value.lastName || ''; 
    user.isActive = this.form.value.isActive || false;
    user.claims = this.allClaims.filter(claim => {
      if(this.form.value.claims) return this.form.value.claims.includes(claim.id); 
      else return false;
    });  

    this.dialogRef.close(user);
  }  

  // Method to get claim object by ID
  getClaimById(claimId: string) {
    return this.allClaims.find(claim => claim.id === claimId);
  }
}


