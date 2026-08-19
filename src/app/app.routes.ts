import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'student', loadComponent: () => import('./pages/student/student').then(m => m.StudentPage) },
  { path: 'courses', loadComponent: () => import('./pages/courses/courses').then(m => m.Courses) },
  { path: 'marks', loadComponent: () => import('./pages/marks/marks').then(m => m.Marks) },
  { path: 'hostel', loadComponent: () => import('./pages/hostel/hostel').then(m => m.HostelPage) },
  { path: 'transport', loadComponent: () => import('./pages/transport/transport').then(m => m.TransportPage) },
  { path: 'fees', loadComponent: () => import('./pages/fees/fees').then(m => m.FeesPage) },
  { path: 'canteen', loadComponent: () => import('./pages/canteen/canteen').then(m => m.Canteen) },
  { path: '**', redirectTo: '' }
];
