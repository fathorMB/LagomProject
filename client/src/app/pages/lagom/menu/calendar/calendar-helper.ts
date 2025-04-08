import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { LagomEvent } from 'src/app/models/lagom-events/lagom-event.model';

export class CalendarHelper {
  // To remove when API call will be implemented
  private static ID_INDEX: number = 10;
  static getNextId(): number { return this.ID_INDEX++; }
  // End of to remove when API call will be implemented

  static mapLagomEventToCalendarEvent(lagomEvent: LagomEvent, actions: CalendarEventAction[]): CalendarEvent<LagomEvent> {
    const calendarEvent: CalendarEvent<LagomEvent> = {
      id: lagomEvent.id,
      start: lagomEvent.start,
      end: lagomEvent.end,
      title: lagomEvent.name,
      meta: lagomEvent,
      allDay: true,
      draggable: true,
      resizable: { beforeStart: true, afterEnd: true },
      actions: actions
    } as CalendarEvent<LagomEvent>;

    if (this.isEventPassed(lagomEvent)) {
      calendarEvent.color = { primary: '#9CA3AF', secondary: '#9CA3AF' }; // Set COLOR_GRAY
      calendarEvent.actions = []; // Remove actions for passed events
      calendarEvent.draggable = false;  // Disable dragging for passed events
      calendarEvent.resizable = { beforeStart: false, afterEnd: false };   // Disable resizing for passed events
      return calendarEvent;
    }

    if (this.isEventActive(lagomEvent)) {
      calendarEvent.actions = []; // Remove actions for active events (except view bill of materials and view contacts in future)
      calendarEvent.draggable = false;  // Disable dragging for active events
      calendarEvent.resizable = { beforeStart: false, afterEnd: false };   // Disable resizing for active events    
      if (lagomEvent.billOfMaterials && lagomEvent.billOfMaterials.length > 0) {
        calendarEvent.color = { primary: '#059669', secondary: '#059669' }; // Set COLOR_GREEN
        return calendarEvent;
      } else {
        calendarEvent.color = { primary: '#FBBF24', secondary: '#FBBF24' }; // Set COLOR_YELLOW
        return calendarEvent;
      }
    } else {
      if (lagomEvent.billOfMaterials && lagomEvent.billOfMaterials.length > 0) {
        calendarEvent.color = { primary: '#F97316', secondary: '#F97316' }; // Set COLOR_ORANGE
        return calendarEvent;
      } else {
        calendarEvent.color = { primary: '#EF4444', secondary: '#EF4444' }; // Set COLOR_RED
        return calendarEvent;
      }
    }
  }

  private static normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }
  private static isDateInRange(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  }
  private static isEventActive(lagomEvent: LagomEvent): boolean {
    const today: Date = this.normalizeDate(new Date());
    const start: Date = this.normalizeDate(new Date(lagomEvent.start));
    const end: Date = this.normalizeDate(new Date(lagomEvent.end));
    return this.isDateInRange(today, start, end);
  }
  private static isEventPassed(lagomEvent: LagomEvent): boolean {
    const today: Date = this.normalizeDate(new Date());
    const end: Date = this.normalizeDate(new Date(lagomEvent.end));
    return today > end;
  }
}
