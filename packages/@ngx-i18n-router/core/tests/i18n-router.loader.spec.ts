// angular
import { getTestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';

// libs
import * as _ from 'lodash';

// module
import { I18NRouterLoader, I18NRouterService, I18NRouterStaticLoader } from '../index';
import { testModuleConfig, testRoutes, testTranslations } from './index.spec';

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
            const loadedRoutes = loader.routes;
            const loadedTranslations = loader.translations;

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
                return (Promise.resolve({}));
              }

              get routes(): Routes {
                return _.map(testRoutes, _.cloneDeep);
              }

              get translations(): any {
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
