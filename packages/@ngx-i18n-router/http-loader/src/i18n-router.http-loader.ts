// angular
import { HttpClient } from '@angular/common/http';
import { Routes } from '@angular/router';

// libs
import * as _ from 'lodash';
import { I18NRouterLoader, I18NRouterSettings } from '@ngx-i18n-router/core';

export class I18NRouterHttpLoader implements I18NRouterLoader {
  private _translations: any;

  get routes(): Routes {
    return _.map(this.providedSettings.routes, _.cloneDeep);
  }

  get translations(): any {
    return this._translations;
  }

  constructor(private readonly http: HttpClient,
              private readonly path: string = '/routes.json',
              private readonly providedSettings: I18NRouterSettings = {}) {
  }

  loadTranslations(): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.path)
        .subscribe(res => {
          this._translations = res;

          return resolve(res);
        }, () => reject('Endpoint unreachable!'));
    });
  }
}
