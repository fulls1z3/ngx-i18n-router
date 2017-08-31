// angular
import { Routes } from '@angular/router';

// libs
import * as _ from 'lodash';

export abstract class I18NRouterLoader {
  abstract get routes(): Routes;

  abstract get translations(): any;

  abstract loadTranslations(): any;
}

export class I18NRouterStaticLoader implements I18NRouterLoader {
  constructor(private readonly rawRoutes?: Routes,
              private readonly routeTranslations?: any) {
  }

  get routes(): Routes {
    return _.map(this.rawRoutes, _.cloneDeep);
  }

  get translations(): any {
    return this.routeTranslations;
  }

  loadTranslations(): any {
    return Promise.resolve(this.routeTranslations);
  }
}
