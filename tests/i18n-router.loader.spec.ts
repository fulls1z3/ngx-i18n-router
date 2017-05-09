// angular
import { getTestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';

// libs
import * as _ from 'lodash';

// module
import { I18NRouterLoader, I18NRouterStaticLoader, I18NRouterService } from '../index';
import { testRoutes, testTranslations, testModuleConfig } from './index.spec';

describe('@ngx-i18n-router/core:',
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
  });
