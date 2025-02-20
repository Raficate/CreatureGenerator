import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'creature-generator',
    pathMatch: 'full',
  },
  {
    path: 'creature-generator',
    loadComponent: () => import('./creature-generator/creature-generator.page').then( m => m.CreatureGeneratorPage)
  },
];
