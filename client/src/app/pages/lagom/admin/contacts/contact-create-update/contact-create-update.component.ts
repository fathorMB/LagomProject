import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Contact } from 'src/app/models/contact.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'lagom-contact-create-update',
  templateUrl: './contact-create-update.component.html',
  styleUrls: ['./contact-create-update.component.scss'],
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
export class ContactCreateUpdateComponent implements OnInit {
  
  
  form = this.fb.group({
    id: this.defaults?.id,
    firstName: this.defaults?.firstName || '',
    lastName: this.defaults?.lastName || '',
    nick: this.defaults?.nick || '',
    email: this.defaults?.email || '',
    phoneNumber: this.defaults?.phoneNumber || ''
  });
  mode: 'create' | 'update' = 'create';

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: Contact | undefined,
    private dialogRef: MatDialogRef<ContactCreateUpdateComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (this.defaults) { this.mode = 'update'; } 
    else { this.defaults = {} as Contact; }

    this.form.patchValue(this.defaults);
  }

  save() {
    if (this.mode === 'create') { this.createContact(); } 
    else if (this.mode === 'update') { this.updateContact(); }
  }

  isCreateMode() { return this.mode === 'create'; }
  isUpdateMode() { return this.mode === 'update'; }

  createContact() {
    const contact = this.form.value;
    this.dialogRef.close(contact);
  }

  updateContact() {
    const contact = this.form.value;
    if (!this.defaults) { throw new Error('Contact ID does not exist, this contact cannot be updated');}

    contact.id = this.defaults.id;
    this.dialogRef.close(contact);
  }  
}

