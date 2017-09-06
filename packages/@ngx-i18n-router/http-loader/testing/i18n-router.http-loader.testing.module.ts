// angular
import { NgModule } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

// module
import { fakeBackendFactory } from './mocks/i18n-router-backend.mock';

export * from './mocks/i18n-router-backend.mock';

@NgModule({
  providers: [
    {
      provide: Http,
      useFactory: fakeBackendFactory,
      deps: [
        MockBackend,
        BaseRequestOptions
      ]
    },
    MockBackend,
    BaseRequestOptions
  ]
})
export class I18NRouterHttpLoaderTestingModule {
}
