import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { AreaComponent } from './pages/area/area.component';


const routes: Routes = [
  { path: '', redirectTo: 'area', pathMatch: 'full' },
  { path: 'login', redirectTo: 'area', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'area', component: AreaComponent },
  { path: 'pageNotFound', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, PageNotFoundComponent]
