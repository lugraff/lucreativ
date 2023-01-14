import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { IsMobileScreenService } from '@shared/util-screen';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { LoadingInterceptor } from './app/services/loading.interceptor';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([AppRoutingModule, HttpClientModule]),
    HttpClient,
    [
      { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    ],
    [IsMobileScreenService],
  ],
});
