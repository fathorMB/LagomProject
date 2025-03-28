import { VexRoutes } from '@vex/interfaces/vex-route.interface';

const routes: VexRoutes = [
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then((m) => m.UsersComponent)
  }
];

export default routes;
