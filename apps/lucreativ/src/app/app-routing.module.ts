import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/base/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DotknotComponent } from './components/dotknot/dotknot.component';
import { CanDeactivateGuard } from '@shared/util-global';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { PaintComponent } from './components/paint/paint.component';
import { GameEngineComponent } from './components/game-engine/game-engine.component';
import { NetAnimationComponent } from './components/net-animation/net-animation.component';

const ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: ['featherHome', 'Home'],
  },
  {
    path: 'file-manager',
    component: FileManagerComponent,
    data: ['featherDatabase', 'File Manager'],
  },
  // {
  //   path: 'ec-editor',
  //   component: ExtendsClassEditorComponent,
  //   data: ['featherDatabase'],
  //   canDeactivate: [CanDeactivateGuard],
  // },
  {
    path: 'dotknot',
    component: DotknotComponent,
    data: ['featherCodesandbox', 'Dotknot'],
  },
  {
    path: 'paint',
    component: PaintComponent,
    data: ['featherPenTool', 'Paint'],
  },
  {
    path: 'net-animation',
    component: NetAnimationComponent,
    data: ['featherFilm', 'Net Animation'],
  },
  {
    path: 'canvas',
    component: GameEngineComponent,
    data: ['featherBox', 'Games'],
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
  providers: [CanDeactivateGuard],
})
export class AppRoutingModule {}
