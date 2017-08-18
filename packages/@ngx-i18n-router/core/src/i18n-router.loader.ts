// angular
import { Routes } from '@angular/router';

// libs
import * as _ from 'lodash';

export abstract class I18NRouterLoader {
  abstract loadTranslations(): any;

  abstract getRoutes(): Routes;

  abstract getTranslations(): any;
}

export class I18NRouterStaticLoader implements I18NRouterLoader {
  constructor(private readonly routes?: Routes,
              private readonly translations?: any) {
  }

  loadTranslations(): any {
    return Promise.resolve(this.translations);
  }

  getRoutes(): Routes {
    return _.map(this.routes, _.cloneDeep);
  }

  getTranslations(): any {
    return this.translations;
  }
}
