// angular
import { async, getTestBed, inject } from '@angular/core/testing';
import { Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Routes } from '@angular/router';

// libs
import * as _ from 'lodash';

// module
import { I18NRouterLoader, I18NRouterStaticLoader, I18NRouterHttpLoader, I18NRouterService } from '../index';
import { testRoutes, testTranslations, testModuleConfig } from './index.spec';

const mockBackendResponse = (connection: MockConnection, response: any) => {
  connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

const mockBackendError = (connection: MockConnection, error: string) => {
  connection.mockError(new Error(error));
};

describe('@nglibs/i18n-router:',
  () => {
    beforeEach(() => {
      const i18nRouterFactory = () => new I18NRouterStaticLoader(testRoutes, testTranslations);

      testModuleConfig(testRoutes, [{
        provide: I18NRouterLoader,
        useFactory: (i18nRouterFactory)
      }]);
    });

    describe('I18NRouterLoader',
      () => {
        it('should not return any routes & translations unless provided',
          () => {
            const loader = new I18NRouterStaticLoader();
            const loadedRoutes = loader.getRoutes();
            const loadedTranslations = loader.getTranslations();

            expect(loadedRoutes).toEqual([]);
            expect(loadedTranslations).toBeUndefined();
          });

        it('should be able to provide `I18NRouterStaticLoader`',
          () => {
            const i18nRouterFactory = () => new I18NRouterStaticLoader(testRoutes, testTranslations);

            testModuleConfig(testRoutes, [{
              provide: I18NRouterLoader,
              useFactory: (i18nRouterFactory)
            }]);

            const injector = getTestBed();
            const i18nRouter = injector.get(I18NRouterService);

            expect(I18NRouterStaticLoader).toBeDefined();
            expect(i18nRouter.loader).toBeDefined();
            expect(i18nRouter.loader instanceof I18NRouterStaticLoader).toBeTruthy();
          });

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

        it('should be able to provide any `I18NRouterLoader`',
          () => {
            class CustomLoader implements I18NRouterLoader {
              loadTranslations(): any {
                return Promise.resolve({});
              }

              getRoutes(): Routes {
                return _.map(testRoutes, _.cloneDeep);
              }

              getTranslations(): any {
                return testTranslations;
              }
            }

            testModuleConfig(testRoutes, [{
              provide: I18NRouterLoader,
              useClass: CustomLoader
            }]);

            const injector = getTestBed();
            const i18nRouter = injector.get(I18NRouterService);

            expect(CustomLoader).toBeDefined();
            expect(i18nRouter.loader).toBeDefined();
            expect(i18nRouter.loader instanceof CustomLoader).toBeTruthy();
          });
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
