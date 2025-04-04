import {
  Component,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
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
import {
  endOfDay,
  isSameDay,
  isSameMonth
} from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';
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
import { CalendarHelper } from './calendar-helper';

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

  @ViewChild('modalContent', { static: true }) modalContent?: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  actions: CalendarEventAction[] = [
    {
      label: '<span class="material-icons text-primary-600">edit</span> ',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<span class="material-icons text-primary-600">groups</span> ',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Contacts', event);
      }
    },
    {
      label: '<span class="material-icons text-primary-600">content_paste_search</span> ',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('BillOfMaterials', event);
      }
    },    
    {
      label: '<span class="material-icons text-primary-600">delete</span> ',
      onClick: ({ event }: { event: CalendarEvent }): void => {        
        this.handleEvent('Deleted', event);        
      }
    }
  ];
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;                                

  ngOnInit(): void {
    this.refreshCalendarEvents();
  }

  setView(view: CalendarView) { this.view = view; }
  closeOpenMonthViewDay() { this.activeDayIsOpen = false; }    

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen) || events.length === 0);
      this.viewDate = date;
    }
    
    // If no events are present, open the dialog to create a new event
    if (events.length === 0) {
      this.openCreateEventDialog(date);
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {    
    const oldStart = event.start;
    const oldEnd = event.end;    
    event.start = newStart;
    event.end = newEnd;
    this.dialog.open(CalendarEditComponent, { data: event })
          .afterClosed()
          .subscribe((updatedEvent) => {
            if (updatedEvent) {
              CalendarHelper.updateMetaLagomEventFromCalendarEvent(updatedEvent);   // important to reflect changes from calendar event to lagom event as property of calendar-event.meta
              this.updateEvent(updatedEvent);
              
              if (isSameMonth(updatedEvent.start, this.viewDate)) {
                this.activeDayIsOpen = !((isSameDay(this.viewDate, updatedEvent.start) && this.activeDayIsOpen));
                this.viewDate = updatedEvent.start;
              }
            } else {
              // If the user cancels the dialog, revert the changes to the event's start and end times
              event.start = oldStart;
              event.end = oldEnd;          
            }
          });
  }

  openCreateEventDialog(date: Date): void {
    // Open a dialog to create a new event
    this.dialog.open(CalendarEditComponent, { data: { title: 'Nuovo Evento...', start: date, end: date } })
      .afterClosed()
      .subscribe((newEvent) => {        
          if (newEvent) {
          this.addEvent(newEvent);            
          this.activeDayIsOpen = !(isSameDay(this.viewDate, newEvent.start) && this.activeDayIsOpen);
          this.viewDate = newEvent.start;
        }
    });
  }  

  handleEvent(action: string, event: CalendarEvent): void {
    switch(action) {
      case 'Clicked':
      case 'Edited':     
        this.dialog.open(CalendarEditComponent, { data: event })
          .afterClosed()
          .subscribe((updatedEvent) => {
            if (updatedEvent) {
              CalendarHelper.updateMetaLagomEventFromCalendarEvent(updatedEvent);   // important to reflect changes from calendar event to lagom event as property of calendar-event.meta
              this.updateEvent(updatedEvent);
              
              if (isSameMonth(updatedEvent.start, this.viewDate)) {
                this.activeDayIsOpen = !((isSameDay(this.viewDate, updatedEvent.start) && this.activeDayIsOpen));
                this.viewDate = updatedEvent.start;
              }
            }            
          });
        break;
      case 'Deleted':
        this.deleteEvent(event);
        break;
      case 'Contacts':
        // Handle contacts action
        this.snackBarManager.show('Contacts action triggered! ' + event.meta.name);
        break;
      case 'BillOfMaterials':
        // Handle bill of materials action
        this.snackBarManager.show('Bill of Materials action triggered! ' + event.meta.name);
        break;
      default: break;     
    }
  }
    
  addEvent(newCalendarEvent: CalendarEvent): void {
    newCalendarEvent.id = CalendarHelper.getNextId(); // Assign a temporary ID from the mock data
    newCalendarEvent.meta = {
      id: newCalendarEvent.id, // Assign the ID to the meta property
      name: newCalendarEvent.title || 'New Event',
      location: 'Default',
      start: newCalendarEvent.start,
      end: newCalendarEvent.end || endOfDay(newCalendarEvent.start),
      contacts: [], // Placeholder for contacts
      billOfMaterials: [] // Placeholder for bill of materials
    } as LagomEvent;            

    this.lagomEventsService
      .addLagomEvent(newCalendarEvent.meta as LagomEvent)
      .subscribe((response) => {
      if (response.businessServiceStatus ===  BusinessServiceResponseStatus.Completed) {
        this.snackBarManager.showSuccess(response.businessServiceMessages[0]);
        this.refreshCalendarEvents();
      } else {
        this.snackBarManager.showError(response.businessServiceMessages.join(', '));
      }
    });
  }

  updateEvent(eventToUpdate: CalendarEvent) {
    const lagomEvent = eventToUpdate.meta as LagomEvent;
    this.lagomEventsService
      .updateLagomEvent(lagomEvent)
      .subscribe((response) => {
        if (response.businessServiceStatus === BusinessServiceResponseStatus.Completed) {
          this.snackBarManager.showSuccess(response.businessServiceMessages[0]);
          this.refreshCalendarEvents();
        } else {
          this.snackBarManager.showError(response.businessServiceMessages.join(', '));
        }
      });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    const lagomEvent = eventToDelete.meta as LagomEvent;
    this.lagomEventsService
      .deleteLagomEvent(lagomEvent.id)
      .subscribe((response) => {
        if (response.businessServiceStatus === BusinessServiceResponseStatus.Completed) {
          this.snackBarManager.showSuccess(response.businessServiceMessages[0]);
          this.refreshCalendarEvents();
        } else {
          this.snackBarManager.showError(response.businessServiceMessages.join(', '));
        }
      });
  }
  
  private refreshCalendarEvents(): void {
    this.lagomEventsService.getLagomEvents().subscribe((lagomEvents) => {
      this.events = lagomEvents.map((lagomEvent) => CalendarHelper.mapLagomEventToCalendarEvent(lagomEvent, this.actions));
      this.refresh.next(null);
    });
  }  
}
