// angular
import { Routes } from '@angular/router';

// libs
import * as _ from 'lodash';

// module
import { I18NRouterSettings } from './models/i18n-router-settings';

export abstract class I18NRouterLoader {
  abstract get routes(): Routes;

  abstract get translations(): any;

  abstract loadTranslations(): any;
}

export class I18NRouterStaticLoader implements I18NRouterLoader {
  get routes(): Routes {
    return _.map(this.providedSettings.routes, _.cloneDeep);
  }

  get translations(): any {
    return this.providedSettings.translations;
  }

  constructor(private readonly providedSettings: I18NRouterSettings = {}) {
  }

  loadTranslations(): any {
    return Promise.resolve(this.translations);
  }
}
