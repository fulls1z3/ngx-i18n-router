// angular
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Route, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// libs
import { I18N_ROUTER_PROVIDERS, I18NRouterLoader, I18NRouterModule, I18NRouterService } from '@ngx-i18n-router/core';

// module
import { I18NRouterHttpLoader } from '../index';

const testTranslations = {
  en: {
    'ROOT.ABOUT': 'about',
    'ROOT.ABOUT.US': 'us',
    'ROOT.ABOUT.BANANA': 'banana',
    'ROOT.ABOUT.APPLE': 'apple',
    'ROOT.ABOUT.APPLE.PEAR': 'pear',
    'ROOT.ABOUT.PLUM': 'plum',
    CHANGE_LANGUAGE: 'change-language'
  },
  tr: {
    'ROOT.ABOUT': 'hakkinda',
    'ROOT.ABOUT.US': 'biz',
    // "ROOT.ABOUT.BANANA": 'muz',
    'ROOT.ABOUT.APPLE': 'elma',
    'ROOT.ABOUT.APPLE.PEAR': 'armut',
    'ROOT.ABOUT.PLUM': 'erik',
    CHANGE_LANGUAGE: 'dil-secimi'
  }
};
const testRoutes: Routes = [];

export const testModuleConfig = (routes: Array<Route> = [], moduleOptions?: Array<any>) => {
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
    .configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        I18NRouterModule.forRoot(routes, moduleOptions)
      ],
      providers: [I18N_ROUTER_PROVIDERS]
    });
};

describe('@ngx-i18n-router/http-loader:',
  () => {
    describe('I18NRouterHttpLoader',
      () => {
        it('should be able to provide `I18NRouterHttpLoader`',
          () => {
            const i18nRouterFactory = (http: HttpClient) => new I18NRouterHttpLoader(http);

            testModuleConfig(testRoutes, [{
              provide: I18NRouterLoader,
              useFactory: (i18nRouterFactory),
              deps: [HttpClient]
            }]);

            const i18nRouter = TestBed.get(I18NRouterService);

            expect(I18NRouterHttpLoader).toBeDefined();
            expect(i18nRouter.loader).toBeDefined();
            expect(i18nRouter.loader instanceof I18NRouterHttpLoader).toBeTruthy();

            const httpMock = TestBed.get(HttpTestingController);
            httpMock.expectOne({method: 'GET', url: '/routes.json'}).flush(testTranslations);
            httpMock.verify();
          });

        it('should be able to retrieve route translations from the specified `path`',
          () => {
            const i18nRouterFactory = (http: HttpClient) => new I18NRouterHttpLoader(http, '/api/routes', {routes: testRoutes});

            testModuleConfig(testRoutes, [{
              provide: I18NRouterLoader,
              useFactory: (i18nRouterFactory),
              deps: [HttpClient]
            }]);

            const i18nRouter = TestBed.get(I18NRouterService);

            i18nRouter.loader.loadTranslations()
              .then((res: any) => {
                expect(res).toEqual(testTranslations);
              });

            const httpMock = TestBed.get(HttpTestingController);
            const reqs = httpMock.match('/api/routes');

            for (const req of reqs)
              req.flush(testTranslations);

            httpMock.verify();
          });

        it('should throw w/o a valid `endpoint`',
          (done: jest.DoneCallback) => {
            const i18nRouterFactory = (http: HttpClient) => new I18NRouterHttpLoader(http, '/api/wrong-routes', {routes: testRoutes});

            testModuleConfig(testRoutes, [{
              provide: I18NRouterLoader,
              useFactory: (i18nRouterFactory),
              deps: [HttpClient]
            }]);

            const i18nRouter = TestBed.get(I18NRouterService);

            i18nRouter.loader.loadTranslations()
              .catch(err => {
                expect(err).toEqual('Endpoint unreachable!');
                done();
              });

            const httpMock = TestBed.get(HttpTestingController);
            const reqs = httpMock.match('/api/wrong-routes');

            for (const req of reqs)
              req.flush({}, {status: 500, statusText: ''});

            httpMock.verify();
          });
      });
  });
