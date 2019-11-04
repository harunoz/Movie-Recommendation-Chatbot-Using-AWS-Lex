import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from 'src/app/auth/auth.component';
import { HomeComponent } from 'src/app/home/home.component';

const routes: Routes = [
{
  path:'login',
  component:AuthComponent
},

{
  path:'home',
  component:HomeComponent
},
{
  path:'',
  redirectTo:'/login',
  pathMatch:'full'
},
{
  path:'**',
  component:AuthComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
