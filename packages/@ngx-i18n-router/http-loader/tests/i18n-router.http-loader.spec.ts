// angular
import { async, getTestBed, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Route, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// libs
import { I18N_ROUTER_PROVIDERS, I18NRouterLoader, I18NRouterModule, I18NRouterService } from '@ngx-i18n-router/core';

// module
import { I18NRouterHttpLoader } from '../index';

const mockBackendResponse = (connection: MockConnection, response: any) => {
  connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

const mockBackendError = (connection: MockConnection, error: string) => {
  connection.mockError(new Error(error));
};

export const testTranslations = {
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
    // "ROOT.ABOUT.BANANA": 'muz', // commented on purpose
    'ROOT.ABOUT.APPLE': 'elma',
    'ROOT.ABOUT.APPLE.PEAR': 'armut',
    'ROOT.ABOUT.PLUM': 'erik',
    CHANGE_LANGUAGE: 'dil-secimi'
  }
};

const testRoutes: Routes = [];

// test module configuration for each test
export const testModuleConfig = (routes: Array<Route> = [], moduleOptions?: Array<any>) => {
  // reset the test environment before initializing it.
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
    .configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        I18NRouterModule.forRoot(routes, moduleOptions)
      ],
      providers: [
        {
          provide: Http,
          useFactory: (mockBackend: MockBackend, options: BaseRequestOptions) => {
            return new Http(mockBackend, options);
          },
          deps: [
            MockBackend,
            BaseRequestOptions
          ]
        },
        MockBackend,
        BaseRequestOptions,
        I18N_ROUTER_PROVIDERS
      ]
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
          const i18nRouterFactory = (http: Http) => new I18NRouterHttpLoader(http, testRoutes, '/api/get-routes');

          testModuleConfig(testRoutes, [{
            provide: I18NRouterLoader,
            useFactory: (i18nRouterFactory),
            deps: [Http]
          }]);
        });

        it('should be able to retrieve route translations from the specified `path`',
          async(inject([MockBackend, I18NRouterService],
            (backend: MockBackend, i18nRouter: I18NRouterService) => {
              // mock response
              backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, testTranslations));

              i18nRouter.loader.loadTranslations()
                .then((res: any) => {
                  expect(res).toEqual(testTranslations);
                });
            })));

        it('should throw w/o a valid `path`',
          async(inject([MockBackend, I18NRouterService],
            (backend: MockBackend, i18nRouter: I18NRouterService) => {
              // mock error
              backend.connections.subscribe((c: MockConnection) => mockBackendError(c, '500'));

              // this will produce error at the backend
              i18nRouter.loader.loadTranslations()
                .catch((res: any) => {
                  expect(res).toEqual('Endpoint unreachable!');

                  const loadedTranslations = i18nRouter.loader.getTranslations();
                  expect(loadedTranslations).toBeUndefined();
                });
            })));
      });
  });
