import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule), canActivate:[NoAuthGuard]
  },
  {
    path: 'sesion',
    loadChildren: () => import('./paginas/sesion/sesion.module').then( m => m.SesionPageModule), canActivate:[AuthGuard]
  },
  {
    path: 'forgot',
    loadChildren: () => import('./paginas/forgot/forgot.module').then( m => m.ForgotPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./paginas/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'gastos',
    loadChildren: () => import('./paginas/gastos/gastos.module').then( m => m.GastosPageModule)
  },  {
    path: 'listas',
    loadChildren: () => import('./paginas/listas/listas.module').then( m => m.ListasPageModule)
  },
  {
    path: 'graficos',
    loadChildren: () => import('./paginas/graficos/graficos.module').then( m => m.GraficosPageModule)
  },


 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
