import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './components/base/base.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const BASE_ROUTES: Routes = [
  {
    path: '',
    component: BaseComponent,
  },
  {
    path: 'hotel-page-not-found',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(BASE_ROUTES)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
