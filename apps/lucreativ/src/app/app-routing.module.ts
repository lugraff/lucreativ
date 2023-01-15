import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/base/welcome.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const ROUTES: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
