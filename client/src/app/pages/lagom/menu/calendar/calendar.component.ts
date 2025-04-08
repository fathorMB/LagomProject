import { Component, inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { endOfDay, isSameDay, isSameMonth, startOfDay } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CalendarCreateUpdateComponent } from './calendar-create-update/calendar-create-update.component';
import { CommonModule, NgSwitch, NgSwitchCase } from '@angular/common';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { VexBreadcrumbsComponent } from "../../../../../@vex/components/vex-breadcrumbs/vex-breadcrumbs.component";
import { VexPageLayoutHeaderDirective } from "../../../../../@vex/components/vex-page-layout/vex-page-layout-header.directive";
import { VexPageLayoutComponent } from "../../../../../@vex/components/vex-page-layout/vex-page-layout.component";
import { LagomEventsService } from 'src/app/services/lagom-events.service';
import { SnackBarManagerService } from 'src/app/services/snack-bar-manager.service';
import { LagomEvent } from 'src/app/models/lagom-events/lagom-event.model';
import { BusinessServiceResponseStatus } from 'src/app/models/abstracts/api-response.model';
import {
  CalendarA11y,
  CalendarCommonModule,
  CalendarDateFormatter,
  CalendarDayModule,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarModule,
  CalendarMonthModule,
  CalendarUtils,
  CalendarView,
  CalendarWeekModule,
  DateAdapter
} from 'angular-calendar';
import { CalendarHelper } from './calendar-helper';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'lagom-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatButtonModule,
    CommonModule,
    CalendarCommonModule,
    MatIconModule,
    VexScrollbarComponent,
    NgSwitch,
    NgSwitchCase,
    CalendarMonthModule,
    CalendarWeekModule,
    CalendarDayModule,
    CalendarModule,
    MatSnackBarModule,
    VexBreadcrumbsComponent,
    VexPageLayoutHeaderDirective,
    VexPageLayoutComponent
  ],
  providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory
    },
    CalendarEventTitleFormatter,
    CalendarDateFormatter,
    CalendarUtils,
    CalendarA11y
  ]
})
export class CalendarComponent implements OnInit {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly lagomEventsService: LagomEventsService = inject(LagomEventsService);
  private readonly snackBarManager: SnackBarManagerService = inject(SnackBarManagerService);

  private readonly newEventDefaultTitle: string = 'Nuovo Evento';

  @ViewChild('modalContent', { static: true }) modalContent?: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  actions: CalendarEventAction[] = [
    {
      id: CalendarHelper.ACTION_LABEL_IDS.edit,
      label: '<span class="material-icons text-primary-600">edit</span> ',
      onClick: ({ event }: { event: CalendarEvent<LagomEvent> }): void => { this.calendarEventEditAction(event); }
    },
    {
      id: CalendarHelper.ACTION_LABEL_IDS.contacts,
      label: '<span class="material-icons text-primary-600">groups</span> ',
      onClick: ({ event }: { event: CalendarEvent<LagomEvent> }): void => { this.calendarEventContactsAction(event); }
    },
    {
      id: CalendarHelper.ACTION_LABEL_IDS.billOfMaterials,
      label: '<span class="material-icons text-primary-600">content_paste_search</span> ',
      onClick: ({ event }: { event: CalendarEvent<LagomEvent> }): void => { this.calendarEventBillOfMaterialsAction(event); }
    },
    {
      id: CalendarHelper.ACTION_LABEL_IDS.delete,
      label: '<span class="material-icons text-primary-600">delete</span> ',
      onClick: ({ event }: { event: CalendarEvent<LagomEvent> }): void => { this.calendarEventDeleteAction(event); }
    }
  ];
  events: CalendarEvent<LagomEvent>[] = [];
  activeDayIsOpen = false;

  ngOnInit(): void { this.refreshCalendarEvents(); }

  setView(view: CalendarView) { this.view = view; }
  closeOpenMonthViewDay() { this.activeDayIsOpen = false; }    

  dayClicked({ date, events }: { date: Date; events: CalendarEvent<LagomEvent>[]; }): void {
    if (events.length === 0) { this.openCalendarCreateUpdateDialog({ title: this.newEventDefaultTitle, start: date, end: date }); }
    else { this.handleActiveDayEventsView(date); }
  }  
  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    const oldStart = event.start;
    const oldEnd = event.end;
    event.start = newStart;
    event.end = newEnd;    
    this.openCalendarCreateUpdateDialog(event, { start: oldStart, end: oldEnd! });        
  }
  calendarEventAddButtonClicked(): void { this.openCalendarCreateUpdateDialog({ title: this.newEventDefaultTitle, start: this.viewDate, end: this.viewDate }); }
  calendarEventClicked(event: CalendarEvent<LagomEvent>): void { this.openCalendarCreateUpdateDialog(event); }
  calendarEventEditAction(event: CalendarEvent<LagomEvent>): void { this.openCalendarCreateUpdateDialog(event); }
  calendarEventDeleteAction(event: CalendarEvent<LagomEvent>): void { this.openDeleteConfirmationDialog(event); }
  calendarEventContactsAction(event: CalendarEvent<LagomEvent>): void { /* TODO */ this.snackBarManager.show('Contacts action triggered! ' + event.meta?.name); }
  calendarEventBillOfMaterialsAction(event: CalendarEvent<LagomEvent>): void { /* TODO */  this.snackBarManager.show('Bill of Materials action triggered! ' + event.meta?.name); }  

  addEvent(calendarEvent: CalendarEvent<LagomEvent>): void {
    calendarEvent.id = CalendarHelper.getNextId(); // Assign mock ID
    calendarEvent.meta = {
      id: calendarEvent.id as number,
      name: calendarEvent.title || this.newEventDefaultTitle,
      location: '',
      start: calendarEvent.start,
      end: calendarEvent.end || endOfDay(calendarEvent.start),
      contacts: [], // Placeholder for contacts
      billOfMaterials: ['a', 'b', 'c'] // Placeholder for bill of materials to test new events with "correct biil of materials"
    } as LagomEvent;    

    this.lagomEventsService.addLagomEvent(calendarEvent.meta!).subscribe((response) => {
        if (response.businessServiceStatus === BusinessServiceResponseStatus.Completed) {
          this.snackBarManager.showSuccess(response.businessServiceMessages[0]);
          this.refreshCalendarEvents(() => this.handleActiveDayEventsView(response.lagomEvent.start, true));
        } else { this.snackBarManager.showError(response.businessServiceMessages.join(', ')); }
      });
  }
  updateEvent(calendarEventToUpdate: CalendarEvent<LagomEvent>) {
    this.lagomEventsService.updateLagomEvent(calendarEventToUpdate.meta!).subscribe((response) => {
        if (response.businessServiceStatus === BusinessServiceResponseStatus.Completed) {
          this.snackBarManager.showSuccess(response.businessServiceMessages[0]);
          this.refreshCalendarEvents(() => this.handleActiveDayEventsView(response.lagomEvent.start));
        } else { this.snackBarManager.showError(response.businessServiceMessages.join(', ')); }
      });
  }
  deleteEvent(calendarEventToDelete: CalendarEvent<LagomEvent>) {
    this.lagomEventsService.deleteLagomEvent(calendarEventToDelete.meta!.id).subscribe((response) => {
        if (response.businessServiceStatus === BusinessServiceResponseStatus.Completed) {
          this.snackBarManager.showSuccess(response.businessServiceMessages[0]);
          this.refreshCalendarEvents(() => this.handleActiveDayEventsView(calendarEventToDelete.start));
        } else { this.snackBarManager.showError(response.businessServiceMessages.join(', ')); }
      });
  }
    
  private openCalendarCreateUpdateDialog(eventData: CalendarEvent<LagomEvent>, oldTimes?: { start: Date; end: Date }): void {
    this.dialog.open(CalendarCreateUpdateComponent, { data: eventData })
      .afterClosed()
      .subscribe((result: CalendarEvent<LagomEvent> | undefined) => {
        if (result) {
          if(result.meta) {
            result.meta.name = result.title || result.meta.name;
            result.meta.start = result.start || result.meta.start;
            result.meta.end = result.end || result.meta.end;
            this.updateEvent(result);
          } else { 
            this.addEvent(result); 
          }
        } else if (oldTimes) {  // If the user cancels the dialog, revert the changes to the event's start and end times
          eventData.start = oldTimes.start;
          eventData.end = oldTimes.end;          
          this.refresh.next(null);  // refresh the calendar view to reflect the reverted times without calling the API
        }
      });
  }
  private openDeleteConfirmationDialog(eventData: CalendarEvent<LagomEvent>) : void {
    const title: string = 'Elimina Evento';
    const message: string = `Confermi di voler eliminare l\'evento ${eventData.title} ?`;
    this.dialog.open(ConfirmationDialogComponent, { data: { title: title, message: message } })
      .afterClosed()
      .subscribe((confirmationResult) => {
        if(confirmationResult) {
          this.deleteEvent(eventData);
        }
      });
  }
  private refreshCalendarEvents(afterRefresh?: () => void): void {
    this.lagomEventsService.getLagomEvents().subscribe((lagomEvents) => {
      this.events = lagomEvents.map((lagomEvent) => CalendarHelper.mapLagomEventToCalendarEvent(lagomEvent, this.actions));
      this.refresh.next(null);  // Trigger a refresh of the calendar view
      if(afterRefresh) { setTimeout(() => afterRefresh()); } // Call the afterRefresh function if provided
    });
  }
  private handleActiveDayEventsView (date: Date, forceOpen: boolean = false): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = forceOpen || !(isSameDay(this.viewDate, date) && this.activeDayIsOpen) && this.getEventsCountOnSameDay(date) > 0;
      this.viewDate = date;
    }
  }
  private getEventsCountOnSameDay(date: Date): number {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    return this.events.filter(ev => {
      const evStart = ev.start;
      const evEnd = ev.end || ev.start;
      return evStart <= dayEnd && evEnd >= dayStart;
    }).length;
  }   
}
