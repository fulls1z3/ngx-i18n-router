// angular
import { fakeAsync, getTestBed, inject, TestBed } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';

// module
import { I18NRouterLoader, I18NRouterService, I18NRouterStaticLoader } from '../index';
import { TestBootstrapComponent, TestComponent, testModuleConfig, testRoutes, testTranslations } from './index.spec';

describe('@ngx-i18n-router/core:',
  () => {
    beforeEach(() => {
      const i18nRouterFactory = () => new I18NRouterStaticLoader({
        routes: testRoutes,
        translations: testTranslations
      });

      testModuleConfig(testRoutes, [{
        provide: I18NRouterLoader,
        useFactory: (i18nRouterFactory)
      }]);
    });

    describe('I18NRouterService',
      () => {
        it('is defined',
          inject([I18NRouterService],
            (i18nRouter: I18NRouterService) => {
              expect(I18NRouterService).toBeDefined();
              expect(i18nRouter).toBeDefined();
              expect(i18nRouter instanceof I18NRouterService).toBeTruthy();
            }));

        it('should not translate routes w/o default initialization',
          inject([I18NRouterService],
            (i18nRouter: I18NRouterService) => {
              const injector = getTestBed();
              const router = injector.get(Router);

              spyOn(router, 'resetConfig').and.callThrough();

              i18nRouter.init(false);
              i18nRouter.changeLanguage('en');

              expect(router.resetConfig).not.toHaveBeenCalled();
              expect(router.config).toEqual(testRoutes);

              const fixture = TestBed.createComponent(TestBootstrapComponent);
              fixture.detectChanges();

              router.navigate(['/'])
                .then(() => {
                  expect(router.url).toEqual('/');
                });
            }));

        it('should not translate routes w/o translations',
          inject([Router, I18NRouterService],
            (router: Router, i18nRouter: I18NRouterService) => {
              spyOn(router, 'resetConfig').and.callThrough();

              i18nRouter.init();
              i18nRouter.changeLanguage('fr');

              expect(router.resetConfig).not.toHaveBeenCalled();
              expect(router.config).toEqual(testRoutes);
            }));

        it('should be able to `partly` translate routes w/missing translations',
          fakeAsync(inject([I18NRouterService],
            (i18nRouter: I18NRouterService) => {
              const injector = getTestBed();
              const router = injector.get(Router);

              i18nRouter.init();
              i18nRouter.changeLanguage('tr');

              const fixture = TestBed.createComponent(TestBootstrapComponent);
              fixture.detectChanges();

              router.navigate(['/tr/hakkinda/banana'])
                .then(() => {
                  expect(router.url).toEqual('/tr/hakkinda/banana');
                });
            })));

        it('should be able to `catchall` redirect to `i18n-root`',
          fakeAsync(inject([I18NRouterService],
            (i18nRouter: I18NRouterService) => {
              const injector = getTestBed();
              const router = injector.get(Router);

              i18nRouter.init();
              i18nRouter.changeLanguage('en');

              const fixture = TestBed.createComponent(TestBootstrapComponent);
              fixture.detectChanges();

              router.navigate(['/about'])
                .then(() => {
                  expect(router.url).toEqual('/en');
                });
            })));

        it('should be able to translate `path` property of routes',
          fakeAsync(inject([I18NRouterService],
            (i18nRouter: I18NRouterService) => {
              const injector = getTestBed();
              const router = injector.get(Router);

              i18nRouter.init();
              i18nRouter.changeLanguage('tr');

              const fixture = TestBed.createComponent(TestBootstrapComponent);
              fixture.detectChanges();

              router.navigate(['/tr/hakkinda'])
                .then(() => {
                  expect(router.url).toEqual('/tr/hakkinda');
                });
            })));

        it('should be able to translate `redirectTo` property of routes',
          fakeAsync(inject([I18NRouterService],
            (i18nRouter: I18NRouterService) => {
              const injector = getTestBed();
              const router = injector.get(Router);

              i18nRouter.init();
              i18nRouter.changeLanguage('tr');

              const fixture = TestBed.createComponent(TestBootstrapComponent);
              fixture.detectChanges();

              router.navigate(['/tr/hakkinda/erik'])
                .then(() => {
                  expect(router.url).toEqual('/tr/hakkinda/banana');
                });
            })));

        it('should be able to translate routes outside the `i18n-root`',
          fakeAsync(inject([I18NRouterService],
            (i18nRouter: I18NRouterService) => {
              const injector = getTestBed();
              const router = injector.get(Router);

              i18nRouter.init();
              i18nRouter.changeLanguage('tr');

              const fixture = TestBed.createComponent(TestBootstrapComponent);
              fixture.detectChanges();

              router.navigate(['/dil-secimi/en'])
                .then(() => {
                  expect(router.url).toEqual('/dil-secimi/en');
                });
            })));

        it('should be able to translate routes w/`i18n-root` route `non-empty` string',
          fakeAsync(() => {
            const someRoutes: Routes = [
              {
                path: 'home',
                component: TestBootstrapComponent,
                children: [
                  {
                    path: '',
                    component: TestComponent
                  },
                  {
                    path: 'about',
                    component: TestComponent
                  }
                ],
                data: {
                  i18n: {
                    isRoot: true
                  }
                }
              }
            ];

            const someTranslations = {
              en: {
                'ROOT.HOME': 'home',
                'ROOT.ABOUT': 'about'
              },
              tr: {
                'ROOT.HOME': 'ana-sayfa',
                'ROOT.ABOUT': 'hakkinda'
              }
            };

            const i18nRouterFactory = () => new I18NRouterStaticLoader({
              routes: someRoutes,
              translations: someTranslations
            });

            testModuleConfig(someRoutes, [{
              provide: I18NRouterLoader,
              useFactory: (i18nRouterFactory)
            }]);

            const injector = getTestBed();
            const router = injector.get(Router);
            const i18nRouter = injector.get(I18NRouterService);

            i18nRouter.init();
            i18nRouter.changeLanguage('tr');

            const fixture = TestBed.createComponent(TestBootstrapComponent);
            fixture.detectChanges();

            router.navigate(['/tr/ana-sayfa'])
              .then(() => {
                expect(router.url).toEqual('/tr/ana-sayfa');
              });
          }));

        it('should be able to translate routes w/o `i18n-root`',
          fakeAsync(() => {
            const someRoutes: Routes = [
              {
                path: 'home',
                component: TestBootstrapComponent,
                children: [
                  {
                    path: '',
                    component: TestComponent
                  },
                  {
                    path: 'about',
                    component: TestComponent
                  }
                ]
              }
            ];

            const someTranslations = {
              en: {
                HOME: 'home',
                ABOUT: 'about'
              },
              tr: {
                HOME: 'ana-sayfa',
                ABOUT: 'hakkinda'
              }
            };

            const i18nRouterFactory = () => new I18NRouterStaticLoader({
              routes: someRoutes,
              translations: someTranslations
            });

            testModuleConfig(someRoutes, [{
              provide: I18NRouterLoader,
              useFactory: (i18nRouterFactory)
            }]);

            const injector = getTestBed();
            const router = injector.get(Router);
            const i18nRouter = injector.get(I18NRouterService);

            i18nRouter.init();
            i18nRouter.changeLanguage('tr');

            const fixture = TestBed.createComponent(TestBootstrapComponent);
            fixture.detectChanges();

            router.navigate(['/ana-sayfa'])
              .then(() => {
                expect(router.url).toEqual('/ana-sayfa');
              });
          }));
      });
  });
