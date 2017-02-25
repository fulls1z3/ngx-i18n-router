// angular
import { inject } from '@angular/core/testing';
import { Router } from '@angular/router';

// module
import { I18NRouterLoader, I18NRouterStaticLoader, I18NRouterPipe, I18NRouterService } from '../index';
import { testRoutes, testTranslations, testModuleConfig } from './index.spec';

describe('@nglibs/i18n-router:',
  () => {
    beforeEach(() => {
      const i18nRouterFactory = () => new I18NRouterStaticLoader(testRoutes, testTranslations);

      testModuleConfig(testRoutes, [{
        provide: I18NRouterLoader,
        useFactory: (i18nRouterFactory)
      }]);
    });

    describe('I18NRouterPipe',
      () => {
        it('is defined',
          inject([Router, I18NRouterService],
            (router: Router, i18nRouter: I18NRouterService) => {
              const pipe = new I18NRouterPipe(router, i18nRouter);

              expect(I18NRouterPipe).toBeDefined();
              expect(pipe).toBeDefined();
              expect(pipe instanceof I18NRouterPipe).toBeTruthy();
            }));

        it('should not translate routes w/o default initialization',
          inject([Router, I18NRouterService],
            (router: Router, i18nRouter: I18NRouterService) => {
              i18nRouter.init(false);
              i18nRouter.changeLanguage('tr');

              const pipe = new I18NRouterPipe(router, i18nRouter);

              let translatedPath = pipe.transform('');
              expect(translatedPath).toEqual('/');

              translatedPath = pipe.transform(['about', 'us']);
              expect(translatedPath).toEqual('/about/us');
            }));

        it('should not translate routes w/o translations',
          inject([Router, I18NRouterService],
            (router: Router, i18nRouter: I18NRouterService) => {
              i18nRouter.init();
              i18nRouter.changeLanguage('fr');

              const pipe = new I18NRouterPipe(router, i18nRouter);

              let translatedPath = pipe.transform('');
              expect(translatedPath).toEqual('/');

              translatedPath = pipe.transform(['about', 'us']);
              expect(translatedPath).toEqual('/about/us');
            }));

        it('should throw if you provide `non-empty` string query',
          inject([Router, I18NRouterService],
            (router: Router, i18nRouter: I18NRouterService) => {
              i18nRouter.init();
              i18nRouter.changeLanguage('en');

              const pipe = new I18NRouterPipe(router, i18nRouter);

              expect(() => pipe.transform('about'))
                .toThrowError('Query must be an empty string or an array!');
            }));

        it('should be able to partly translate routes w/missing translations',
          inject([Router, I18NRouterService],
            (router: Router, i18nRouter: I18NRouterService) => {
              i18nRouter.init();
              i18nRouter.changeLanguage('tr');

              const pipe = new I18NRouterPipe(router, i18nRouter);

              const translatedPath = pipe.transform(['about', 'banana']);
              expect(translatedPath).toEqual('/tr/hakkinda/banana');
            }));

        it('should be able to translate the `i18n-root` route',
          inject([Router, I18NRouterService],
            (router: Router, i18nRouter: I18NRouterService) => {
              i18nRouter.init();
              i18nRouter.changeLanguage('en');

              const pipe = new I18NRouterPipe(router, i18nRouter);

              const translatedPath = pipe.transform('');
              expect(translatedPath).toEqual('/en');
            }));

        it('should be able to translate a route inside the `i18n-root`',
          inject([Router, I18NRouterService],
            (router: Router, i18nRouter: I18NRouterService) => {
              i18nRouter.init();
              i18nRouter.changeLanguage('tr');

              const pipe = new I18NRouterPipe(router, i18nRouter);

              let translatedPath = pipe.transform(['about', 'us']);
              expect(translatedPath).toEqual('/tr/hakkinda/biz');

              translatedPath = pipe.transform(['about', 'apple', 1, 'pear']);
              expect(translatedPath).toEqual('/tr/hakkinda/elma/1/armut');
            }));

        it('should be able to translate a route outside the `i18n-root`',
          inject([Router, I18NRouterService],
            (router: Router, i18nRouter: I18NRouterService) => {
              i18nRouter.init();
              i18nRouter.changeLanguage('tr');

              const pipe = new I18NRouterPipe(router, i18nRouter);

              const translatedPath = pipe.transform(['change-language', 'en']);
              expect(translatedPath).toEqual('/dil-secimi/en');
            }));
      });
  });
