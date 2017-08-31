// angular
import {
  ANALYZE_FOR_ENTRY_COMPONENTS, APP_INITIALIZER, Inject, ModuleWithProviders, NgModule, OpaqueToken, Optional,
  SkipSelf
} from '@angular/core';
import { provideRoutes, Router, RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@angular/router/src/router_config_loader';

// module
import { I18NRouterLoader, I18NRouterStaticLoader } from './src/i18n-router.loader';
import { I18NRouterPipe } from './src/i18n-router.pipe';
import { I18NRouterService, provideChildRoutes } from './src/i18n-router.service';

export * from './src/i18n-router.loader';
export * from './src/i18n-router.pipe';
export * from './src/i18n-router.service';

export const RAW_ROUTES = new OpaqueToken('RAW_ROUTES');
export const I18N_ROUTER_PROVIDERS: Array<any> = [
  I18NRouterService
];

// for AoT compilation
export function i18nRouterFactory(routes: Routes): I18NRouterLoader {
  return new I18NRouterStaticLoader(routes, {});
}

export function initializerFactory(loader: I18NRouterLoader): any {
  // workaround for AoT compilation
  const res = () => loader.loadTranslations();

  return res;
}

export const I18N_ROUTER_FORROOT_GUARD = new OpaqueToken('I18N_ROUTER_FORROOT_GUARD');
export const MODULE_KEY = new OpaqueToken('MODULE_KEY');

@NgModule({
  imports: [RouterModule],
  declarations: [I18NRouterPipe],
  exports: [
    I18NRouterPipe,
    RouterModule
  ]
})
export class I18NRouterModule {
  static forRoot(routes: Routes,
                 configuredProviders: Array<any> = [{
                   provide: I18NRouterLoader,
                   useFactory: (i18nRouterFactory),
                   deps: [RAW_ROUTES]
                 }]): ModuleWithProviders {
    return {
      ngModule: I18NRouterModule,
      providers: [
        ...configuredProviders,
        {
          provide: APP_INITIALIZER,
          useFactory: (initializerFactory),
          deps: [I18NRouterLoader],
          multi: true
        },
        {
          provide: RAW_ROUTES,
          useValue: routes
        },
        {
          provide: I18N_ROUTER_FORROOT_GUARD,
          useFactory: (provideForRootGuard),
          deps: [[Router, new Optional(), new SkipSelf()]]
        }
      ]
    };
  }

  static forChild(routes: Routes, moduleKey: string): ModuleWithProviders {
    return {
      ngModule: I18NRouterModule,
      providers: [
        provideRoutes([]),
        {
          provide: RAW_ROUTES,
          useValue: routes
        },
        {
          provide: MODULE_KEY,
          useValue: moduleKey
        },
        {
          provide: ROUTES,
          useFactory: (provideChildRoutes),
          deps: [I18NRouterService, RAW_ROUTES, MODULE_KEY],
          multi: true
        },
        {
          provide: ANALYZE_FOR_ENTRY_COMPONENTS,
          useValue: routes,
          multi: true
        }
      ]
    };
  }

  constructor(@Optional() @Inject(I18N_ROUTER_FORROOT_GUARD) guard: any) {
    // NOTE: inject token
  }
}

export function provideForRootGuard(router: Router): any {
  if (router)
    throw new Error(
      'I18NRouterModule.forRoot() called twice. Child modules should use I18NRouterModule.forChild() instead.');

  return 'guarded';
}
