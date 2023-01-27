import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/base/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DotknotComponent } from './components/dotknot/dotknot.component';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { ExtendsClassEditorComponent } from './components/extends-class-editor/extends-class-editor.component';

const ROUTES: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: ['featherHome'],
  },
  {
    path: 'file-manager',
    component: FileManagerComponent,
    data: ['featherDatabase'],
  },
  {
    path: 'ec-editor',
    component: ExtendsClassEditorComponent,
    data: ['featherDatabase'],
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
