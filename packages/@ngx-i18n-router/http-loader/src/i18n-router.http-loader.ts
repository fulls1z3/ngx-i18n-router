// angular
import { Routes } from '@angular/router';
import { Http } from '@angular/http';

// libs
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
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

  constructor(private readonly http: Http,
              private readonly path: string = '/routes.json',
              private readonly providedSettings: I18NRouterSettings = {}) {
  }

  loadTranslations(): any {
    return this.http.get(this.path)
      .map((res: any) => res.json())
      .toPromise()
      .then((translations: any) => this._translations = translations)
      .catch(() => Promise.reject('Endpoint unreachable!'));
  }
}
