// angular
import { async, inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// libs
import { ConfigLoader, ConfigModule, ConfigService } from '@ngx-config/core';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
import { I18N_ROUTER_PROVIDERS, I18NRouterLoader, I18NRouterModule, I18NRouterService, RAW_ROUTES } from '@ngx-i18n-router/core';

// module
import { I18NRouterConfigLoader } from '../index';

const mockBackendResponse = (connection: MockConnection, response: any) => {
  connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

const testSettings = {
  routes: {
    en: {
      'ROOT.ABOUT': 'about'
    },
    tr: {
      'ROOT.ABOUT': 'hakkinda'
    }
  }
};

const testRoutes: Routes = [];

// test module configuration for each test
const testModuleConfig = (routes: Routes = [], configOptions?: any, i18nRouterOptions?: Array<any>) => {
  // reset the test environment before initializing it.
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
    .configureTestingModule({
      imports: [
        HttpModule,
        RouterTestingModule,
        ConfigModule.forRoot(configOptions),
        I18NRouterModule.forRoot(routes, i18nRouterOptions)
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

describe('@ngx-i18n-router/config-loader:',
  () => {
    beforeEach(() => {
      const configFactory = (http: Http) => new ConfigHttpLoader(http);
      const i18nRouterFactory = (config: ConfigService, rawRoutes: Routes) => new I18NRouterConfigLoader(config, rawRoutes, 'routes');

      testModuleConfig(testRoutes,
        {
          provide: ConfigLoader,
          useFactory: (configFactory),
          deps: [Http]
        },
        [{
          provide: I18NRouterLoader,
          useFactory: (i18nRouterFactory),
          deps: [ConfigService, RAW_ROUTES]
        }]
      );
    });

    describe('I18NRouterConfigLoader',
      () => {
        it('should throw w/o `ConfigService`',
          () => {
            const loader = new I18NRouterConfigLoader(undefined);

            // this will produce error
            expect(() => loader.getTranslations()).toThrowError('No [config] specified!');
          });

        it('should not return any routes & translations unless provided',
          inject([ConfigService],
            (config: ConfigService) => {
              const loader = new I18NRouterConfigLoader(config);
              const loadedRoutes = loader.getRoutes();
              const loadedTranslations = loader.getTranslations();

              expect(loadedRoutes).toEqual([]);
              expect(loadedTranslations).toBeUndefined();
            }));

        it('should be able to retrieve route translations from `ConfigService`',
          async(inject([MockBackend, ConfigService, I18NRouterService],
            (backend: MockBackend, config: ConfigService, i18nRouter: I18NRouterService) => {
              // mock response
              backend.connections.subscribe((c: MockConnection) => mockBackendResponse(c, testSettings));

              config.init()
                .then((settings: any) => {
                  expect(settings).toEqual(testSettings);

                  const loadedTranslations = i18nRouter.loader.getTranslations();
                  expect(loadedTranslations).toEqual(testSettings['routes']);
                });
            })));
      });
  });
