import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: 'contacts',
    loadComponent: () => import('./contacts/contacts.component').then((m) => m.ContactsComponent)
  }
];

export default routes;
