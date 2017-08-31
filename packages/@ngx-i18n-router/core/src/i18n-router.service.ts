// angular
import { Injectable } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';

// libs
import * as _ from 'lodash';

// module
import { I18NRouterLoader } from './i18n-router.loader';

export const ROOT_ROUTE_PREFIX = 'ROOT';

@Injectable()
export class I18NRouterService {
  languageCode: string;
  useLocalizedRoutes: boolean;

  protected readonly routes: Routes;
  protected translations: any;

  constructor(public readonly loader: I18NRouterLoader,
              private readonly router: Router) {
    this.routes = _.map(this.loader.routes, _.cloneDeep);
  }

  init(useLocalizedRoutes = true): void {
    if (!useLocalizedRoutes)
      return;

    this.useLocalizedRoutes = true;
    this.translations = this.loader.translations;
  }

  changeLanguage(languageCode: string): void {
    if (!this.useLocalizedRoutes)
      return;

    if (!this.translations[languageCode])
      return;

    this.languageCode = languageCode;

    const rawRoutes = this.loader.routes;
    const i18nRoot = _.find(rawRoutes, route => _.get(route, 'data.i18n.isRoot', undefined));

    let routes: Routes = [];

    if (i18nRoot) {
      const rootPath = this.translateRoute(i18nRoot, 'path').path || i18nRoot.path;
      routes = [{
        path: '',
        redirectTo: this.interpolateRoute(rootPath),
        pathMatch: 'full'
      }];
    }

    const translatedRoutes = this.translateRoutes(rawRoutes);
    routes = routes.concat(translatedRoutes);

    this.router.resetConfig(routes);
  }

  getTranslation(key: string): string {
    key = key.replace(/-/, '_');

    return _.get(this.translations, `${this.languageCode}.${key.toUpperCase()}`, undefined);
  }

  translateRoutes(routes: Routes, moduleKey = ''): Routes {
    const translatedRoutes: Array<Route> = [];

    routes.forEach((route: Route) => {
      if (_.isArray(route.children)) {
        if (_.get(route, 'data.i18n.isRoot', false))
          route.path = this.interpolateRoute(route.path);
        else if (route.path)
            route = this.translateRoute(route, 'path', moduleKey);

        route.children = this.translateRoutes(route.children, moduleKey);
      } else if (!moduleKey && route.path === '**')
        route.redirectTo = this.interpolateRoute(route.redirectTo);
      else {
        if (route.path)
          route = this.translateRoute(route, 'path', moduleKey);

        if (route.redirectTo)
          route = this.translateRoute(route, 'redirectTo', moduleKey);
      }

      translatedRoutes.push(route);
    });

    return translatedRoutes;
  }

  private interpolateRoute(path: string): string {
    if (!path || path.length === 0)
      return this.languageCode;

    path = _.filter(path.split('/'), (segment: string) => !!segment).join('/');

    return `${this.languageCode}/${path}`;
  }

  private translateRoute(route: Route, property: string, moduleKey = ''): Route {
    const translateBatch: Array<string> = [];
    let batchKey = '';

    const key = _.filter(route[property].split('/'), segment => segment);
    const isRedirection = property === 'redirectTo' && _.startsWith(route[property], '/');

    (key as Array<string>).forEach((segment: any, index: number) => {
      let prefix = '';

      let currentKey = `${ROOT_ROUTE_PREFIX}.${moduleKey && !isRedirection ? `${moduleKey}.` : ''}${segment}`;

      if (index === 0) {
        prefix = this.getTranslation(currentKey);

        if (prefix) {
          if (isRedirection)
            translateBatch.push(this.languageCode);

          batchKey = currentKey;
        }
      }

      currentKey = index === 0 ? (prefix ? batchKey : segment) : `${batchKey}.${segment}`;
      const translatedSegment = !_.startsWith(segment, ':') ? this.getTranslation(currentKey) : '';

      if (translatedSegment)
        batchKey = currentKey;

      translateBatch.push(translatedSegment || segment);
    });

    route[property] = translateBatch.join('/');

    if (isRedirection)
      route[property] = `/${route[property]}`;

    return route;
  }
}

export function provideChildRoutes(i18nRouter: I18NRouterService, routes: Routes, moduleKey: string): Routes {
  if (!i18nRouter.useLocalizedRoutes)
    return routes;

  return i18nRouter.translateRoutes(routes, moduleKey);
}
