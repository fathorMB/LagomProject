import { Component, inject, Inject, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { LagomEvent } from 'src/app/models/lagom-events/lagom-event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lagom-calendar-create-update',
  standalone: true,
  imports: [
    CommonModule,
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
  
  public readonly titleInputFormControlName: string = 'title';
  public readonly startDatePickerFormControlName: string = 'start';
  public readonly endDatePickerFormControlName: string = 'end';

  minDate = new Date();   // today
  maxDate = new Date(2125, 0, 31);

  form = this.fb.group(
    {
      title: [null, Validators.required],
      start: [null, Validators.required],
      end: [null, Validators.required]
    },
    { validators: this.dateRangeValidator() }
  );
  
  constructor(@Inject(MAT_DIALOG_DATA) public event: CalendarEvent<LagomEvent>) {}

  ngOnInit() {
    this.form.patchValue(this.event);
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close({
        ...this.event,
        ...this.form.value
      });
    }
  }

  private dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const start = group.get(this.startDatePickerFormControlName)?.value;
      const end = group.get(this.endDatePickerFormControlName)?.value;
      return start && end && end < start ? { endBeforeStart: true } : null;
    };
  }
}
