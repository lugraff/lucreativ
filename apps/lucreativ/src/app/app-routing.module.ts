import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/base/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { DotknotComponent } from './components/dotknot/dotknot.component';

const ROUTES: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: ['featherHome'],
  },
  {
    path: 'text-editor',
    component: TextEditorComponent,
    data: ['featherBook'],
  },
  {
    path: 'dotknot',
    component: DotknotComponent,
    data: ['featherCodesandbox'],
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'page-not-found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
