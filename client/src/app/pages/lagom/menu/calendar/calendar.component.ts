import {
  Component,
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
  isSameMonth,
  startOfDay
} from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';
import { NgSwitch, NgSwitchCase } from '@angular/common';
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
  @ViewChild('modalContent', { static: true }) modalContent?: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh: Subject<any> = new Subject();
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];
  events: CalendarEvent[] = [];
  activeDayIsOpen = true;

  constructor(
    private dialog: MatDialog,
    private lagomEventsService: LagomEventsService,
    private snackBarManager: SnackBarManagerService
  ) {}

  ngOnInit(): void {
    this.refreshCalendarEvents();
  }

  refreshCalendarEvents(): void {
    this.lagomEventsService.getLagomEvents().subscribe((lagomEvents) => {
      this.events = lagomEvents.map((lagomEvent) => CalendarHelper.mapLagomToCalendarEvent(lagomEvent));
      this.refresh.next(null);
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !(
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen) ||
        events.length === 0
      );
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    const dialogRef = this.dialog.open(CalendarEditComponent, {
      data: event
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        event = result;
        this.snackBarManager.show('Updated Event: ' + event.title);
        this.refresh.next(null);
      }
    });
  }

  addEvent(): void {
    const newEvent: LagomEvent = {
      id: Date.now(),
      name: 'New Event',
      location: 'Default',
      start: startOfDay(new Date()),
      end: endOfDay(new Date())
    };

    this.lagomEventsService.addLagomEvent(newEvent).subscribe((response) => {
      if (
        response.businessServiceStatus ===
        BusinessServiceResponseStatus.Completed
      ) {
        this.snackBarManager.showSuccess(response.businessServiceMessages[0]);
        this.refreshCalendarEvents();
      } else {
        this.snackBarManager.showError(
          response.businessServiceMessages.join(', ')
        );
      }
    });
  }

  updateEvent(eventToUpdate: CalendarEvent) {
    const lagomEvent = eventToUpdate.meta as LagomEvent;
    this.lagomEventsService
      .updateLagomEvent(lagomEvent)
      .subscribe((response) => {
        if (
          response.businessServiceStatus ===
          BusinessServiceResponseStatus.Completed
        ) {
          this.snackBarManager.showSuccess(response.businessServiceMessages[0]);
          this.refreshCalendarEvents();
        } else {
          this.snackBarManager.showError(
            response.businessServiceMessages.join(', ')
          );
        }
      });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    const lagomEvent = eventToDelete.meta as LagomEvent;
    this.lagomEventsService
      .deleteLagomEvent(lagomEvent.id)
      .subscribe((response) => {
        if (
          response.businessServiceStatus ===
          BusinessServiceResponseStatus.Completed
        ) {
          this.snackBarManager.showSuccess(response.businessServiceMessages[0]);
          this.refreshCalendarEvents();
        } else {
          this.snackBarManager.showError(
            response.businessServiceMessages.join(', ')
          );
        }
      });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}

