// angular
import { Routes } from '@angular/router';

// libs
import * as _ from 'lodash';
import { ConfigService } from '@ngx-config/core';
import { I18NRouterLoader } from '@ngx-i18n-router/core';

export class I18NRouterConfigLoader implements I18NRouterLoader {
  constructor(private readonly config: ConfigService,
              private readonly routes?: Routes,
              private readonly group: string = 'routes') {
  }

  loadTranslations(): any {
    return Promise.resolve(undefined);
  }

  getRoutes(): Routes {
    return _.map(this.routes, _.cloneDeep);
  }

  getTranslations(): any {
    if (!this.config)
      throw new Error('No [config] specified!');

    if (!this.config.getSettings())
      return undefined;

    return this.config.getSettings(this.group);
  }
}
