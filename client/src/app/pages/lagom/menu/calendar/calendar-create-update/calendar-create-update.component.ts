import { Component, inject, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { LagomEvent } from 'src/app/models/lagom-events/lagom-event.model';

@Component({
  selector: 'lagom-calendar-create-update',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './calendar-create-update.component.html',
  styleUrl: './calendar-create-update.component.scss'
})
export class CalendarCreateUpdateComponent implements OnInit {
  private readonly fb: UntypedFormBuilder = inject(UntypedFormBuilder);
  private readonly dialogRef: MatDialogRef<CalendarCreateUpdateComponent> = inject(MatDialogRef<CalendarCreateUpdateComponent>);
  
  form = this.fb.group({
    title: null,
    start: null,
    end: null
  });
  
  constructor(@Inject(MAT_DIALOG_DATA) public event: CalendarEvent<LagomEvent>) {}

  ngOnInit() {
    this.form.patchValue(this.event);
  }

  save() {
    this.dialogRef.close({
      ...this.event,
      ...this.form.value
    });
  }
}
