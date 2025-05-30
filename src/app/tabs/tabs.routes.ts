import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'tab4',
        loadComponent: () =>
          import('../pages/heroes/heroes.page').then((m) => m.HeroesPage),
      },
      {
        path: 'tab5',
        loadComponent: () =>
          import('../pages/grupo-multimedia/grupo-multimedia.page').then((m) => m.GrupoMultimediaPage),
      },      {
        path: 'multimedia',
        loadComponent: () =>
          import('../pages/multimedia/multimedia.page').then((m) => m.MultimediaPage),
      },
      {
        path: 'multimediaheroe',
        loadComponent: () =>
          import('../pages/multimediaheroe/multimediaheroe.page').then((m) => m.MultimediaHeroePage),
      },
      
      {
        path: '',
        redirectTo: '/tabs/tab4',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab4',
    pathMatch: 'full',
  },
];
