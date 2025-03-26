import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: 'contacts',
    loadComponent: () => import('./contacts/contacts.component').then((m) => m.ContactsComponent)
  }, {
    path: 'calendar',
    loadComponent: () => import('./calendar/calendar.component').then((m) => m.CalendarComponent)
  }, {
    path: 'events',
    loadComponent: () => import('./events/events.component').then((m) => m.EventsComponent)
  }, {
    path: 'warehouse',
    loadComponent: () => import('./warehouse/warehouse.component').then((m) => m.WarehouseComponent)
  }
];

export default routes;
