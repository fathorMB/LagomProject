import { CalendarEvent, CalendarEventAction } from "angular-calendar";
import { LagomEvent } from "src/app/models/lagom-events/lagom-event.model";

export class CalendarHelper {
    private static readonly DEFAULT_EVENT_COLOR = { primary: '#5C77FF', secondary: '#FFFFFF' }; // Default color blue
    //private static readonly DEFAULT_EVENT_COLOR = { primary: '#F44336', secondary: '#FFFFFF' }; // Default color red
    //private static readonly DEFAULT_EVENT_COLOR = { primary: '#FFC107', secondary: '#FDF1BA' }; // Default color yellow
    
    static mapLagomToCalendarEvent(lagomEvent: LagomEvent, actions: CalendarEventAction[] = []): CalendarEvent {
        return {
            id: lagomEvent.id,
            start: lagomEvent.start,
            end: lagomEvent.end,
            title: lagomEvent.name,
            meta: lagomEvent,
            allDay: true, // Assume all events are all-day
            color: this.DEFAULT_EVENT_COLOR, // Set default color
            draggable: true, // Enable dragging for all events
            resizable: { beforeStart: true, afterEnd: true }, // Allow resizing
            actions: actions // Add any actions here if required
          };            
    }
}