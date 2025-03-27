import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: 'contacts',
    loadComponent: () => import('./contacts/contacts.component').then((m) => m.ContactsComponent)
  }, {
    path: 'warehouse',
    loadComponent: () => import('./warehouse/warehouse.component').then((m) => m.WarehouseComponent)
  }
];

export default routes;
