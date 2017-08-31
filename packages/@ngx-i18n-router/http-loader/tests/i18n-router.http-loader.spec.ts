// angular
import { async, getTestBed, inject, TestBed } from '@angular/core/testing';
import { Http } from '@angular/http';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Route, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// libs
import { I18N_ROUTER_PROVIDERS, I18NRouterLoader, I18NRouterModule, I18NRouterService } from '@ngx-i18n-router/core';

// module
import { I18NRouterHttpLoaderTestingModule, testTranslations } from '../testing/i18n-router.http-loader.testing.module';
import { I18NRouterHttpLoader } from '../index';

const testRoutes: Routes = [];

export const testModuleConfig = (routes: Array<Route> = [], moduleOptions?: Array<any>) => {
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
    .configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        I18NRouterModule.forRoot(routes, moduleOptions),
        I18NRouterHttpLoaderTestingModule
      ],
      providers: [I18N_ROUTER_PROVIDERS]
    });
};

describe('@ngx-i18n-router/http-loader:',
  () => {
    it('should be able to provide `I18NRouterHttpLoader`',
      () => {
        const i18nRouterFactory = (http: Http) => new I18NRouterHttpLoader(http);

        testModuleConfig(testRoutes, [{
          provide: I18NRouterLoader,
          useFactory: (i18nRouterFactory),
          deps: [Http]
        }]);

        const injector = getTestBed();
        const i18nRouter = injector.get(I18NRouterService);

        expect(I18NRouterHttpLoader).toBeDefined();
        expect(i18nRouter.loader).toBeDefined();
        expect(i18nRouter.loader instanceof I18NRouterHttpLoader).toBeTruthy();
      });

    describe('I18NRouterHttpLoader',
      () => {
        beforeEach(() => {
          const i18nRouterFactory = (http: Http) => new I18NRouterHttpLoader(http, '/api/routes', {routes: testRoutes});

          testModuleConfig(testRoutes, [{
            provide: I18NRouterLoader,
            useFactory: (i18nRouterFactory),
            deps: [Http]
          }]);
        });

        it('should be able to retrieve route translations from the specified `path`',
          async(inject([I18NRouterService],
            (i18nRouter: I18NRouterService) => {
              i18nRouter.loader.loadTranslations()
                .then((res: any) => {
                  expect(res).toEqual(testTranslations);
                });
            })));
      });

    describe('I18NRouterHttpLoader',
      () => {
        beforeEach(() => {
          const i18nRouterFactory = (http: Http) => new I18NRouterHttpLoader(http, '/api/wrong-routes', {routes: testRoutes});

          testModuleConfig(testRoutes, [{
            provide: I18NRouterLoader,
            useFactory: (i18nRouterFactory),
            deps: [Http]
          }]);
        });

        it('should throw w/o a valid `path`',
          inject([I18NRouterService],
            (i18nRouter: I18NRouterService) => {
              i18nRouter.loader.loadTranslations()
                .catch((res: any) => {
                  expect(res).toEqual('Endpoint unreachable!');

                  const loadedTranslations = i18nRouter.loader.translations;
                  expect(loadedTranslations).toBeUndefined();
                });
            }));
      });
  });
