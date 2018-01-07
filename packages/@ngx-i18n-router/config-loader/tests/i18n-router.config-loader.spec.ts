// angular
import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// libs
import { ConfigLoader, ConfigModule, ConfigService } from '@ngx-config/core';
import { ConfigHttpLoader } from '@ngx-config/http-loader';
import { I18N_ROUTER_PROVIDERS, I18NRouterLoader, I18NRouterModule, I18NRouterService, RAW_ROUTES } from '@ngx-i18n-router/core';

// module
import { I18NRouterConfigLoader } from '../index';

export const testSettings = {
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

const testModuleConfig = (routes: Routes = [], configOptions?: any, i18nRouterOptions?: Array<any>) => {
  TestBed.resetTestEnvironment();

  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())
    .configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ConfigModule.forRoot(configOptions),
        I18NRouterModule.forRoot(routes, i18nRouterOptions)
      ],
      providers: [I18N_ROUTER_PROVIDERS]
    });
};

describe('@ngx-i18n-router/config-loader:',
  () => {
    beforeEach(() => {
      const configFactory = (http: HttpClient) => new ConfigHttpLoader(http);
      const i18nRouterFactory = (config: ConfigService, rawRoutes: Routes) => new I18NRouterConfigLoader(config, 'routes',
        {routes: rawRoutes});

      testModuleConfig(testRoutes,
        {
          provide: ConfigLoader,
          useFactory: (configFactory),
          deps: [HttpClient]
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

            expect(() => loader.translations).toThrowError('No [config] specified!');
          });

        it('should not return any routes & translations unless provided',
          inject([ConfigService],
            (config: ConfigService) => {
              const loader = new I18NRouterConfigLoader(config);
              const loadedRoutes = loader.routes;
              const loadedTranslations = loader.translations;

              expect(loadedRoutes).toEqual([]);
              expect(loadedTranslations).toBeUndefined();
            }));

        it('should be able to retrieve route translations from `ConfigService`',
          async(inject([ConfigService, I18NRouterService],
            (config: ConfigService, i18nRouter: I18NRouterService) => {
              config.init()
                .then((settings: any) => {
                  expect(settings).toEqual(testSettings);

                  const loadedTranslations = i18nRouter.loader.translations;
                  expect(loadedTranslations).toEqual(testSettings['routes']);
                });

              const httpMock = TestBed.get(HttpTestingController);
              const reqs = httpMock.match('/config.json');

              for (const req of reqs)
                req.flush(testSettings);

              httpMock.verify();
            })));
      });
  });
